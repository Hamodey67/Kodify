import React, { useEffect, useState, useRef } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { translations } from '../utils/translations';
import { 
  Send, 
  MessageCircle, 
  Info, 
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
    <div className="flex h-full w-full bg-[#eef2f8] text-[#18212f] overflow-hidden animate-page-in font-sans" dir={dir}>
      
      {/* Left Sidebar Pane: Connection Metrics */}
      <div className={`hidden lg:flex flex-col w-80 shrink-0 border-[#e3e9f1] bg-[#fbfcfe] p-6 space-y-6 ${dir === 'rtl' ? 'border-l' : 'border-r'}`}>
        
        {/* Connection Status Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Smartphone className="text-blue-600 w-5 h-5" />
            <h3 className="text-sm font-extrabold text-[#18212f] tracking-wide uppercase">
              {language === 'ar' ? 'اتصال الموبايل' : 'Mobile Connection'}
            </h3>
          </div>
          
          <div className="bg-[#f4f7fb] p-4 border border-[#e3e9f1] rounded-lg space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748b]">{language === 'ar' ? 'حالة البث' : 'Broadcast'}</span>
              <span className="flex items-center gap-1.5 font-bold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded-md ring-1 ring-emerald-200">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span>{language === 'ar' ? 'نشط' : 'Active'}</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs border-t border-[#e3e9f1] pt-3">
              <span className="text-[#64748b]">{language === 'ar' ? 'منفذ الخادم' : 'Server Port'}</span>
              <span className="font-mono font-bold text-[#18212f]">{managerPort}</span>
            </div>
            

          </div>
        </div>

        {/* Live Tunnel URL Card */}
        {tunnelUrl && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'ar' ? 'رابط البث السحابي' : 'Cloud Access URL'}</span>
            </h4>
            <div className="bg-[#f4f7fb] p-3.5 border border-[#e3e9f1] rounded-lg select-all font-mono text-[11px] break-all leading-relaxed text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
              {tunnelUrl}
            </div>
          </div>
        )}

        {/* Dynamic Help Tips */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="p-4 rounded-lg bg-[#f4f7fb] border border-[#e3e9f1] text-[11px] leading-relaxed text-[#64748b] space-y-2">
            <div className="font-extrabold text-[#334155] flex items-center gap-1">
              <Info size={12} className="text-blue-600" />
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
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#eef2f8] relative">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#e3e9f1] px-6 py-4 shrink-0 bg-[#fbfcfe] relative z-10">
          <div>
            <h1 className="text-lg font-black text-[#18212f] flex items-center gap-2 tracking-wide">
              <MessageCircle className="text-blue-600 w-5 h-5" />
              <span>{language === 'ar' ? 'محادثة الإدارة والموبايل' : (language === 'ku' ? 'نامەکان' : 'Manager & Mobile Chat')}</span>
            </h1>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              {language === 'ar' ? 'تواصل مباشر مع تطبيق الموبايل' : 'Live chat with Mobile App'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff1f2] hover:bg-rose-100 border border-rose-200 text-[#dc2626] rounded-md text-xs font-bold transition-colors active:scale-[0.98]"
            >
              <Trash2 size={13} />
              <span>{language === 'ar' ? 'مسح المحادثة' : (language === 'ku' ? 'سڕینەوەی نامەکان' : 'Clear Chat')}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider hidden sm:inline">
                {language === 'ar' ? 'المزامنة التلقائية' : 'Auto Sync'}
              </span>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 bg-[#eef2f8]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#94a3b8] space-y-3">
              <div className="w-16 h-16 rounded-lg bg-[#fbfcfe] border border-[#e3e9f1] flex items-center justify-center">
                <MessageCircle size={28} className="text-[#94a3b8] stroke-1" />
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
                    <div className="w-8 h-8 rounded-md bg-[#fbfcfe] border border-[#e3e9f1] flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                      MN
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[70%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
                    
                    {/* Message Bubble container */}
                    <div className={`px-4 py-3 rounded-2xl border relative min-w-[140px] ${
                      isOutgoing 
                        ? 'bg-[#2563eb] text-white rounded-br-none border-[#1d4ed8]' 
                        : 'bg-[#fbfcfe] text-[#18212f] rounded-bl-none border-[#e3e9f1]'
                    }`}>
                      {/* Sender Name tag */}
                      <span className={`text-[10px] font-black block mb-1 opacity-80 tracking-wide ${isOutgoing ? 'text-blue-100' : 'text-[#64748b]'}`}>
                        {msg.senderName}
                      </span>
                      
                      <p className="text-[13px] leading-relaxed whitespace-pre-wrap select-text font-medium">{msg.message}</p>
                      
                      {/* Timestamp */}
                      <div className={`text-[9px] mt-1.5 font-mono opacity-75 flex items-center gap-1 ${isOutgoing ? 'justify-end text-blue-100' : 'justify-start text-[#94a3b8]'}`}>
                        <Clock size={8} />
                        <span>{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Outgoing Cashier Avatar (right-aligned) */}
                  {isOutgoing && (
                    <div className="w-8 h-8 rounded-md bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
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
        <div className="p-4 bg-[#fbfcfe] border-t border-[#e3e9f1] shrink-0 relative z-10">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto items-center">
            
            {/* Input field wrapper */}
            <div className="relative flex-1 bg-[#fbfcfe] rounded-xl border border-[#e3e9f1] focus-within:border-[#2563eb] focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition-all p-1.5 flex items-center">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'ar' ? 'اكتب رسالة هنا...' : (language === 'ku' ? 'لێرە بنووسە...' : 'Type a message here...')}
                rows={1}
                className="flex-1 bg-transparent border-none text-[#18212f] text-xs py-2 px-3 focus:outline-none resize-none custom-scrollbar outline-none max-h-24 font-medium placeholder:text-[#94a3b8]"
                style={{ minHeight: '36px' }}
              />
            </div>
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                !inputText.trim() || isSending
                  ? 'bg-[#eef2f7] text-[#cbd5e1] cursor-not-allowed border border-[#e3e9f1]'
                  : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white active:scale-95 shadow-[0_8px_20px_rgba(37,99,235,0.24)]'
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
