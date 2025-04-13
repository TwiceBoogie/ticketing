import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./provider";

import "@/styles/globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants/metadata";
import { cn } from "@/helpers/common.helper";
import Header from "@/components/ui/Header";
import { Navigation } from "@/components/ui/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TwiceTickets | Buy and Sell Tickets for Your Favorite Events",
  description: SITE_DESCRIPTION,
  // openGraph: {
  //   title: "TwiceTickets | Buy and Sell Tickets for Your Favorite Events",
  //   description:
  //     "TwiceTickets helps you buy and sell tickets for concerts, sports, and other events securely and easily.",
  //   url: "http://twicetickets.com/", // Replace with your actual domain
  //   images: [
  //     {
  //       url: "/twicetickets-logos/twicetickets_logo.png", // Replace with your Open Graph image
  //       width: 1200,
  //       height: 630,
  //       alt: "TwiceTickets",
  //     },
  //   ],
  //   siteName: "TwiceTickets",
  // },
  keywords: [
    "buy tickets",
    "sell tickets",
    "event tickets",
    "concert tickets",
    "sports tickets",
    "secure ticket marketplace",
    "TwiceTickets",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Sets browser UI theme color */}
        <meta name="theme-color" content="#fff" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        {/* manifest crucial for PWA, tells browser how app should behave when installed on users device */}
        <link rel="manifest" href="/site.webmanifest.json" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        {/* Meta info for PWA */}
        <meta name="application-name" content="Twice Tickets" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="h-screen w-full relative flex flex-col overflow-auto">
            <Navigation />
            {children}
          </div>
        </Providers>

        {/* <div className={cn("h-screen w-full relative flex flex-col", "app-container")}>
            <div className="w-full h-full relative">{children}</div>
          </div> */}
      </body>
    </html>
  );
}
