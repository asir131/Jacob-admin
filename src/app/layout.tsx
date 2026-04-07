
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google"; // Import DM Sans
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans", // variable for tailwind
});

export const metadata: Metadata = {
  title: "Jacob Dashboard",
  description: "Pixel-perfect dashboard recreation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans bg-light-bg text-brand-700 antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
