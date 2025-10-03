import localFont from "next/font/local"

export const oldPrintingPressVar = localFont({
  src: [{ path: "../../public/Fonts/Old.ttf", weight: "400", style: "normal" }],
  variable: "--font-oldpress",
  display: "swap",
})
