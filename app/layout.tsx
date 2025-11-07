import type { Metadata } from "next";
import './globals.css'
import { Inter, Orbitron } from 'next/font/google'
import ParallaxStars from './components/ParallaxStars'
import { Analytics } from "@vercel/analytics/next"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

export const metadata: Metadata = {
  title: "MakeCU 2025",
  description: "Columbia University Robotics Club's Hardware Hackathon",
  icons: {
    icon: "/tools.svg", // or "/curc-mascot.svg", etc.
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} min-h-screen`}>
      <body className={inter.className}>
      <Analytics />
      <ParallaxStars />
        {/* <NavBar /> */}
          {children}
        <Footer />
        </body>
    </html>
  )
}
