"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { cn } from "@/lib/utils";
import { AppShell, ScreenTransition } from "./AppShell";
import { demoDir, demoT, DemoLang } from "@/lib/projects/demoI18n";

const ITEMS: { id: number; name: Record<DemoLang, string>; price: number; img: string }[] = [
  { id: 1, name: { ar: "ماء", en: "Water", ku: "ئاو" }, price: 1, img: "/demos/pos/i1.webp" },
  { id: 2, name: { ar: "قهوة", en: "Coffee", ku: "قاوە" }, price: 2, img: "/demos/pos/i2.webp" },
  { id: 3, name: { ar: "ساندويچ", en: "Sandwich", ku: "ساندویچ" }, price: 4, img: "/demos/pos/i3.webp" },
  { id: 4, name: { ar: "سلطة", en: "Salad", ku: "سەلاتە" }, price: 3, img: "/demos/pos/i4.webp" },
];

export default function PosDemo() {
  const { lang } = useApp() as { lang: DemoLang };
  const t = demoT[lang];

  const [cart, setCart] = useState<Record<number, number>>({});
  const [paid, setPaid] = useState(false);
  const [payMethod, setPayMethod] = useState<"cash" | "card">("cash");

  const itemsCount = useMemo(() => Object.values(cart).reduce((s, n) => s + n, 0), [cart]);
  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const it = ITEMS.find((x) => x.id === Number(id));
      return sum + (it ? it.price * qty : 0);
    }, 0);
  }, [cart]);

  const tax = useMemo(() => Math.round(subtotal * 0.05 * 100) / 100, [subtotal]);
  const total = useMemo(() => Math.round((subtotal + tax) * 100) / 100, [subtotal, tax]);

  const add = (id: number) => {
    setPaid(false);
    setCart((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };

  const setQty = (id: number, qty: number) =>
    setCart((p) => {
      const q = Math.max(0, qty);
      const next = { ...p };
      if (q === 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const clear = () => {
    setCart({});
    setPaid(false);
  };

  return (
    <AppShell
      title={t.pos.title}
      subtitle={`${t.pos.subtitle} • ${t.pos.invoice}`}
      logoSrc="/kodify.png"
      rightLabel={t.common.demo}
      dir={demoDir(lang)}
    >
      <div className="h-full">
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-white/70">
              {itemsCount} {t.common.items}
            </div>
            <button
              onClick={clear}
              className="h-9 px-3 rounded-2xl bg-white/10 text-white font-extrabold hover:bg-white/15"
            >
              {t.common.clear}
            </button>
          </div>
        </div>

        <div className="px-4 pt-3 pb-4 h-[540px] overflow-hidden">
          <ScreenTransition k={`${itemsCount}-${paid}-${payMethod}`}>
            <div className="h-full grid grid-cols-1 gap-3 overflow-auto pe-1">
              {/* Grid of items */}
              <div className="grid grid-cols-2 gap-3">
                {ITEMS.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => add(it.id)}
                    className={cn(
                      "rounded-3xl border border-white/10 bg-white/5 p-3 text-left",
                      "hover:bg-white/10 transition"
                    )}
                  >
                    <div className="h-20 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
                      <Image
                        src={it.img}
                        alt={it.name[lang]}
                        width={300}
                        height={200}
                        className="h-20 w-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="mt-2 font-extrabold truncate">{it.name[lang]}</div>
                    <div className="text-sm text-white/70 mt-1">${it.price}</div>
                    <div className="mt-2 h-9 rounded-2xl bg-cyan-400 text-black font-extrabold grid place-items-center">
                      {t.common.add}
                    </div>
                  </button>
                ))}
              </div>

              {/* Receipt */}
              <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold">{t.pos.invoice}</div>
                  <div className="text-xs text-white/60">KODIFY</div>
                </div>

                <div className="mt-3 space-y-2">
                  {itemsCount === 0 ? (
                    <div className="text-white/60 text-sm">{lang === "ar" ? "اضف عناصر حتى يبين الوصل." : lang === "ku" ? "دانە زیاد بکە بۆ پسوڵە." : "Add items to see the receipt."}</div>
                  ) : (
                    Object.entries(cart).map(([id, qty]) => {
                      const it = ITEMS.find((x) => x.id === Number(id));
                      if (!it) return null;
                      return (
                        <div key={id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-bold truncate">{it.name[lang]}</div>
                            <div className="text-xs text-white/60">
                              {t.pos.qty}: {qty} × ${it.price}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQty(it.id, qty - 1)}
                              className="h-8 w-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
                            >
                              −
                            </button>
                            <div className="w-7 text-center font-extrabold">{qty}</div>
                            <button
                              onClick={() => setQty(it.id, qty + 1)}
                              className="h-8 w-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-white/70">
                    <span>{t.pos.subtotal}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>{t.pos.tax} (5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-extrabold">
                    <span>{t.pos.grandTotal}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPayMethod("cash")}
                    className={cn(
                      "h-10 rounded-2xl border text-sm font-extrabold transition",
                      payMethod === "cash"
                        ? "bg-white text-black border-white"
                        : "border-white/12 bg-white/5 text-white/85 hover:bg-white/10"
                    )}
                  >
                    {t.pos.cash}
                  </button>
                  <button
                    onClick={() => setPayMethod("card")}
                    className={cn(
                      "h-10 rounded-2xl border text-sm font-extrabold transition",
                      payMethod === "card"
                        ? "bg-white text-black border-white"
                        : "border-white/12 bg-white/5 text-white/85 hover:bg-white/10"
                    )}
                  >
                    {t.pos.card}
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (itemsCount === 0) return;
                    setPaid(true);
                    // demo only: leave cart to show receipt
                  }}
                  className={cn(
                    "mt-3 w-full h-12 rounded-2xl font-extrabold transition",
                    itemsCount === 0
                      ? "bg-white/10 text-white/40"
                      : "bg-cyan-400 text-black hover:brightness-110 active:scale-[0.99]"
                  )}
                  disabled={itemsCount === 0}
                >
                  {paid ? t.pos.paid : `${t.pos.pay} (${payMethod === "cash" ? t.pos.cash : t.pos.card})`}
                </button>
              </div>

              <div className="h-8" />
            </div>
          </ScreenTransition>
        </div>
      </div>
    </AppShell>
  );
}
