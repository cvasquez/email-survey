import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backtalk",
  description: "One-click email surveys. Hear what your audience thinks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Script
          src="https://clickpop.optin.com/content.js?account=cafe8afa-5d70-4100-a8c8-feb3d8115a49"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
