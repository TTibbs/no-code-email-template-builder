import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Email Template Builder",
  description: "Build and manage email templates with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <GlobalHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <Toaster />
        </AuthProvider>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
