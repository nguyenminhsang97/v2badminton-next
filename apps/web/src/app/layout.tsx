import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "V2 Badminton — Lớp dạy cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM. Nhóm nhỏ, HLV theo sát, lịch tối và cuối tuần.",
  robots: {
    index: allowIndexing,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
