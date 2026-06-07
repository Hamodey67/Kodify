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
      <div className="px-4 py-6 sm:px-10 sm:py-10" dir="ltr">
        <div className="mx-auto max-w-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{strings.heading}</h2>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">{strings.email}</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm"
                placeholder={strings.email}
                disabled
                readOnly
                tabIndex={-1}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">{strings.password}</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm"
                placeholder={strings.password}
                disabled
                readOnly
                type="password"
                tabIndex={-1}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button type="button" className="text-xs font-medium text-[#0070ba]" disabled tabIndex={-1}>
              {strings.forgot}
            </button>
            <button
              type="button"
              className="rounded-full bg-[#0070ba] px-6 py-2 text-sm font-semibold text-white shadow-sm"
              disabled
              tabIndex={-1}
            >
              {strings.signIn}
            </button>
          </div>

          <p className="mt-8 text-center text-[11px] text-slate-500">{strings.footer}</p>
        </div>
      </div>
    </BrowserChrome>
  );
}
