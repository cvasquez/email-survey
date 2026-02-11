import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Survey Tool",
  description: "Simple survey tool for email campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
