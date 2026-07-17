import type { Metadata } from "next";
import { Fraunces, Schibsted_Grotesk } from "next/font/google";
import { Sidebar, BottomNav } from "@/components/Nav";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const ui = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-ui" });

export const metadata: Metadata = {
  title: "GreenChain AI — Farm Advisor for Bhutan",
  description:
    "AI-powered crop selection, plant disease diagnosis, and soil health management for Bhutanese farmers.",
  appleWebApp: { capable: true, title: "GreenChain AI", statusBarStyle: "black-translucent" },
  icons: { apple: "/apple-touch-icon.png" },
};

export const viewport = {
  themeColor: "#0f3826",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable}`}>
      <body>
        <div className="shell">
          <Sidebar />
          <main className="main">
            <div className="content">{children}</div>
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
