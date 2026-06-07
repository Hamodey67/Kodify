"use client";

import React from "react";
import BrowserChrome from "./BrowserChrome";

export default function WhatsAppScamMock({
  url,
  wa,
  notSecureLabel,
  secureLabel,
  verdict,
}: {
  url: string;
  wa: {
    header: string;
    fromName: string;
    fromMeta: string;
    message: string;
    cta: string;
  };
  notSecureLabel: string;
  secureLabel: string;
  verdict?: {
    choice: "safe" | "phishing";
    correct: boolean;
    message?: string;
  } | null;
}) {
  return (
    <BrowserChrome
      url={url}
      verdict={verdict}
      notSecureLabel={notSecureLabel}
      secureLabel={secureLabel}
    >
      <div className="min-h-[280px] bg-[#efeae2]" dir="ltr">
        <div className="flex items-center justify-between gap-2 border-b border-[#d1d7db] bg-[#f0f2f5] px-4 py-3">
          <div className="min-w-0 flex-1 truncate text-sm font-semibold text-[#111b21]">{wa.header}</div>
          <div className="shrink-0 text-xs text-[#667781]">{wa.fromMeta}</div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium text-[#667781]">{wa.fromName}</p>

          <div className="mt-3 max-w-md rounded-lg rounded-tl-none bg-white p-4 shadow-sm">
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#111b21]">{wa.message}</p>

            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-[#008069] px-4 py-2.5 text-sm font-semibold text-white"
              disabled
              tabIndex={-1}
            >
              {wa.cta}
            </button>
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}
