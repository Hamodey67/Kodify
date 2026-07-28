import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { 
  Search, 
  Plus, 
  Edit3, 
  DollarSign, 
  Award, 
  TrendingDown, 
  UserCheck 
} from 'lucide-react';

export const Customers: React.FC = () => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form modal state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCustomerId, setActiveCustomerId] = useState<number | null>(null);

  // Form variables
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(0);

  // Balance adjustment state
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustType, setAdjustType] = useState<'add_debt' | 'pay_debt'>('pay_debt');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const list = await window.api.getCustomers();
      setCustomers(list || []);
      setFilteredCustomers(list || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      setFilteredCustomers(
        customers.filter(c => 
          c.name.toLowerCase().includes(q) || 
          (c.phone && c.phone.includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
        )
      );
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setActiveCustomerId(null);
    setName('');
    setPhone('');
    setEmail('');
    setBalance(0);
    setIsOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setIsEditMode(true);
    setActiveCustomerId(c.id);
    setName(c.name);
    setPhone(c.phone || '');
    setEmail(c.email || '');
    setBalance(c.balance);
    setIsOpen(true);
  };

  const handleOpenAdjust = (c: any) => {
    setActiveCustomerId(c.id);
    setName(c.name);
    setAdjustAmount(0);
    setAdjustType('pay_debt');
    setIsAdjustOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      phone: phone || null,
      email: email || null,
      balance: Number(balance),
    };

    try {
      let result;
      if (isEditMode && activeCustomerId) {
        result = await window.api.updateCustomer(activeCustomerId, payload);
      } else {
        result = await window.api.addCustomer(payload);
      }

      if (result) {
        setIsOpen(false);
        fetchCustomers();
      } else {
        alert(language === 'ar' ? 'فشلت العملية، قد يكون رقم الجوال مكرر' : 'Operation failed. Phone number might be duplicated.');
      }
    } catch (err) {
      console.error('Save customer error:', err);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomerId || adjustAmount <= 0) return;

    // pay debt adds credit (increases balance), add debt subtracts credit (decreases balance)
    const multiplier = adjustType === 'pay_debt' ? adjustAmount : -adjustAmount;

    try {
      const result = await window.api.adjustCustomerBalance(activeCustomerId, multiplier);
      if (result) {
        setIsAdjustOpen(false);
        fetchCustomers();
      } else {
        alert(t.error);
      }
    } catch (err) {
      console.error('Adjust customer balance error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#eef2f8] text-[#64748b]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-[#e3e9f1] border-t-[#2563eb]" />
          <p className="text-sm font-semibold">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#eef2f8] space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#e8edf4] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18212f]">{t.customers}</h1>
          <p className="text-xs font-medium text-[#64748b] mt-1">
            {language === 'ar' ? 'إدارة حسابات ديون العملاء ونقاط المكافآت والولاء' : 'Track customer loyalty reward points and ledger balances'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#2563eb] text-white hover:bg-[#1d4ed8] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.24)] active:translate-y-px"
        >
          <Plus size={14} />
          <span>{t.addCustomer}</span>
        </button>
      </div>

      {/* Search customer */}
      <div className="bg-[#fbfcfe] p-4 rounded-2xl border border-[#e3e9f1] shadow-[0_1px_2px_rgba(16,24,40,0.04)] shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full bg-[#fbfcfe] border border-[#e3e9f1] focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] text-[#18212f] pl-10 pr-4 py-2.5 rounded-xl text-xs transition-all outline-none placeholder:text-[#94a3b8]"
          />
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-[#94a3b8] ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      {/* Customer profiles table */}
      <div className="rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto custom-scrollbar">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 text-[#94a3b8] text-sm">
              {language === 'ar' ? 'لا يوجد عملاء مسجلين حالياً' : 'No customer records found.'}
            </div>
          ) : (
            <table className="w-full text-xs text-[#334155] select-text">
              <thead className="bg-[#f4f7fb] border-b border-[#e3e9f1] text-[#64748b] font-bold">
                <tr>
                  <th className="p-3.5 text-center w-12">#</th>
                  <th className={`p-3.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.customerName}</th>
                  <th className="p-3.5 text-center">{t.phone}</th>
                  <th className="p-3.5 text-center">{t.email}</th>
                  <th className="p-3.5 text-center">{t.loyaltyPoints}</th>
                  <th className="p-3.5 text-center">{t.creditBalance}</th>
                  <th className="p-3.5 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8edf4]">
                {filteredCustomers.map((c, idx) => {
                  const isDebtor = c.balance < 0;
                  const hasCredit = c.balance > 0;
                  
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-[#f4f7fb]">
                      <td className="p-3.5 text-center text-[#94a3b8] font-mono">{idx + 1}</td>
                      <td className={`p-3.5 font-bold text-[#18212f] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {c.name}
                      </td>
                      <td className="p-3.5 text-center font-mono text-[#64748b]">{c.phone || '-'}</td>
                      <td className="p-3.5 text-center text-[#64748b]">{c.email || '-'}</td>
                      <td className="p-3.5 text-center">
                        <span className="bg-blue-50 text-blue-600 ring-1 ring-[#bfdbfe] px-2 py-0.5 rounded-md font-bold font-mono">
                          {c.points}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          isDebtor 
                            ? 'bg-[#fff1f2] text-[#dc2626] ring-1 ring-rose-200' 
                            : hasCredit 
                              ? 'bg-[#ecfdf5] text-[#047857] ring-1 ring-emerald-200'
                              : 'text-[#64748b]'
                        }`}>
                          {Math.round(c.balance).toLocaleString()} {t.currency}
                          {isDebtor && <span className="text-[9px] block font-sans font-medium text-[#dc2626]">({t.debtor})</span>}
                        </span>
                      </td>
                      <td className="p-3.5 text-center shrink-0">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenAdjust(c)}
                            title={t.addDebt + ' / ' + t.payDebt}
                            className="p-1.5 bg-[#fbfcfe] border border-[#e3e9f1] text-blue-600 hover:bg-[#eff6ff] hover:border-[#bfdbfe] rounded-md transition-colors"
                          >
                            <DollarSign size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 bg-[#fbfcfe] border border-[#e3e9f1] text-[#64748b] hover:text-[#18212f] hover:bg-[#f4f7fb] rounded-md transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD / EDIT CUSTOMER MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 glass z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-md flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-[#e3e9f1] flex justify-between items-center bg-[#f4f7fb]">
              <h3 className="font-bold text-[#18212f] text-sm flex items-center gap-1.5">
                <UserCheck size={16} className="text-blue-600" />
                <span>{isEditMode ? t.editProduct : t.addCustomer}</span>
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#94a3b8] hover:text-[#18212f]"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#64748b]">{t.customerName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#fbfcfe] border border-[#e3e9f1] text-[#18212f] px-3 py-2 rounded-xl text-xs outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition-all"
                  required
                  placeholder="e.g. Khalid"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#64748b]">{t.phone}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#fbfcfe] border border-[#e3e9f1] text-[#18212f] px-3 py-2 rounded-xl text-xs outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition-all font-mono"
                  placeholder="05..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#64748b]">{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#fbfcfe] border border-[#e3e9f1] text-[#18212f] px-3 py-2 rounded-xl text-xs outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition-all font-mono"
                  placeholder="khalid@domain.com"
                />
              </div>

              {!isEditMode && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#64748b]">{t.creditBalance} (Opening balance - negative for debt)</label>
                  <input
                    type="number"
                    step="any"
                    value={balance || ''}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="bg-[#fbfcfe] border border-[#e3e9f1] text-[#18212f] px-3 py-2 rounded-xl text-xs outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition-all font-mono"
                    placeholder="0.00"
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-3 border-t border-[#e3e9f1] mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-[#fbfcfe] hover:bg-[#f4f7fb] border border-[#e3e9f1] text-[#64748b] py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2563eb] text-white hover:bg-[#1d4ed8] py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_8px_20px_rgba(37,99,235,0.24)] active:translate-y-px"
                >
                  {t.save}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ADJUST BALANCE MODAL DIALOG */}
      {isAdjustOpen && (
        <div className="fixed inset-0 glass z-50 flex items-center justify-center p-4">
          <div className="bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-sm flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-[#e3e9f1] flex justify-between items-center bg-[#f4f7fb]">
              <h3 className="font-bold text-[#18212f] text-sm">{language === 'ar' ? `تسوية حساب: ${name}` : `Adjust Balance: ${name}`}</h3>
              <button 
                onClick={() => setIsAdjustOpen(false)}
                className="text-[#94a3b8] hover:text-[#18212f]"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4 text-xs">
              
              {/* Type selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('pay_debt')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    adjustType === 'pay_debt'
                      ? 'bg-[#ecfdf5] border-emerald-200 text-[#047857]'
                      : 'bg-[#fbfcfe] border-[#e3e9f1] text-[#64748b] hover:text-[#18212f]'
                  }`}
                >
                  {t.payDebt} (سداد نقد)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('add_debt')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    adjustType === 'add_debt'
                      ? 'bg-[#fff1f2] border-rose-200 text-[#dc2626]'
                      : 'bg-[#fbfcfe] border-[#e3e9f1] text-[#64748b] hover:text-[#18212f]'
                  }`}
                >
                  {t.addDebt} (تسجيل دين)
                </button>
              </div>

              {/* Amount input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#64748b]">{t.amount}</label>
                <input
                  type="number"
                  step="any"
                  value={adjustAmount || ''}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="bg-[#fbfcfe] border border-[#e3e9f1] text-[#18212f] px-3 py-2 rounded-xl text-sm text-center font-bold font-mono outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition-all"
                  required
                  placeholder="0.00"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-3 border-t border-[#e3e9f1] mt-4">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="flex-1 bg-[#fbfcfe] hover:bg-[#f4f7fb] border border-[#e3e9f1] text-[#64748b] py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={adjustAmount <= 0}
                  className="flex-1 bg-[#2563eb] text-white hover:bg-[#1d4ed8] py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_8px_20px_rgba(37,99,235,0.24)] active:translate-y-px disabled:bg-[#cbd5e1] disabled:pointer-events-none disabled:shadow-none"
                >
                  {t.confirm}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
