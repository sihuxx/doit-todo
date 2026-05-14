import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoIt — 할일 관리",
  description: "간단하고 깔끔한 할일 관리 앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 font-sans antialiased">{children}</body>
    </html>
  );
}
