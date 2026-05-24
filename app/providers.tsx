"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "ar" | "en" | "ku";
export type Theme = "dark" | "light";

type AppCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within Providers");
  return v;
}

const LANGS: Lang[] = ["ar", "en", "ku"];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang && LANGS.includes(savedLang)) setLang(savedLang);

    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initial: Theme = savedTheme === "dark" ? "dark" : "light";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.lang = lang;
    root.dir = lang === "ar" || lang === "ku" ? "rtl" : "ltr";

    root.classList.toggle("is-ar", lang === "ar");
    root.classList.toggle("is-latin", lang !== "ar");

    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () =>
        setLang((p) => {
          const i = LANGS.indexOf(p);
          return LANGS[(i + 1) % LANGS.length];
        }),
      theme,
      setTheme,
      toggleTheme: () => setThemeState((p) => (p === "dark" ? "light" : "dark")),
    }),
    [lang, theme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
