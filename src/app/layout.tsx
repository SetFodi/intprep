import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "AI Farte - Premium Interview Practice",
  description: "Master interviews with AI Farte, the most advanced AI interviewer. Get premium feedback and realistic practice sessions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-300 ${inter.className}`}
      >
        <Providers>
          <AuthProvider>
            <div className="flex min-h-screen">
              <Navigation />
              <main className="flex-1 ml-64">
                {children}
              </main>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
