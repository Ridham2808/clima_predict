import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata = {
  title: "ClimaPredict - Weather Forecast for Farmers",
  description: "AI-powered weather forecasting and farming recommendations",
  manifest: "/manifest.json",
  themeColor: "#00D09C",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClimaPredict",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00D09C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ClimaPredict" />
        <link rel="apple-touch-icon" href="/icons/Icon-192.png" />
        <link rel="preconnect" href="https://api.openweathermap.org" />
        <link rel="dns-prefetch" href="https://api.openweathermap.org" />
      </head>
      <body className="antialiased h-full overflow-x-hidden w-full bg-[#0D0D0D] text-white" style={{ 
        maxWidth: '100vw',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        overscrollBehaviorY: 'none'
      }}>
        <div className="w-full min-h-full overflow-x-hidden">
          {children}
          <InstallPrompt />
        </div>
      </body>
    </html>
  );
}
