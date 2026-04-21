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
          src="https://cdn.optintest.com/content.js?account=8c3f3496-5006-4148-ab84-37066775e2df"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
