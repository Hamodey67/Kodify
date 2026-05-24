import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";
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
      className="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');}else{document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}}catch(e){document.documentElement.classList.add('light');}})();`,
          }}
        />
      </head>
      <body
        className={[
          "min-h-screen antialiased overflow-x-hidden",
          cairo.variable,
          inter.variable,
        ].join(" ")}
      >
        <Providers>
          <CustomCursor />
          <LayoutClientWrapper>
            {children}
          </LayoutClientWrapper>
        </Providers>
      </body>
    </html>
  );
}


