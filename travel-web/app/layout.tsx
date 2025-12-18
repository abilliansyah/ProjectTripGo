import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import NavbarApp from "@/components/NavbarApp";
import Footer from "@/components/Footer";
import Script from "next/script"; // 1. Import Script dari next/script

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TripGo - Solusi Perjalanan Modern",
  description: "Platform transportasi minibus nyaman dan aman",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 2. Tambahkan Script Midtrans di dalam head */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive" // Memuat setelah halaman interaktif
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <NavbarApp />
        <div className="min-h-screen">
           {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}