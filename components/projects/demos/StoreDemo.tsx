"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AppShell, BottomNav, ScreenTransition } from "./AppShell";
import { cn } from "@/lib/utils";
import { useApp } from "@/app/providers";
import { demoDir, demoT, DemoLang } from "@/lib/projects/demoI18n";

type Screen = "home" | "details" | "cart" | "checkout";

const PRODUCTS = [
  { id: 1, name: "KODIFY Hoodie", price: 25, img: "/demos/store/p1.webp" },
  { id: 2, name: "Security Mousepad", price: 12, img: "/demos/store/p2.webp" },
  { id: 3, name: "USB-C Hub Pro", price: 29, img: "/demos/store/p3.webp" },
];

export default function StoreDemo() {
  const { lang } = useApp() as { lang: DemoLang };
  const t = demoT[lang];
  const [tab, setTab] = useState<"store" | "orders" | "profile">("store");
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);

  const selected = useMemo(() => PRODUCTS.find((p) => p.id === selectedId) || null, [selectedId]);

  const cartItems = useMemo(() => {
    return cart
      .map((c) => {
        const p = PRODUCTS.find((x) => x.id === c.id);
        return p ? { ...p, qty: c.qty } : null;
      })
      .filter(Boolean) as { id: number; name: string; price: number; img: string; qty: number }[];
  }, [cart]);

  const total = useMemo(() => cartItems.reduce((s, it) => s + it.price * it.qty, 0), [cartItems]);

  const addToCart = (id: number) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const setQty = (id: number, qty: number) => {
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));
  };

  const openDetails = (id: number) => {
    setSelectedId(id);
    setScreen("details");
  };

  return (
    <AppShell
      title={t.store.title}
      subtitle={t.store.subtitle}
      logoSrc="/kodify.png"
      rightLabel={t.common.demo}
      dir={demoDir(lang)}
      bottom={
        <BottomNav
          items={[
            { key: "store", label: t.store.storeTab },
            { key: "orders", label: t.store.ordersTab },
            { key: "profile", label: t.store.profileTab },
          ]}
          active={tab}
          onChange={(k) => setTab(k as any)}
        />
      }
    >
      <div className="h-full">
        {/* Top quick actions داخل التطبيق */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setScreen("home");
                setSelectedId(null);
              }}
              className="h-9 px-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10"
            >
              {t.common.home}
            </button>

            <button
              onClick={() => setScreen("cart")}
              className="h-9 px-3 rounded-2xl bg-cyan-400 text-black text-sm font-extrabold"
            >
              {t.store.cart} ({cartItems.reduce((s, x) => s + x.qty, 0)})
            </button>
          </div>
        </div>

        <div className="px-4 pt-3 pb-4 h-[540px] overflow-hidden">
          <ScreenTransition k={`${tab}-${screen}-${selectedId ?? "x"}`}>
            {/* HOME */}
            {tab === "store" && screen === "home" && (
              <div className="h-full overflow-auto pr-1 space-y-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-white/70">{t.store.welcome}</div>
                  <div className="text-xl font-extrabold">{t.store.welcomeText}</div>
                  <div className="text-xs text-white/60 mt-1">{t.store.hint}</div>
                </div>

                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openDetails(p.id)}
                    className="w-full text-left rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
                        <Image src={p.img} alt={p.name} width={128} height={128} className="h-16 w-16 object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{p.name}</div>
                        <div className="text-sm text-white/70">${p.price}</div>
                        <div className="text-xs text-cyan-300 mt-1">{t.store.openDetails}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* DETAILS */}
            {tab === "store" && screen === "details" && selected && (
              <div className="h-full overflow-auto pr-1">
                <button
                  onClick={() => setScreen("home")}
                  className="mb-3 h-9 px-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10"
                >
                  ← {t.common.back}
                </button>

                <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="h-44 bg-black/30">
                    <Image src={selected.img} alt={selected.name} width={800} height={400} className="h-44 w-full object-cover" unoptimized />
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-extrabold">{selected.name}</div>
                    <div className="text-white/70 mt-1">
                      {lang === "ar"
                        ? "بطاقة منتج واقعية + صورة + سعر + خيارات." 
                        : lang === "ku"
                        ? "کاردی بەرهەم + وێنە + نرخ + هەڵبژاردن." 
                        : "A realistic product card with image, price, and actions."}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xl font-extrabold">${selected.price}</div>
                      <button
                        onClick={() => addToCart(selected.id)}
                        className="h-11 px-4 rounded-2xl bg-cyan-400 text-black font-extrabold hover:brightness-110 active:scale-[0.98] transition"
                      >
                        {t.store.addToCart}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CART */}
            {screen === "cart" && (
              <div className="h-full overflow-auto pr-1">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-extrabold">{t.store.cart}</div>
                  <button
                    onClick={() => setScreen("home")}
                    className="h-9 px-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10"
                  >
                    {t.common.continue}
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {cartItems.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white/70">
                      {t.store.emptyCart}
                    </div>
                  ) : (
                    cartItems.map((it) => (
                      <div key={it.id} className="rounded-3xl border border-white/10 bg-white/5 p-3 flex gap-3">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
                          <Image src={it.img} alt={it.name} width={120} height={120} className="h-14 w-14 object-cover" unoptimized />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{it.name}</div>
                          <div className="text-sm text-white/70">${it.price}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
                          >
                            −
                          </button>
                          <div className="w-8 text-center font-bold">{it.qty}</div>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-4 flex items-center justify-between">
                  <div className="text-white/70">{t.store.subtotal}</div>
                  <div className="text-xl font-extrabold">${total}</div>
                </div>

                <button
                  disabled={cartItems.length === 0}
                  onClick={() => setScreen("checkout")}
                  className={cn(
                    "mt-3 w-full h-12 rounded-2xl font-extrabold transition",
                    cartItems.length === 0
                      ? "bg-white/10 text-white/40"
                      : "bg-cyan-400 text-black hover:brightness-110 active:scale-[0.99]"
                  )}
                >
                  {t.store.checkout}
                </button>
              </div>
            )}

            {/* CHECKOUT */}
            {screen === "checkout" && (
              <div className="h-full overflow-auto pr-1">
                <button
                  onClick={() => setScreen("cart")}
                  className="mb-3 h-9 px-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10"
                >
                  ← {t.common.back}
                </button>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xl font-extrabold">{t.store.checkout} ({t.common.demo})</div>
                  <div className="text-white/70 mt-1">{t.store.noPayments}</div>

                  <div className="mt-4 space-y-2 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>{t.common.items}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.store.tax} (5%)</span>
                      <span>${(total * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-white">
                      <span>{t.store.grandTotal}</span>
                      <span>${(total * 1.05).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCart([]);
                      setScreen("home");
                    }}
                    className="mt-4 w-full h-12 rounded-2xl bg-cyan-400 text-black font-extrabold hover:brightness-110 active:scale-[0.99] transition"
                  >
                    {t.store.placeOrder}
                  </button>
                </div>
              </div>
            )}

            {/* ORDERS / PROFILE Tabs */}
            {tab === "orders" && (
              <div className="h-full p-4 overflow-auto">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="font-extrabold">{t.store.ordersTab}</div>
                  <div className="text-white/70 text-sm mt-1">
                    {lang === "ar"
                      ? "هنا نقدر نعرض الطلبات السابقة، تتبّع الحالة، وإعادة الطلب." 
                      : lang === "ku"
                      ? "لێرە داواکاریەکانی پێشوو و دۆخیان پیشان دەدرێت." 
                      : "Show past orders, status tracking, and re-order."}
                  </div>
                </div>
              </div>
            )}

            {tab === "profile" && (
              <div className="h-full p-4 overflow-auto">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="font-extrabold">{t.store.profileTab}</div>
                  <div className="text-white/70 text-sm mt-1">
                    {lang === "ar"
                      ? "هنا إعدادات الحساب، العنوان، والتنبيهات." 
                      : lang === "ku"
                      ? "ڕێکخستنەکانی پرۆفایل و ناونیشان و ئاگاداری." 
                      : "Profile settings, addresses, and notifications."}
                  </div>
                </div>
              </div>
            )}
          </ScreenTransition>
        </div>
      </div>
    </AppShell>
  );
}
