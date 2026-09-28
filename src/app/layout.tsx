import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "어르신 복지 안내",
  description:
    "질문 6개로 받으실 수 있는 복지서비스를 찾아드립니다. 로그인도 회원가입도 없습니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
