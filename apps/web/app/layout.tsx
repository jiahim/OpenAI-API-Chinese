import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "OpenAI API 中文文档",
    template: "%s｜OpenAI API 中文文档",
  },
  description: "社区维护的 OpenAI API 中英文文档镜像，支持双语切换和站内链接转换。",
  applicationName: "OpenAI API 中文文档",
  authors: [{ name: "OpenAI-API-Chinese contributors" }],
  openGraph: {
    title: "OpenAI API 中文文档",
    description: "阅读中文译文，随时核对英文原文。",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "OpenAI API 中文文档——读中文，也能随时核对英文原文",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenAI API 中文文档",
    description: "阅读中文译文，随时核对英文原文。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="/llms.txt" rel="describedby" />
      </head>
      <body>
        {children}
        <script
          data-website-id="7136f50d-7292-484d-a837-e42bddae3a5f"
          defer
          src="https://analytics.xiexin.dev/script.js"
        />
      </body>
    </html>
  );
}
