// src/app/layout.tsx
"use client";
import "../styles/globals.css";
import { SettingsProvider } from "@/lib/context/SettingsContext";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/UI/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-theme="dark">
      <head />
      <body className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SettingsProvider>
            <NavBar />
            <main className="flex-1 container mx-auto p-4 max-w-6xl">
              {children}
            </main>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
