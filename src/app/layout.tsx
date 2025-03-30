import "../components/css/style.css";

import { Inter } from "next/font/google";
import Theme from "../components/providers/theme-provider";
import AppProvider from "../components/providers/app-provider";
import { plPL } from "@clerk/localizations";

import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Hrly",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={plPL}>
      <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
        {/* suppressHydrationWarning: https://github.com/vercel/next.js/issues/44343 */}
        <body className="font-inter antialiased bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
          <Theme>
            <AppProvider>{children}</AppProvider>
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  );
}
