import { Cairo, Inter, Noto_Sans_Arabic, Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";
import CodeRain from "@/components/CodeRain";
import CustomCursor from "@/components/CustomCursor";
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
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-arabic",
  display: "swap",
});

// Vazirmatn: أفضل خط لدعم الكردي السوراني (ڕ ڵ ێ ۆ ە)
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
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
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');localStorage.setItem('theme','dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={[
          "min-h-screen antialiased overflow-x-hidden",
          cairo.variable,
          inter.variable,
          notoSansArabic.variable,
          vazirmatn.variable,
        ].join(" ")}
      >
        <Providers>
          {/* <CustomCursor /> */}
          <CodeRain />
          <LayoutClientWrapper>
            {children}
          </LayoutClientWrapper>
        </Providers>
      </body>
    </html>
  );
}


