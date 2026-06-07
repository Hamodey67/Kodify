"use client";

import React from "react";
import BrowserChrome from "./BrowserChrome";

export default function LoginPageMock({
  url,
  strings,
  notSecureLabel,
  secureLabel,
  verdict,
}: {
  url: string;
  strings: {
    heading: string;
    email: string;
    password: string;
    forgot: string;
    signIn: string;
    footer: string;
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
      <div className="w-full min-w-0 px-3 py-5 sm:px-10 sm:py-10" dir="ltr">
        <div className="mx-auto w-full min-w-0 max-w-sm">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 sm:text-xl">
            {strings.heading}
          </h2>

          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            <label className="block min-w-0">
              <span className="mb-1.5 block text-[11px] font-medium text-slate-600 sm:text-xs">{strings.email}</span>
              <input
                className="w-full min-w-0 max-w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
                placeholder={strings.email}
                disabled
                readOnly
                tabIndex={-1}
              />
            </label>
            <label className="block min-w-0">
              <span className="mb-1.5 block text-[11px] font-medium text-slate-600 sm:text-xs">{strings.password}</span>
              <input
                className="w-full min-w-0 max-w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
                placeholder={strings.password}
                disabled
                readOnly
                type="password"
                tabIndex={-1}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" className="text-xs font-medium text-[#0070ba]" disabled tabIndex={-1}>
              {strings.forgot}
            </button>
            <button
              type="button"
              className="w-full rounded-full bg-[#0070ba] px-6 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto"
              disabled
              tabIndex={-1}
            >
              {strings.signIn}
            </button>
          </div>

          <p className="mt-6 text-center text-[10px] leading-relaxed text-slate-500 sm:mt-8 sm:text-[11px]">{strings.footer}</p>
        </div>
      </div>
    </BrowserChrome>
  );
}
