import type { Metadata } from "next";
// Import Poppins dari google fonts
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import NavbarApp from "@/components/NavbarApp";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", // Gunakan variabel CSS
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins", // Definisikan variabel CSS untuk Poppins
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
      {/* Tambahkan variabel font ke dalam body className */}
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