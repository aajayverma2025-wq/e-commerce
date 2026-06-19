import type { Metadata } from "next";
// Triggering Next.js router cache invalidation
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Premium E-Commerce Platform",
  description: "A modern, premium e-commerce platform inspired by Amazon, Flipkart, and Daraz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <ReduxProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
