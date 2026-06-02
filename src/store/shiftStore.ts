import { create } from 'zustand';

export interface Shift {
  id: number;
  userId: number;
  status: 'open' | 'closed';
  startTime: string;
  endTime?: string;
  startingCash: number;
  cashAdditions: number;
  cashWithdrawals: number;
  expectedCash: number;
  actualCash?: number;
  differenceAmount?: number;
  note?: string;
}

interface ShiftState {
  activeShift: Shift | null;
  isLoading: boolean;
  fetchActiveShift: (userId: number) => Promise<Shift | null>;
  openShift: (userId: number, startingCash: number) => Promise<boolean>;
  closeShift: (actualCash: number, note: string) => Promise<boolean>;
  addCashTransaction: (type: 'cash_in' | 'cash_out', amount: number, reason: string) => Promise<boolean>;
}

export const useShiftStore = create<ShiftState>((set, get) => ({
  activeShift: null,
  isLoading: false,
  fetchActiveShift: async (userId) => {
    set({ isLoading: true });
    try {
      const shift = await window.api.getOpenShift(userId);
      set({ activeShift: shift, isLoading: false });
      return shift;
    } catch (error) {
      console.error('Store fetchActiveShift error:', error);
      set({ isLoading: false });
      return null;
    }
  },
  openShift: async (userId, startingCash) => {
    set({ isLoading: true });
    try {
      const shift = await window.api.openShift(userId, startingCash);
      if (shift) {
        set({ activeShift: shift, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Store openShift error:', error);
      set({ isLoading: false });
      return false;
    }
  },
  closeShift: async (actualCash, note) => {
    const { activeShift } = get();
    if (!activeShift) return false;

    set({ isLoading: true });
    try {
      const updatedShift = await window.api.closeShift(activeShift.id, actualCash, note);
      if (updatedShift) {
        // Print shift report using printer helper
        await window.api.printShiftReport({
          cashierName: 'Ahmed Cashier', // will get populated dynamically or mocked
          startTime: new Date(activeShift.startTime).toLocaleString(),
          endTime: new Date().toLocaleString(),
          startingCash: activeShift.startingCash,
          salesCash: activeShift.expectedCash - activeShift.startingCash - activeShift.cashAdditions + activeShift.cashWithdrawals, // approximation
          salesCard: 0, // card portion doesn't affect physical cash
          additions: activeShift.cashAdditions,
          withdrawals: activeShift.cashWithdrawals,
          expectedCash: activeShift.expectedCash,
          actualCash: actualCash,
          difference: actualCash - activeShift.expectedCash,
          notes: note
        }, { mockMode: true });

        set({ activeShift: null, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Store closeShift error:', error);
      set({ isLoading: false });
      return false;
    }
  },
  addCashTransaction: async (type, amount, reason) => {
    const { activeShift } = get();
    if (!activeShift) return false;

    set({ isLoading: true });
    try {
      const transaction = await window.api.addShiftTransaction(activeShift.id, type, amount, reason);
      if (transaction) {
        // Refetch active shift to update totals
        const updated = await window.api.getOpenShift(activeShift.userId);
        set({ activeShift: updated, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Store addCashTransaction error:', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
