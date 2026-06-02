import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { CartItem, useCartStore } from '../store/cartStore';

interface SavePriceInput {
  newPrice: number;
  reason?: string;
}

export const usePriceOverride = () => {
  const { user } = useAuthStore();
  const { updateItemPrice } = useCartStore();

  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [pinError, setPinError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

  const isAdmin = user?.role === 'admin';
  const isPinLocked = !!lockedUntil && lockedUntil > Date.now();

  useEffect(() => {
    if (!lockedUntil) {
      setLockSecondsLeft(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockSecondsLeft(remaining);
      if (remaining <= 0) {
        setLockedUntil(null);
        setPinError('');
        setFailedAttempts(0);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [lockedUntil]);

  const selectedItemName = useMemo(() => {
    if (!selectedItem) return '';
    return selectedItem.nameAr || selectedItem.nameEn;
  }, [selectedItem]);

  const requestPriceEdit = (item: CartItem) => {
    setSelectedItem(item);
    setPinError('');
    if (isAdmin) {
      setIsPriceModalOpen(true);
      setIsPinModalOpen(false);
      return;
    }
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPinError('');
  };

  const closePriceModal = () => {
    setIsPriceModalOpen(false);
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    if (isPinLocked) {
      setPinError('تم قفل الإدخال مؤقتاً');
      return false;
    }

    const valid = await window.api.verifyAdminPin(pin);
    if (valid) {
      setPinError('');
      setFailedAttempts(0);
      setIsPinModalOpen(false);
      setIsPriceModalOpen(true);
      return true;
    }

    const nextFailedAttempts = failedAttempts + 1;
    setFailedAttempts(nextFailedAttempts);
    setPinError('رمز PIN غير صحيح');

    if (nextFailedAttempts >= 3) {
      setLockedUntil(Date.now() + 30_000);
      setPinError('تم تجاوز الحد المسموح. المحاولة متاحة بعد 30 ثانية');
    }

    return false;
  };

  const savePriceOverride = async ({ newPrice, reason }: SavePriceInput): Promise<boolean> => {
    if (!selectedItem) return false;

    const normalizedPrice = Number(newPrice);
    if (Number.isNaN(normalizedPrice) || normalizedPrice < 0) return false;

    updateItemPrice(selectedItem.id, normalizedPrice);

    await window.api.logPriceOverride({
      itemId: selectedItem.id,
      itemName: selectedItemName,
      originalPrice: selectedItem.originalPrice,
      newPrice: normalizedPrice,
      reason: reason || null,
      authorizedBy: isAdmin ? (user?.username || 'admin') : 'admin-pin',
      timestamp: new Date().toISOString(),
    });

    setIsPriceModalOpen(false);
    setSelectedItem(null);
    return true;
  };

  return {
    isAdmin,
    selectedItem,
    selectedItemName,
    isPinModalOpen,
    isPriceModalOpen,
    pinError,
    isPinLocked,
    lockSecondsLeft,
    requestPriceEdit,
    verifyPin,
    savePriceOverride,
    closePinModal,
    closePriceModal,
  };
};
