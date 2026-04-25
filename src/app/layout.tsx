import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "恋愛タイプ診断 | あなたの愛着スタイルと恋愛パターンを分析",
  description:
    "AIがあなたの愛着スタイルと恋愛パターンを分析。相性の良いパートナータイプも診断できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${notoSerifJP.variable} ${zenMaruGothic.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
