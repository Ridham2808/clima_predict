import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";
import DesktopSidebar from "@/components/DesktopSidebar";
import BottomNavigation from "@/components/BottomNavigation";

export const metadata = {
  title: "ClimaPredict - Weather Forecast for Farmers",
  description: "AI-powered weather forecasting and farming recommendations",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClimaPredict",
  },
};

export const viewport = {
  themeColor: "#00D09C",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
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
      <body className="antialiased h-full overflow-x-hidden w-full bg-[#0D0D0D] text-white selection:bg-[#00D09C] selection:text-[#0D0D0D]" style={{
        maxWidth: '100vw',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        WebkitTapHighlightColor: 'transparent',
      }}>
        {/* Animated Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00D09C]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4D9FFF]/10 rounded-full blur-[120px]" />
        </div>

        <DesktopSidebar />

        <div className="relative z-10 w-full min-h-screen md:pl-72 transition-all duration-300">
          <div className="w-full mx-auto bg-[#0D0D0D] md:bg-transparent shadow-[0_0_100px_rgba(0,0,0,0.5)] md:shadow-none border-x border-white/[0.02] md:border-none min-h-screen px-0 md:px-12 md:py-8">
            {children}
            <InstallPrompt />
          </div>
        </div>
        <BottomNavigation />
      </body>
    </html>
  );
}
