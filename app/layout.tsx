import type { Metadata } from "next"
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "BURNOUT — Corporate Toxicity Intelligence Platform",
  description: "Anonymously expose workplace toxicity. Know your burnout risk. Find your way out.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050708] text-[#F2F6F5]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0E1316",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F2F6F5",
            },
          }}
        />
      </body>
    </html>
  )
}
