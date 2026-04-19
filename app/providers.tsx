"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "ar" | "en" | "ku";

type AppCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within Providers");
  return v;
}

const LANGS: Lang[] = ["ar", "en", "ku"];

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    document.documentElement.classList.add("dark");

    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && LANGS.includes(saved)) setLang(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";

    root.classList.toggle("is-ar", lang === "ar");
    root.classList.toggle("is-latin", lang !== "ar");

    localStorage.setItem("lang", lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () =>
        setLang((p) => {
          const i = LANGS.indexOf(p);
          return LANGS[(i + 1) % LANGS.length];
        }),
    }),
    [lang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
