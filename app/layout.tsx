import type { Metadata } from "next"
import { Barlow_Condensed, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "BURNOUT — Corporate Toxicity Intelligence Platform",
  description: "Anonymously expose workplace toxicity. Know your burnout risk. Find your way out.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#060507] text-[#F5F5F5]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#18141C",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F5F5F5",
            },
          }}
        />
      </body>
    </html>
  )
}
