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
      <div className="min-h-[240px] w-full min-w-0 overflow-x-hidden bg-[#efeae2] sm:min-h-[280px]" dir="ltr">
        <div className="flex min-w-0 items-center justify-between gap-2 border-b border-[#d1d7db] bg-[#f0f2f5] px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="min-w-0 flex-1 truncate text-sm font-semibold text-[#111b21]">{wa.header}</div>
          <div className="shrink-0 text-[10px] text-[#667781] sm:text-xs">{wa.fromMeta}</div>
        </div>

        <div className="p-3 sm:p-5">
          <p className="text-xs font-medium text-[#667781]">{wa.fromName}</p>

          <div className="mt-3 w-full min-w-0 max-w-md rounded-lg rounded-tl-none bg-white p-3 shadow-sm sm:p-4">
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
