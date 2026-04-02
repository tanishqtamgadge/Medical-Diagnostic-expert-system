import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Medical Diagnostic Expert System",
  description: "AI-assisted disease prediction using symptoms, rules, and machine learning."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
