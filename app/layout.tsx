import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StaySync - Smart Hostel & PG Management System",
  description:
    "Smart Hostel & PG Management System for seamless room booking, meal planning, and maintenance tracking",
  openGraph: {
    title: "StaySync - Smart Hostel & PG Management System",
    description:
      "Smart Hostel & PG Management System for seamless room booking, meal planning, and maintenance tracking",
    url: "https://staysync-bca.vercel.app",
    siteName: "StaySync",
    images: [
      {
        url: "/logo.png", // You'll need to add a PNG version
        width: 1200,
        height: 630,
        alt: "StaySync Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StaySync - Smart Hostel & PG Management System",
    description:
      "Smart Hostel & PG Management System for seamless room booking, meal planning, and maintenance tracking",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
