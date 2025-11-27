import type { Metadata } from "next";
import "./globals.css";
import { LayoutContent } from '@/components/layout/LayoutContent'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: "Quy hoạch Quốc gia - Bộ Kế hoạch và Đầu tư",
  description: "Cổng thông tin Quy hoạch quốc gia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <SessionProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
