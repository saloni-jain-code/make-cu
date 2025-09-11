import type { Metadata } from "next";
import './globals.css'
import { Inter, Orbitron } from 'next/font/google'
import ParallaxStars from './components/ParallaxStars'

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
    <html lang="en" className={`${orbitron.variable} ${inter.variable} bg-gradient-to-b from-[#01206a] to-white min-h-screen`}>
      <body className={inter.className}>
      <a 
        id="mlh-trust-badge" 
        // style={{
        //   display: 'block',
        //   maxWidth: '100px',
        //   minWidth: '60px',
        //   position: 'fixed',
        //   right: '50px',
        //   top: 0,
        //   width: '10%',
        //   zIndex: 10000,
        // }}
        className="fixed top-0 right-[20px] z-[10000] w-[60px] md:w-[100px]"
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
        target="_blank">
        <img 
          src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg" 
          alt="Major League Hacking 2026 Hackathon Season" 
          style={{ width: '100%' }}
        ></img>
      </a>

      <ParallaxStars />
        {children}
        </body>
    </html>
  )
}
