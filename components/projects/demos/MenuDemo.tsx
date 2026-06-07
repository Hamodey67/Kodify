"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { cn } from "@/lib/utils";
import { AppShell, ScreenTransition } from "./AppShell";
import { demoDir, demoT, DemoLang } from "@/lib/projects/demoI18n";

type Cat = "main" | "drinks" | "dessert";

const MENU: Record<
  Cat,
  {
    id: number;
    name: Record<DemoLang, string>;
    price: number;
    img: string;
    desc: Record<DemoLang, string>;
  }[]
> = {
  main: [
    {
      id: 1,
      name: { ar: "برغر كلاسيك", en: "Classic Burger", ku: "بەرگەر" },
      price: 7,
      img: "/demos/menu/m1.webp",
      desc: {
        ar: "لحم + جبن + صوص — خيار سريع ولذيذ.",
        en: "Beef, cheese, and sauce — quick and tasty.",
        ku: "گوشت + پەنیر + سۆس — خێرا و خۆش.",
      },
    },
    {
      id: 2,
      name: { ar: "بيتزا خضار", en: "Veggie Pizza", ku: "پیتزا" },
      price: 9,
      img: "/demos/menu/m2.webp",
      desc: {
        ar: "حجم وسط + إضافات — مناسبة للمشاركة.",
        en: "Medium size with toppings — great to share.",
        ku: "قەبارەی ناوەند + زیادکراوەکان.",
      },
    },
    {
      id: 3,
      name: { ar: "شاورما", en: "Shawarma", ku: "شاوەرما" },
      price: 6,
      img: "/demos/menu/m3.webp",
      desc: {
        ar: "خبز + دجاج + مخلل — كلاسيكية.",
        en: "Bread, chicken, pickles — classic.",
        ku: "نان + مریشک + ترش.",
      },
    },
  ],

  // ✅ عدّلنا المسارات حتى تكون كلها داخل public/demos/menu
  drinks: [
    {
      id: 4,
      name: { ar: "كولا", en: "Cola", ku: "کۆلا" },
      price: 2,
      img: "/demos/menu/drinks_cola.webp",
      desc: { ar: "باردة وطيبة.", en: "Chilled.", ku: "سارد." },
    },
    {
      id: 5,
      name: { ar: "عصير", en: "Juice", ku: "شەربەت" },
      price: 3,
      img: "/demos/menu/drinks_juice.webp",
      desc: { ar: "طازج.", en: "Fresh.", ku: "تازە." },
    },
    {
      id: 8,
      name: { ar: "مي", en: "Water", ku: "ئاو" },
      price: 1,
      img: "/demos/menu/drinks_water.webp",
      desc: { ar: "مبرد.", en: "Cold.", ku: "سارد." },
    },
  ],

  // ✅ خلّينا الحلويات همين داخل demos/menu حتى تكون مرتبة
  dessert: [
    {
      id: 6,
      name: { ar: "كيك", en: "Cake", ku: "کێک" },
      price: 4,
      img: "/demos/menu/dessert_cake.webp",
      desc: {
        ar: "قطعة كيك مع صوص.",
        en: "Cake slice with sauce.",
        ku: "پارچە کێک.",
      },
    },
    {
      id: 7,
      name: { ar: "آيس كريم", en: "Ice Cream", ku: "ئایس کریم" },
      price: 3,
      img: "/demos/menu/dessert_icecream.webp",
      desc: {
        ar: "نكهات متعددة.",
        en: "Multiple flavors.",
        ku: "چەند چێژ.",
      },
    },
  ],
};

export default function MenuDemo() {
  const { lang } = useApp() as { lang: DemoLang };
  const t = demoT[lang];

  const [cat, setCat] = useState<Cat>("main");
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [note, setNote] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});

  const all = useMemo(() => Object.values(MENU).flat(), []);
  const current = MENU[cat];
  const selected = useMemo(
    () => all.find((x) => x.id === detailsId) || null,
    [all, detailsId]
  );

  const itemsCount = useMemo(
    () => Object.values(cart).reduce((s, n) => s + n, 0),
    [cart]
  );

  const total = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const it = all.find((x) => x.id === Number(id));
      return sum + (it ? it.price * qty : 0);
    }, 0);
  }, [cart, all]);

  const add = (id: number) =>
    setCart((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));

  const setQty = (id: number, qty: number) =>
    setCart((p) => {
      const q = Math.max(0, qty);
      const next = { ...p };
      if (q === 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const catLabels = {
    main: t.menu.categories.main,
    drinks: t.menu.categories.drinks,
    dessert: t.menu.categories.dessert,
  } as const;

  return (
    <AppShell
      title={t.menu.title}
      subtitle={`${t.menu.subtitle} • ${t.menu.table}`}
      // ✅ لوگو مال المينيو (بدل مال الستور)
      logoSrc="/kodify.png"
      rightLabel={t.common.demo}
      dir={demoDir(lang)}
    >
      <div className="h-full">
        {/* Categories */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-white/70">{t.menu.table}</div>
            <button
              onClick={() => setOrderOpen(true)}
              className="h-9 px-3 rounded-2xl bg-cyan-400 text-black text-sm font-extrabold"
            >
              {t.menu.yourOrder} ({itemsCount})
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-auto pb-1">
            {(Object.keys(catLabels) as Cat[]).map((k) => (
              <button
                key={k}
                onClick={() => setCat(k)}
                className={cn(
                  "h-9 px-3 rounded-2xl border text-sm font-bold whitespace-nowrap transition",
                  k === cat
                    ? "bg-white text-black border-white"
                    : "border-white/12 bg-white/5 text-white/85 hover:bg-white/10"
                )}
              >
                {catLabels[k]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="px-4 pt-3 pb-4 h-[540px] overflow-hidden">
          <ScreenTransition k={`${cat}-${detailsId ?? "x"}-${orderOpen ? "o" : "c"}`}>
            <div className="h-full overflow-auto pe-1 space-y-3">
              {current.map((it) => (
                <div
                  key={it.id}
                  className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    <button
                      onClick={() => setDetailsId(it.id)}
                      className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black/30 shrink-0"
                      aria-label={t.menu.view}
                    >
                      <Image
                        src={it.img}
                        alt={it.name[lang]}
                        width={128}
                        height={128}
                        className="h-16 w-16 object-cover"
                        unoptimized
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold truncate">{it.name[lang]}</div>
                      <div className="text-xs text-white/60 mt-1 line-clamp-1">
                        {it.desc[lang]}
                      </div>
                      <div className="text-sm text-white/70 mt-1">${it.price}</div>
                    </div>

                    {/* ✅ هنا التعديل الوحيد: نفس القياس + مسافة */}
                    <div className="flex flex-col gap-2 items-end w-[120px]">
                      <button
                        onClick={() => setDetailsId(it.id)}
                        className="h-9 w-full rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10"
                      >
                        {t.menu.view}
                      </button>

                      <button
                        onClick={() => add(it.id)}
                        className="h-9 w-full rounded-2xl bg-cyan-400 text-black text-sm font-extrabold hover:brightness-110 active:scale-[0.99] transition"
                      >
                        {t.menu.addToOrder}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="h-8" />
            </div>

            {/* Details modal */}
            {selected && (
              <div className="absolute inset-0 z-10 grid place-items-center">
                <button
                  className="absolute inset-0 bg-black/70"
                  onClick={() => setDetailsId(null)}
                  aria-label="close"
                />
                <div className="relative w-[92%] rounded-3xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-hidden">
                  <div className="h-40 bg-black/30">
                    <Image
                      src={selected.img}
                      alt={selected.name[lang]}
                      width={900}
                      height={420}
                      className="h-40 w-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-lg font-extrabold">{selected.name[lang]}</div>
                    <div className="text-white/70 text-sm mt-1">{selected.desc[lang]}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xl font-extrabold">${selected.price}</div>
                      <button
                        onClick={() => {
                          add(selected.id);
                          setDetailsId(null);
                        }}
                        className="h-11 px-4 rounded-2xl bg-cyan-400 text-black font-extrabold hover:brightness-110 active:scale-[0.99] transition"
                      >
                        {t.menu.addToOrder}
                      </button>
                    </div>
                    <button
                      onClick={() => setDetailsId(null)}
                      className="mt-3 w-full h-11 rounded-2xl bg-white/10 text-white font-extrabold hover:bg-white/15 transition"
                    >
                      {t.common.back}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order drawer */}
            {orderOpen && (
              <div className="absolute inset-0 z-10">
                <button
                  className="absolute inset-0 bg-black/70"
                  onClick={() => setOrderOpen(false)}
                  aria-label="close"
                />

                <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_-30px_90px_rgba(0,0,0,0.7)] p-4 max-h-[78%] overflow-auto">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-extrabold">{t.menu.yourOrder}</div>
                    <button
                      onClick={() => setOrderOpen(false)}
                      className="h-9 px-3 rounded-2xl bg-white/10 text-white font-extrabold hover:bg-white/15"
                    >
                      {t.common.back}
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {itemsCount === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
                        {t.menu.emptyOrder}
                      </div>
                    ) : (
                      Object.entries(cart).map(([id, qty]) => {
                        const it = all.find((x) => x.id === Number(id));
                        if (!it) return null;
                        return (
                          <div
                            key={id}
                            className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center gap-3"
                          >
                            <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 bg-black/30 shrink-0">
                              <Image
                                src={it.img}
                                alt={it.name[lang]}
                                width={96}
                                height={96}
                                className="h-12 w-12 object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold truncate">{it.name[lang]}</div>
                              <div className="text-xs text-white/60">${it.price}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQty(it.id, qty - 1)}
                                className="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
                              >
                                −
                              </button>
                              <div className="w-8 text-center font-extrabold">{qty}</div>
                              <button
                                onClick={() => setQty(it.id, qty + 1)}
                                className="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 flex items-center justify-between">
                    <div className="text-white/70">{t.common.total}</div>
                    <div className="text-lg font-extrabold">${total.toFixed(2)}</div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-white/60 font-bold mb-2">{t.menu.notes}</div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full min-h-[80px] rounded-2xl border border-white/10 bg-white/5 text-white/90 placeholder:text-white/40 p-3 text-sm outline-none focus:ring-2 focus:ring-cyan-400/30"
                      placeholder={
                        lang === "ar"
                          ? "مثلاً: بدون بصل"
                          : lang === "ku"
                          ? "وەک: بێ پیاز"
                          : "e.g. no onions"
                      }
                    />
                  </div>

                  <button
                    onClick={() => setOrderOpen(false)}
                    className={cn(
                      "mt-3 w-full h-12 rounded-2xl font-extrabold transition",
                      itemsCount === 0
                        ? "bg-white/10 text-white/40"
                        : "bg-cyan-400 text-black hover:brightness-110 active:scale-[0.99]"
                    )}
                    disabled={itemsCount === 0}
                  >
                    {t.menu.send}
                  </button>
                </div>
              </div>
            )}
          </ScreenTransition>
        </div>
      </div>
    </AppShell>
  );
}
