import { getBaseURL } from "@lib/util/env"
import type { Metadata } from "next"
import "styles/globals.css"
import { oldPrintingPressVar } from "./fonts"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" data-mode="light" className={oldPrintingPressVar.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}

