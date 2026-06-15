import React, { useEffect, useState, useRef } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { translations } from '../utils/translations';
import { 
  Send, 
  MessageCircle, 
  Sparkles, 
  User, 
  Smartphone, 
  Wifi, 
  Clock, 
  Lock, 
  Link as LinkIcon,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chat: React.FC = () => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = async () => {
    try {
      const list = await window.api.getMessages();
      setMessages(list || []);
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    }
  };

  const fetchConnectionDetails = async () => {
    try {
      const settingsList = await window.api.getSettings();
      const details: Record<string, string> = {};
      settingsList?.forEach((s: any) => {
        details[s.key] = s.value;
      });
      setConnectionDetails(details);
    } catch (err) {
      console.error('Failed to load settings in chat:', err);
    }
  };

  // Poll for messages every 3 seconds, fetch settings on mount
  useEffect(() => {
    fetchMessages();
    fetchConnectionDetails();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending || !user) return;

    const textToSend = inputText.trim();
    setInputText(''); // Clear input immediately for responsiveness

    setIsSending(true);
    try {
      const senderName = user.role === 'admin' 
        ? (language === 'ar' ? 'المدير' : 'Manager')
        : (user.name || (language === 'ar' ? 'الكاشير' : 'Cashier'));

      await window.api.sendMessage({
        sender: user.role,
        senderName,
        message: textToSend,
      });
      await fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    const confirmClear = window.confirm(
      language === 'ar' 
        ? 'هل أنت متأكد من مسح جميع الرسائل نهائياً؟' 
        : (language === 'ku' ? 'دڵنیای لە سڕینەوەی هەموو نامەکان؟' : 'Are you sure you want to delete all chat history?')
    );
    if (!confirmClear) return;

    try {
      // @ts-ignore
      const success = await window.api.clearMessages();
      if (success) {
        setMessages([]);
      } else {
        alert(language === 'ar' ? 'فشل مسح المحادثة' : 'Failed to clear chat');
      }
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const managerPort = connectionDetails.mobile_manager_port || '8787';
  const managerPin = connectionDetails.mobile_manager_pin || '1010';
  const tunnelUrl = connectionDetails.mobile_tunnel_last_url || '';

  return (
    <div className="flex h-full w-full bg-[#0a0e1a] text-slate-100 overflow-hidden animate-page-in font-sans" dir={dir}>
      
      {/* Left Sidebar Pane: Connection Metrics */}
      <div className={`hidden lg:flex flex-col w-80 shrink-0 border-white/5 bg-gradient-to-b from-[#111827]/40 to-[#0a0e1a]/40 p-6 space-y-6 ${dir === 'rtl' ? 'border-l' : 'border-r'}`}>
        
        {/* Connection Status Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Smartphone className="text-indigo-400 w-5 h-5" />
            <h3 className="text-sm font-extrabold text-slate-200 tracking-wide uppercase">
              {language === 'ar' ? 'اتصال الموبايل' : 'Mobile Connection'}
            </h3>
          </div>
          
          <div className="glass-card p-4 border border-white/5 rounded-2xl bg-white/2 space-y-3.5 shadow-glass">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{language === 'ar' ? 'حالة البث' : 'Broadcast'}</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span>{language === 'ar' ? 'نشط' : 'Active'}</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
              <span className="text-slate-400">{language === 'ar' ? 'منفذ الخادم' : 'Server Port'}</span>
              <span className="font-mono font-bold text-slate-200">{managerPort}</span>
            </div>
            

          </div>
        </div>

        {/* Live Tunnel URL Card */}
        {tunnelUrl && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'ar' ? 'رابط البث السحابي' : 'Cloud Access URL'}</span>
            </h4>
            <div className="glass-card p-3.5 border border-white/5 rounded-2xl bg-slate-950/40 select-all font-mono text-[11px] break-all leading-relaxed text-indigo-300 hover:text-indigo-200 transition-colors shadow-inner">
              {tunnelUrl}
            </div>
          </div>
        )}

        {/* Dynamic Help Tips */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="p-4 rounded-2xl bg-white/2 border border-white/5 text-[11px] leading-relaxed text-slate-400 space-y-2">
            <div className="font-extrabold text-slate-300 flex items-center gap-1">
              <Sparkles size={12} className="text-teal-400" />
              <span>{language === 'ar' ? 'تعليمات الاتصال' : 'Connection Info'}</span>
            </div>
            <p>
              {language === 'ar' 
                ? 'تأكد من فتح تطبيق الجوال لدى المدير وإدخال الرمز السري لبدء استلام إشعارات المبيعات والمخزون فوراً.' 
                : 'Ensure the manager opens the dashboard URL on their mobile phone and enters the PIN to sync sales.'}
            </p>
          </div>
        </div>

      </div>

      {/* Right Sidebar Pane: The Chat Component */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0d111d]/90 relative">
        
        {/* Decorative subtle header background glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-24 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 shrink-0 bg-slate-900/25 relative z-10">
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2 tracking-wide">
              <MessageCircle className="text-indigo-400 w-5 h-5" />
              <span>{language === 'ar' ? 'محادثة الإدارة والموبايل' : (language === 'ku' ? 'نامەکان' : 'Manager & Mobile Chat')}</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'ar' ? 'تواصل مباشر مع تطبيق الموبايل' : 'Live chat with Mobile App'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
            >
              <Trash2 size={13} />
              <span>{language === 'ar' ? 'مسح المحادثة' : (language === 'ku' ? 'سڕینەوەی نامەکان' : 'Clear Chat')}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
                {language === 'ar' ? 'المزامنة التلقائية' : 'Auto Sync'}
              </span>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 bg-gradient-to-b from-transparent to-[#0a0e1a]/20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500/60 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center shadow-lg shadow-black/10">
                <MessageCircle size={28} className="text-slate-400 stroke-1" />
              </div>
              <p className="text-xs font-bold tracking-wide">
                {language === 'ar' ? 'لا توجد رسائل سابقة' : 'No messages yet.'}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOutgoing = msg.sender !== 'manager';
              
              return (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} w-full items-end gap-2.5`}
                >
                  {/* Incoming Manager Avatar (left-aligned) */}
                  {!isOutgoing && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/8 flex items-center justify-center font-bold text-xs text-indigo-300 shadow shrink-0">
                      MN
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[70%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
                    
                    {/* Message Bubble container */}
                    <div className={`px-4 py-3 rounded-2xl shadow-lg border relative min-w-[140px] ${
                      isOutgoing 
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-br-none border-indigo-500/10' 
                        : 'bg-slate-800/95 text-slate-100 rounded-bl-none border-white/5'
                    }`}>
                      {/* Sender Name tag */}
                      <span className={`text-[10px] font-black block mb-1 opacity-70 tracking-wide ${isOutgoing ? 'text-indigo-200' : 'text-slate-300'}`}>
                        {msg.senderName}
                      </span>
                      
                      <p className="text-[13px] leading-relaxed whitespace-pre-wrap select-text font-medium">{msg.message}</p>
                      
                      {/* Timestamp */}
                      <div className={`text-[9px] mt-1.5 font-mono opacity-65 flex items-center gap-1 ${isOutgoing ? 'justify-end text-indigo-200' : 'justify-start text-slate-400'}`}>
                        <Clock size={8} />
                        <span>{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Outgoing Cashier Avatar (right-aligned) */}
                  {isOutgoing && (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400 shadow shrink-0">
                      {msg.sender === 'admin' ? 'AD' : 'CS'}
                    </div>
                  )}

                </motion.div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Footer Input Bar */}
        <div className="p-4 bg-slate-900/60 border-t border-white/5 shrink-0 relative z-10 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto items-center">
            
            {/* Input field wrapper */}
            <div className="relative flex-1 bg-slate-950/80 rounded-2xl border border-white/6 focus-within:border-indigo-500/30 transition-all p-1.5 flex items-center shadow-inner">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'ar' ? 'اكتب رسالة هنا...' : (language === 'ku' ? 'لێرە بنووسە...' : 'Type a message here...')}
                rows={1}
                className="flex-1 bg-transparent border-none text-slate-100 text-xs py-2 px-3 focus:outline-none resize-none custom-scrollbar outline-none max-h-24 font-medium"
                style={{ minHeight: '36px' }}
              />
            </div>
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                !inputText.trim() || isSending
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95 border border-indigo-500/20'
              }`}
            >
              <Send size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};
