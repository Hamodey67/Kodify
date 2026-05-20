'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, Bot, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/app/providers';
import { t } from '@/lib/i18n';

export default function ChatBot() {
  const { lang } = useApp() as { lang: 'ar' | 'en' | 'ku' };
  const tx = t[lang].chatbot;
  
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    body: { lang } // Pass language to the backend
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, error]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-cyan-600 text-white shadow-2xl hover:bg-cyan-700 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-blue-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="flex h-[500px] max-h-[calc(100vh-120px)] w-[calc(100vw-32px)] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl dark:bg-black/70 shadow-2xl"
          >
            {/* Header - Forced LTR to keep logo on left */}
            <div dir="ltr" className="flex items-center justify-between border-b border-white/10 bg-cyan-500/5 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white overflow-hidden shadow-md">
                  <img src="/kodify.png" alt="Kodify" className="h-full w-full object-contain p-1" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.removeAttribute('style'); }} />
                  <Bot className="h-6 w-6" style={{ display: 'none' }} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-widest dark:text-white uppercase">KODIFY</h3>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{tx.online}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-10 w-10 mx-auto text-sky-400 mb-2 opacity-50" />
                  <p className="text-xs text-zinc-500">{tx.welcome}</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                    m.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-zinc-800 dark:text-white border'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex justify-center p-2">
                  <div className="bg-red-50 text-red-600 text-[10px] py-1 px-3 rounded-lg flex items-center gap-2 border border-red-200">
                    <AlertCircle className="h-3 w-3" />
                    <span>{tx.error}{error.message || tx.offline}</span>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-md">
              <div className="relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={tx.placeholder}
                  className="w-full bg-white/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!input || isLoading}
                  className="absolute right-1 top-1 bottom-1 px-3 text-sky-400 hover:text-sky-500 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5 rtl:rotate-180" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

