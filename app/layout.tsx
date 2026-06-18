import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

const notoSansJP = Noto_Sans_JP({
  variable: '--font-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const notoSerifJP = Noto_Serif_JP({
  variable: '--font-jp-serif',
  subsets: ['latin'],
  weight: ['400', '600', '900'],
})

export const metadata: Metadata = {
  title: 'KESSHŌ — Personal Operating System',
  description:
    'A premium Japanese-inspired operating system for tracking your weekly fluency, engineering, and university progress in one focused place.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#121014',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
