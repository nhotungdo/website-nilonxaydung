import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonCall from "@/components/ButtonCall";
import ZaloButton from "@/components/ZaloButton";
import AiSalesChatbot from "@/components/AiSalesChatbot";
import { Toaster } from "react-hot-toast";
import { generateSEO } from "@/lib/seo";

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = generateSEO({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased" suppressHydrationWarning>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ButtonCall />
        <ZaloButton />
        <AiSalesChatbot />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
