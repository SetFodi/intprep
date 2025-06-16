import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import Navigation from "@/components/Navigation";
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Interview Prep',
  description: 'Prepare for your next interview with AI-powered practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-64">
              <Navigation />
            </div>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
