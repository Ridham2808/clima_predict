import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';
const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1';

const DEFAULT_COORDS = {
  lat: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_LAT || '19.0760',
  lon: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_LON || '72.8777',
  city: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_LABEL || 'Mumbai',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || DEFAULT_COORDS.lat;
    const lon = searchParams.get('lon') || DEFAULT_COORDS.lon;
    const city = searchParams.get('city') || DEFAULT_COORDS.city;

    // Fetch from both APIs in parallel
    const [weatherApiData, openMeteoData] = await Promise.allSettled([
      fetchWeatherAPI(lat, lon),
      fetchOpenMeteo(lat, lon)
    ]);

    // Extract successful results
    const weatherApiResult = weatherApiData.status === 'fulfilled' ? weatherApiData.value : null;
    const openMeteoResult = openMeteoData.status === 'fulfilled' ? openMeteoData.value : null;

    // Calculate averaged data
    const averagedData = calculateAveragedWeather(weatherApiResult, openMeteoResult, city);

    return NextResponse.json(averagedData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

async function fetchWeatherAPI(lat, lon) {
  try {
    const url = `${WEATHERAPI_BASE_URL}/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&aqi=yes`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: data.current.temp_c,
      feelsLike: data.current.feelslike_c,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      windDirection: data.current.wind_dir,
      pressure: data.current.pressure_mb,
      visibility: data.current.vis_km,
      uvIndex: data.current.uv,
      cloudCover: data.current.cloud,
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      location: data.location.name,
      country: data.location.country,
      airQuality: data.current.air_quality ? {
        aqi: Math.round(data.current.air_quality['us-epa-index'] || 1),
        pm25: data.current.air_quality.pm2_5,
        pm10: data.current.air_quality.pm10,
      } : null,
      source: 'WeatherAPI'
    };
  } catch (error) {
    console.error('WeatherAPI fetch error:', error);
    return null;
  }
}

async function fetchOpenMeteo(lat, lon) {
  try {
    const url = `${OPENMETEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;

    return {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: getWindDirection(current.wind_direction_10m),
      cloudCover: current.cloud_cover,
      precipitation: current.precipitation,
      condition: getWeatherConditionFromCode(current.weather_code),
      weatherCode: current.weather_code,
      source: 'Open-Meteo'
    };
  } catch (error) {
    console.error('Open-Meteo fetch error:', error);
    return null;
  }
}

function calculateAveragedWeather(weatherApi, openMeteo, cityName) {
  const sources = [];

  if (weatherApi) sources.push(weatherApi);
  if (openMeteo) sources.push(openMeteo);

  // If no data from either source, return error
  if (sources.length === 0) {
    return {
      error: 'Unable to fetch weather data from any source',
      temperature: 0,
      location: cityName,
      isFallback: true
    };
  }

  // Calculate averages
  const avgTemp = sources.reduce((sum, s) => sum + s.temperature, 0) / sources.length;
  const avgFeelsLike = sources.reduce((sum, s) => sum + (s.feelsLike || s.temperature), 0) / sources.length;
  const avgHumidity = sources.reduce((sum, s) => sum + s.humidity, 0) / sources.length;
  const avgWindSpeed = sources.reduce((sum, s) => sum + s.windSpeed, 0) / sources.length;
  const avgCloudCover = sources.reduce((sum, s) => sum + (s.cloudCover || 0), 0) / sources.length;

  // Determination of condition - prioritize WeatherAPI (more descriptive), fallback to OpenMeteo
  const condition = weatherApi?.condition || openMeteo?.condition || 'Partly Cloudy';

  return {
    temperature: Math.round(avgTemp),
    feelsLike: Math.round(avgFeelsLike),
    humidity: Math.round(avgHumidity),
    windSpeed: Math.round(avgWindSpeed),
    windDirection: weatherApi?.windDirection || openMeteo?.windDirection || 'N',
    pressure: weatherApi?.pressure || 1013,
    visibility: weatherApi?.visibility || 10,
    uvIndex: weatherApi?.uvIndex || (avgTemp > 30 ? 7 : 4),
    cloudCover: Math.round(avgCloudCover),
    dewPoint: calculateDewPoint(avgTemp, avgHumidity),
    condition: condition,
    description: condition,
    icon: getWeatherIconFromCondition(condition),
    location: weatherApi?.location || cityName,
    country: weatherApi?.country || 'IN',
    lastUpdated: new Date().toISOString(),
    airQuality: weatherApi?.airQuality ? {
      ...weatherApi.airQuality,
      category: getAQICategory(weatherApi.airQuality.aqi)
    } : { aqi: 2, category: 'Fair' }, // Minimal AQI fallback
    dataSources: sources.map(s => s.source).join(' + '),
    sourceCount: sources.length
  };
}

function getWeatherConditionFromCode(code) {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
  };
  return codes[code] || 'Partly Cloudy';
}

function getWeatherIconFromCondition(condition) {
  const conditionLower = (condition || '').toLowerCase();
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
  if (conditionLower.includes('partly')) return '⛅';
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return '☁️';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) return '🌧️';
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
  if (conditionLower.includes('smoke') || conditionLower.includes('haze')) return '🌫️';
  return '☀️';
}

function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(deg / 22.5) % 16];
}

function calculateDewPoint(temp, humidity) {
  if (!humidity || humidity <= 0) return Math.round(temp - 15); // Fallback estimate
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100.0);
  return Math.round((b * alpha) / (a - alpha) * 10) / 10;
}

function getAQICategory(aqi) {
  if (aqi <= 1) return 'Good';
  if (aqi <= 2) return 'Fair';
  if (aqi <= 3) return 'Moderate';
  if (aqi <= 4) return 'Poor';
  return 'Very Poor';
}

