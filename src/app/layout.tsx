import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AEGIS INCIDENTS - AI-Powered Incident Postmortems",
  description: "Generate professional incident postmortems in 10 minutes, not 10 hours. Save engineering time and impress stakeholders with executive-ready documentation.",
  keywords: ["incident postmortem", "incident management", "SRE", "DevOps", "outage documentation", "AI"],
  openGraph: {
    title: "AEGIS INCIDENTS - AI-Powered Incident Postmortems",
    description: "Generate professional incident postmortems in 10 minutes, not 10 hours.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
