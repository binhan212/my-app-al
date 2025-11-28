import type { Metadata } from "next";
import "./globals.css";
import { LayoutContent } from '@/components/layout/LayoutContent'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: "Phường Âu Lâu - Tỉnh Lào Cai",
  description: "Cổng thông tin, kế hoạch và đầu tư phường Âu Lâu, thành phố Lào Cai",
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
