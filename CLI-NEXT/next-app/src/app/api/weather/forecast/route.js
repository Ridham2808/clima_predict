import { NextResponse } from 'next/server';

const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';
const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1';

const DEFAULT_COORDS = {
  lat: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_LAT || '19.0760',
  lon: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_LON || '72.8777',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || DEFAULT_COORDS.lat;
    const lon = searchParams.get('lon') || DEFAULT_COORDS.lon;

    // Fetch from both APIs in parallel
    const [weatherApiData, openMeteoData] = await Promise.allSettled([
      fetchWeatherAPIForecast(lat, lon),
      fetchOpenMeteoForecast(lat, lon)
    ]);

    const weatherApiResult = weatherApiData.status === 'fulfilled' ? weatherApiData.value : null;
    const openMeteoResult = openMeteoData.status === 'fulfilled' ? openMeteoData.value : null;

    // Merge and average the forecast data
    const mergedForecast = mergeForecastData(weatherApiResult, openMeteoResult);

    return NextResponse.json(mergedForecast);
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    );
  }
}

async function fetchWeatherAPIForecast(lat, lon) {
  try {
    const url = `${WEATHERAPI_BASE_URL}/forecast.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&days=7&aqi=no`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`WeatherAPI forecast error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.forecast.forecastday.map((day, index) => ({
      day: getDayName(index),
      date: formatDate(day.date),
      tempMax: day.day.maxtemp_c,
      tempMin: day.day.mintemp_c,
      precipitation: day.day.daily_chance_of_rain,
      humidity: day.day.avghumidity,
      windSpeed: day.day.maxwind_kph,
      condition: day.day.condition.text,
      icon: day.day.condition.icon,
      source: 'WeatherAPI'
    }));
  } catch (error) {
    console.error('WeatherAPI forecast fetch error:', error);
    return null;
  }
}

async function fetchOpenMeteoForecast(lat, lon) {
  try {
    const url = `${OPENMETEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo forecast error: ${response.status}`);
    }
    
    const data = await response.json();
    const daily = data.daily;
    
    return daily.time.slice(0, 7).map((date, index) => ({
      day: getDayName(index),
      date: formatDate(date),
      tempMax: daily.temperature_2m_max[index],
      tempMin: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_probability_max[index],
      windSpeed: daily.wind_speed_10m_max[index],
      source: 'Open-Meteo'
    }));
  } catch (error) {
    console.error('Open-Meteo forecast fetch error:', error);
    return null;
  }
}

function mergeForecastData(weatherApi, openMeteo) {
  // If both sources failed, return empty array
  if (!weatherApi && !openMeteo) {
    return [];
  }
  
  // If only one source available, use it
  if (!weatherApi) return openMeteo;
  if (!openMeteo) return weatherApi;
  
  // Merge and average both sources
  return weatherApi.map((wDay, index) => {
    const oDay = openMeteo[index];
    
    if (!oDay) return wDay;
    
    return {
      day: wDay.day,
      date: wDay.date,
      tempMax: Math.round((wDay.tempMax + oDay.tempMax) / 2),
      tempMin: Math.round((wDay.tempMin + oDay.tempMin) / 2),
      precipitation: Math.round((wDay.precipitation + oDay.precipitation) / 2),
      humidity: wDay.humidity || 65,
      windSpeed: Math.round((wDay.windSpeed + oDay.windSpeed) / 2),
      condition: wDay.condition || 'Partly Cloudy',
      icon: getWeatherIcon(wDay.condition),
      color: getWeatherColor(wDay.condition),
      dataSources: 'WeatherAPI + Open-Meteo'
    };
  });
}

function getDayName(index) {
  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().getDay();
  
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[(today + index) % 7];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function getWeatherIcon(condition) {
  const conditionLower = (condition || '').toLowerCase();
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
  return '⛅';
}

function getWeatherColor(condition) {
  const conditionLower = (condition || '').toLowerCase();
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '#FFC857';
  if (conditionLower.includes('rain') || conditionLower.includes('storm')) return '#4D9FFF';
  if (conditionLower.includes('cloud')) return '#00D09C';
  return '#00D09C';
}
