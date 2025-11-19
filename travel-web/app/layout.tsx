import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TripGo",
  description: "Travel Web",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-br from-white to-sky-50 text-slate-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
