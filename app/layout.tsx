import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
