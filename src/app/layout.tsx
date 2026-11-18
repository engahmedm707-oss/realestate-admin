import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "لوحة إدارة التقييمات العقارية",
  description: "نظام إدخال وحفظ تقارير التقييم العقاري",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
