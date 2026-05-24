"use client";

import { useState } from "react";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";

export default function ContactForm() {
  const { lang } = useApp();
  const tx = t[lang];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");


  const WHATSAPP_NUMBER = "9647710342727";
  const TO_EMAIL = "kodifyy0@gmail.com";

  const labelWhats =
    lang === "ar" ? "إرسال عبر واتساب" : lang === "ku" ? "ناردن بە واتساپ" : "Send via WhatsApp";

  const labelEmail =
    lang === "ar" ? "إرسال عبر الإيميل" : lang === "ku" ? "ناردن بە ئیمەیل" : "Send via Email";

  const buildText = () => {
    return `New message from website:
Name: ${name}
Email: ${email}

Message:
${msg}`;
  };

  const sendWhatsApp = () => {
    const text = buildText();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const sendEmail = () => {
    const subject = " message from website";
    const body = buildText();
    const url = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <form
      className="rounded-3xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur"
      onSubmit={(e) => {
        e.preventDefault();
        sendWhatsApp();   
      }}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">{tx.form.name}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] focus:border-brand-cyan outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm">{tx.form.email}</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="mt-2 w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] focus:border-brand-cyan outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm">{tx.form.msg}</label>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          required
          rows={5}
          className="mt-2 w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] focus:border-brand-cyan outline-none transition-colors"
        />
      </div>

     <div className="mt-6 flex flex-col sm:flex-row gap-3">
  {/* WhatsApp (Primary) */}
  <button
    type="submit"
    className="px-5 py-3 rounded-2xl bg-white text-black hover:bg-white/90 font-extrabold text-center"
  >
    {labelWhats}
  </button>

  {/* Email (Secondary) */}
  <button
    type="button"
    onClick={sendEmail}
    className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 font-extrabold text-center text-white"
  >
    {labelEmail}
  </button>
</div>

    </form>
  );
}
