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
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500 border-r-2 border-slate-700 mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-900 space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{t.customers}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar' ? 'إدارة حسابات ديون العملاء ونقاط المكافآت والولاء' : 'Track customer loyalty reward points and ledger balances'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-primary text-primary-foreground hover:bg-teal-400 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all hover-scale shadow-lg glow-teal active:scale-95"
        >
          <Plus size={14} />
          <span>{t.addCustomer}</span>
        </button>
      </div>

      {/* Search customer */}
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800/60 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs transition-colors"
          />
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      {/* Customer profiles table */}
      <div className="glass-card rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              {language === 'ar' ? 'لا يوجد عملاء مسجلين حالياً' : 'No customer records found.'}
            </div>
          ) : (
            <table className="w-full text-xs text-slate-300 select-text">
              <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold">
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
              <tbody className="divide-y divide-slate-700/50">
                {filteredCustomers.map((c, idx) => {
                  const isDebtor = c.balance < 0;
                  const hasCredit = c.balance > 0;
                  
                  return (
                    <tr key={c.id} className="hover:bg-slate-700/30">
                      <td className="p-3.5 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className={`p-3.5 font-bold text-slate-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {c.name}
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-400">{c.phone || '-'}</td>
                      <td className="p-3.5 text-center text-slate-400">{c.email || '-'}</td>
                      <td className="p-3.5 text-center">
                        <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded font-bold font-mono">
                          {c.points}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          isDebtor 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : hasCredit 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'text-slate-400'
                        }`}>
                          {Math.round(c.balance).toLocaleString()} {t.currency}
                          {isDebtor && <span className="text-[9px] block font-sans font-medium text-rose-500">({t.debtor})</span>}
                        </span>
                      </td>
                      <td className="p-3.5 text-center shrink-0">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenAdjust(c)}
                            title={t.addDebt + ' / ' + t.payDebt}
                            className="p-1.5 bg-slate-800 border border-slate-700 text-teal-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
                          >
                            <DollarSign size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
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
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/40">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                <UserCheck size={16} className="text-teal-400" />
                <span>{isEditMode ? t.editProduct : t.addCustomer}</span>
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.customerName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500"
                  required
                  placeholder="e.g. Khalid"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.phone}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono"
                  placeholder="05..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono"
                  placeholder="khalid@domain.com"
                />
              </div>

              {!isEditMode && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{t.creditBalance} (Opening balance - negative for debt)</label>
                  <input
                    type="number"
                    step="any"
                    value={balance || ''}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs focus:border-teal-500 font-mono"
                    placeholder="0.00"
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-700 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 py-2.5 rounded-lg text-xs font-bold transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 rounded-lg text-xs font-bold transition-all hover-scale shadow-lg glow-teal"
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
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/40">
              <h3 className="font-bold text-slate-200 text-sm">{language === 'ar' ? `تسوية حساب: ${name}` : `Adjust Balance: ${name}`}</h3>
              <button 
                onClick={() => setIsAdjustOpen(false)}
                className="text-slate-400 hover:text-white"
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
                  className={`py-2 rounded-lg font-bold border transition-all ${
                    adjustType === 'pay_debt'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.payDebt} (سداد نقد)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('add_debt')}
                  className={`py-2 rounded-lg font-bold border transition-all ${
                    adjustType === 'add_debt'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.addDebt} (تسجيل دين)
                </button>
              </div>

              {/* Amount input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{t.amount}</label>
                <input
                  type="number"
                  step="any"
                  value={adjustAmount || ''}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm text-center font-bold font-mono focus:border-teal-500"
                  required
                  placeholder="0.00"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-700 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 py-2.5 rounded-lg text-xs font-bold transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={adjustAmount <= 0}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-teal-400 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none hover-scale glow-teal"
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
