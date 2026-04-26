import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonCall from "@/components/ButtonCall";
import ZaloButton from "@/components/ZaloButton";
import { generateSEO } from "@/lib/seo";

const manrope = Manrope({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = generateSEO({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${manrope.className} min-h-screen flex flex-col bg-[#f9f9ff] text-[#111c2d]`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ButtonCall />
        <ZaloButton />
      </body>
    </html>
  );
}
