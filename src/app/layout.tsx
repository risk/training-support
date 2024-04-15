import type { Metadata } from "next"
import "./globals.css"

import { fonts } from "./fonts"
import { Providers } from "@/app/provider"

export const metadata: Metadata = {
  title: "training-support",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={fonts.rubik.variable}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
