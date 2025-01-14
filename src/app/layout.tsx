import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/providers/ClientProviders";
import { CartDrawerWrapper } from "@/components/features/cart/CartDrawerWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-commerce Dashboard",
  description: "Next.js E-commerce Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <CartDrawerWrapper />
        </ClientProviders>
      </body>
    </html>
  );
}
