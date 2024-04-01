import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

import { Toaster } from '@/components/ui/toaster'
import NavHeader from '@/components/NavHeader'
import FirebaseAuthProvider from '@/components/FirebaseAuthProvider'
import Subprovider from '@/components/Subprovider'
import { ThemeProvider } from '@/components/ThemeProvider'
import Provider from '@/components/Provider'

const lexend = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Negotiation.AI',
  description: 'Bridging the language gap during buyer-seller negotiations.',
}


export default function RootLayout({
  children, 
}: {
  children: React.ReactNode
}) {
  return (
    <Provider>
    <html lang="en" suppressHydrationWarning={true}>
      <head>
      <script src="https://www.youtube.com/iframe_api"></script>
      </head>
      <body className={cn(lexend.className, 'antialiased min-h-screen border-none outline-none', 'scrollbar scrollbar-thumb scrollbar-thumb-white scrollbar-track-slate-700 bg-gradient-to-br from-rose-400 to-orange-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-600')} suppressHydrationWarning={true}>
            <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
              <FirebaseAuthProvider>
                <Subprovider>
                  {/* <Navbar/> */}
                  <NavHeader/>
                  {children}
                  <Toaster/>
                  {/* <Tools user={undefined}/>  */}
                  {/* <Chat user={undefined}/> */}
                </Subprovider>
              </FirebaseAuthProvider>
            </ThemeProvider>
      </body>
    </html>
    </Provider>
  )
}
