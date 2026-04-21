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
          src="https://cdn.optinstage.com/content.js?account=7a3f24bd-c290-4594-9ac6-698a649d3096"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
