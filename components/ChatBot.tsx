'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Bot, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/app/providers';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function ChatBot() {
  const { lang } = useApp() as { lang: 'ar' | 'en' | 'ku' };
  const tx = t[lang].chatbot;
  const isRtl = lang === 'ar' || lang === 'ku';

  const [isOpen, setIsOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
    body: { lang },
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, error, scrollToBottom]);

  const handleQuickReply = (text: string) => {
    if (isLoading) return;
    void append({ role: 'user', content: text });
  };

  const fontClass = isRtl ? 'font-[family-name:var(--font-cairo)]' : 'font-[family-name:var(--font-inter)]';

  return (
    <div
      className={cn(
        'fixed bottom-4 z-50 flex flex-col items-end sm:bottom-6',
        isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6',
        fontClass
      )}
    >
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-bright)] shadow-[0_8px_32px_rgba(43,127,255,0.45)]" />
            <span className="absolute inset-0 rounded-full bg-[var(--accent-bright)] opacity-30 blur-xl transition-opacity duration-500 group-hover:opacity-55" />
            <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
            <MessageCircle className="relative z-10 h-7 w-7 text-white sm:h-8 sm:w-8" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className={cn(
              'flex h-[min(540px,calc(100vh-100px))] w-[calc(100vw-32px)] flex-col overflow-hidden sm:w-[400px]',
              'rounded-[1.35rem] border border-white/[0.08]',
              'bg-[#060d18]/92 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_40px_rgba(43,127,255,0.08)]',
              'backdrop-blur-2xl backdrop-saturate-150'
            )}
          >
            {/* Header — brand stays LTR */}
            <div
              dir="ltr"
              className="relative shrink-0 border-b border-white/[0.06] bg-[#0a1528]/75 px-4 py-3.5 backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-bright)]/35 to-transparent" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="group/avatar relative">
                    <div className="absolute -inset-1 rounded-2xl bg-[var(--accent-bright)]/20 opacity-0 blur-md transition-opacity duration-300 group-hover/avatar:opacity-100" />
                    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover/avatar:border-[var(--accent-bright)]/30">
                      <img
                        src="/kodify.png"
                        alt="Kodify"
                        className="h-full w-full object-contain p-1.5"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.removeAttribute('style');
                        }}
                      />
                      <Bot className="h-6 w-6 text-[var(--accent-bright)]" style={{ display: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black uppercase tracking-[0.18em] text-white">
                      KODIFY
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="kody-online-dot h-2 w-2 rounded-full bg-[var(--accent-bright)]" />
                      <span className="text-[10px] font-medium text-white/45">{tx.online}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="rounded-xl p-2 text-white/40 transition-colors hover:text-white/90"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 scroll-smooth"
            >
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-col items-center px-2 py-6 text-center"
                >
                  <div className="relative mb-5">
                    <div className="kody-bot-halo absolute inset-0 -m-4 rounded-full bg-[var(--accent-primary)]/25 blur-2xl" />
                    <div className="kody-bot-float relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-bright)]/25 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-bright)]/10 shadow-[0_8px_32px_rgba(43,127,255,0.15)]">
                      <Sparkles className="h-7 w-7 text-[var(--accent-bright)]" />
                    </div>
                  </div>
                  <p className="max-w-[260px] text-sm leading-relaxed text-white/55">{tx.welcome}</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {tx.quickReplies.map((chip, i) => (
                      <motion.button
                        key={chip}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.06 }}
                        whileHover={{ scale: 1.03, borderColor: 'rgba(91,164,255,0.45)' }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isLoading}
                        onClick={() => handleQuickReply(chip)}
                        className={cn(
                          'rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5',
                          'text-[11px] font-semibold text-white/70 backdrop-blur-md',
                          'transition-all duration-200 hover:bg-[var(--accent-primary)]/15 hover:text-white',
                          'disabled:cursor-not-allowed disabled:opacity-40'
                        )}
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        dir="auto"
                        className={cn(
                          'max-w-[85%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-[13px] leading-relaxed',
                          isUser
                            ? cn(
                                'rounded-[1.1rem] rounded-ee-md',
                                'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-bright)]',
                                'text-white shadow-[0_4px_20px_rgba(43,127,255,0.28)]'
                              )
                            : cn(
                                'rounded-[1.1rem] rounded-es-md',
                                'border border-white/[0.08] bg-white/[0.05] text-white/90',
                                'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm'
                              )
                        )}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center px-2"
                >
                  <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-[10px] text-red-300">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{tx.error}{error.message || tx.offline}</span>
                  </div>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 rounded-[1.1rem] rounded-es-md border border-white/[0.08] bg-white/[0.05] px-4 py-3 backdrop-blur-sm">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[var(--accent-bright)]"
                        animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          delay: i * 0.18,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} aria-hidden className="h-px shrink-0" />
            </div>

            {/* Input */}
            <form
              dir={isRtl ? 'rtl' : 'ltr'}
              onSubmit={handleSubmit}
              className="shrink-0 border-t border-white/[0.06] bg-[#0a1528]/60 px-4 py-3.5 backdrop-blur-xl"
            >
              <div
                className={cn(
                  'kody-input-glow relative flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1.5 transition-all duration-300',
                  inputFocused && 'border-[var(--accent-bright)]/40'
                )}
              >
                <input
                  value={input}
                  onChange={handleInputChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder={tx.placeholder}
                  className={cn(
                    'min-w-0 flex-1 bg-transparent px-2.5 py-2 text-[13px] text-white placeholder:text-white/30',
                    'focus:outline-none',
                    isRtl ? 'text-right' : 'text-left'
                  )}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Send message"
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-bright)]',
                    'text-white shadow-[0_4px_16px_rgba(43,127,255,0.4)]',
                    'transition-shadow duration-300 hover:shadow-[0_4px_22px_rgba(43,127,255,0.55)]',
                    'disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none'
                  )}
                >
                  <Send className={cn('h-4 w-4', isRtl && '-scale-x-100')} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
