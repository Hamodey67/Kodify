"use client";

import { cn } from "@/lib/utils";

const MENU_EMBED_URL = "https://spinozacafe.com/";
const SCREEN_CLIP = "overflow-hidden rounded-[46px]";

type PhoneTab = "store" | "menu" | "pos";

function PhoneScreenContent({
  activeTab,
  children,
}: {
  activeTab: PhoneTab;
  children?: React.ReactNode;
}) {
  if (activeTab === "menu") {
    return (
      <div dir="ltr" className={cn("absolute inset-0", SCREEN_CLIP)}>
        <iframe
          src={MENU_EMBED_URL}
          title="Spinoza Cafe live menu"
          loading="lazy"
          allow="fullscreen"
          data-lenis-prevent
          className="absolute top-0 left-0 block h-full border-0 bg-[#0b1220]"
          style={{
            width: "calc(100% + 18px)",
            maxWidth: "none",
          }}
        />
      </div>
    );
  }

  return (
    <div dir="ltr" className={cn("absolute inset-0 h-full w-full", SCREEN_CLIP)}>
      <div className="absolute inset-0 flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function PhoneFrame({
  activeTab,
  children,
  className,
}: {
  activeTab: PhoneTab;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      dir="ltr"
      className={cn(
        "mx-auto shrink-0 w-[280px] sm:w-[320px] md:w-[360px]",
        className
      )}
    >
      <div className="relative">
        {/* Titanium frame — iPhone 17 Pro Max */}
        <div
          className={cn(
            "relative rounded-[55px] p-[3px]",
            "bg-gradient-to-br from-[#d4d4d8] via-[#98989d] to-[#636366]",
            "shadow-[0_28px_70px_rgba(0,0,0,0.42),0_12px_28px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.55)]",
            "ring-1 ring-black/20"
          )}
        >
          {/* Metallic edge highlights */}
          <div className="pointer-events-none absolute inset-0 rounded-[55px] ring-1 ring-inset ring-white/35" />
          <div className="pointer-events-none absolute inset-[1px] rounded-[54px] bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-70" />
          <div className="pointer-events-none absolute inset-[1px] rounded-[54px] bg-gradient-to-bl from-transparent via-transparent to-black/25" />

          {/* Left side — Action + volume buttons */}
          <div
            className="pointer-events-none absolute -left-[2px] z-10 w-[3px] rounded-full bg-gradient-to-r from-[#8e8e93] to-[#aeaeb2] shadow-[0_0_4px_rgba(0,0,0,0.35)]"
            style={{ top: "17.5%", height: "3.8%" }}
          />
          <div
            className="pointer-events-none absolute -left-[2px] z-10 w-[3px] rounded-full bg-gradient-to-r from-[#8e8e93] to-[#aeaeb2] shadow-[0_0_4px_rgba(0,0,0,0.35)]"
            style={{ top: "24.5%", height: "5.8%" }}
          />
          <div
            className="pointer-events-none absolute -left-[2px] z-10 w-[3px] rounded-full bg-gradient-to-r from-[#8e8e93] to-[#aeaeb2] shadow-[0_0_4px_rgba(0,0,0,0.35)]"
            style={{ top: "32.5%", height: "5.8%" }}
          />

          {/* Right side — power button */}
          <div
            className="pointer-events-none absolute -right-[2px] z-10 w-[3px] rounded-full bg-gradient-to-l from-[#8e8e93] to-[#aeaeb2] shadow-[0_0_4px_rgba(0,0,0,0.35)]"
            style={{ top: "22%", height: "8.5%" }}
          />

          {/* Inner bezel + screen */}
          <div className="relative overflow-hidden rounded-[48px] bg-[#1c1c1e] p-[2px] ring-1 ring-black/50">
            <div className="relative overflow-hidden rounded-[46px] bg-black">
              {/* 19.5:9 screen canvas */}
              <div className={cn("relative isolate aspect-[9/19.5] w-full bg-[#0b1220]", SCREEN_CLIP)}>
                <PhoneScreenContent activeTab={activeTab}>{children}</PhoneScreenContent>

                {/* Dynamic Island — fixed overlay, explicit size (aspect-ratio was collapsing) */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-[100] flex justify-center pt-[10px]">
                  <div
                    className="relative shrink-0 rounded-full bg-[#000000] shadow-[0_3px_14px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(255,255,255,0.2)]"
                    style={{
                      width: "36%",
                      minWidth: "96px",
                      maxWidth: "130px",
                      height: "26px",
                      minHeight: "22px",
                    }}
                  >
                    <div className="absolute right-[18px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full bg-[#14141c] ring-1 ring-[#3a3a48]/90" />
                    <div className="absolute right-[21px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[#252532]" />
                  </div>
                </div>

                {/* Home indicator */}
                <div className="pointer-events-none absolute bottom-[1.1%] left-1/2 z-30 h-[4px] w-[32%] min-w-[96px] max-w-[128px] -translate-x-1/2 rounded-full bg-white/28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
