import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { EnvCheck } from "@/lib/env-check";
import { logEnvValidation } from "@/lib/env";
import "./globals.css";

// Validate environment variables on server
if (typeof window === 'undefined') {
  logEnvValidation();
}

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Inklusif Kerja - Inclusive Work Platform",
  description: "Accessible recruitment platform for Indonesia",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#f59e0b" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Inklusif Kerja",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
          <EnvCheck />
        </ThemeProvider>
      </body>
    </html>
  );
}
