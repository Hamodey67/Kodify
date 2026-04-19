import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kodify",
  description: "حلول تقنية آمنة لتسريع نمو أعمالك",
  icons: {
    icon: "/kodify.png",
    apple: "/kodify.png",
  },
};

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultLang = "ar";
  const isArabic = defaultLang === "ar";

  return (
    <html
      lang={defaultLang}
      dir={isArabic ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={[
          "min-h-screen antialiased overflow-x-hidden",
          cairo.className,
          inter.className,
        ].join(" ")}
      >
        <Providers>
          <LayoutClientWrapper>
            {children}
          </LayoutClientWrapper>
        </Providers>
      </body>
    </html>
  );
}


