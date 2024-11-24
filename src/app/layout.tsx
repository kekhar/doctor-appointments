import { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";

import "./globals.css";

// Подключаем шрифты
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: "normal",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "Запись к доктору",
  description: "Запись к доктору",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${openSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
