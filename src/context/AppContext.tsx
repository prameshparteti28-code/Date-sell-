import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { User, Transaction, WithdrawRequest, SystemSettings, Language } from '../types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  allUsers: User[];
  transactions: Transaction[];
  withdrawRequests: WithdrawRequest[];
  settings: SystemSettings;
  isSellingData: boolean;
  liveSpeedMbps: number;
  livePingMs: number;
  sessionDataMB: number;
  sessionEarnings: number;
  networkType: string;
  activeTab: 'dashboard' | 'wallet' | 'withdraw' | 'history' | 'apk' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'wallet' | 'withdraw' | 'history' | 'apk' | 'admin') => void;
  deviceFrame: 'mobile' | 'desktop';
  setDeviceFrame: (frame: 'mobile' | 'desktop') => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  selectedReceipt: Transaction | null;
  setSelectedReceipt: (tx: Transaction | null) => void;
  
  // Actions
  toggleDataSelling: () => void;
  loginUser: (phone: string, name?: string, referral?: string) => boolean;
  logoutUser: () => void;
  requestWithdrawal: (data: {
    amount: number;
    method: 'upi' | 'bank';
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifsc: string;
      holderName: string;
      bankName: string;
    };
  }) => { success: boolean; error?: string; txId?: string };
  approveWithdrawal: (requestId: string, customUtr?: string) => void;
  rejectWithdrawal: (requestId: string, reason?: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  setDataLimit: (mb: number) => void;
  resetToDefaults: () => void;
}

const defaultSettings: SystemSettings = {
  ratePerGB: 28, // ₹28 per GB
  minWithdrawalAmount: 50, // ₹50 min withdrawal
  maxDailyDataGB: 5,
  platformActive: true,
  totalRegisteredUsers: 48920,
  totalDataPurchasedGB: 184500,
  totalPayoutsDistributedINR: 4280500,
};

const initialUser: User = {
  id: 'usr_9872',
  name: 'राहुल शर्मा (Rahul Sharma)',
  phone: '9876543210',
  email: 'rahul.earner@example.com',
  balance: 185.50,
  lifetimeEarnings: 840.00,
  todayEarnings: 42.50,
  totalDataSharedMB: 30720, // ~30 GB
  referralCode: 'DATAPAY88',
  joinedDate: '2026-09-15',
  isSellingData: true,
  dataLimitMB: 5120, // 5 GB
  dailyCapActive: true,
  upiId: '9876543210@paytm',
  bankAccount: {
    accountNumber: '919876543210',
    ifscCode: 'PYTM0123456',
    holderName: 'Rahul Sharma',
    bankName: 'Paytm Payments Bank',
  },
  isAdmin: true,
};

const initialTransactions: Transaction[] = [
  {
    id: 'tx_101',
    userId: 'usr_9872',
    userName: 'राहुल शर्मा',
    type: 'withdrawal',
    title: 'UPI Payout to 9876543210@paytm',
    amount: 250,
    status: 'completed',
    timestamp: '2026-10-30 18:42:10',
    paymentMethod: 'upi',
    referenceNumber: 'UPI/430129849201',
    upiId: '9876543210@paytm',
    note: 'Instant Bank settlement successful',
  },
  {
    id: 'tx_102',
    userId: 'usr_9872',
    userName: 'राहुल शर्मा',
    type: 'data_earning',
    title: 'Background Data Monetization (3.2 GB)',
    amount: 89.60,
    dataMB: 3276,
    status: 'completed',
    timestamp: '2026-10-30 14:15:33',
    paymentMethod: 'wallet',
    referenceNumber: 'DAT/99281726',
    note: '5G High-speed Bandwidth node',
  },
  {
    id: 'tx_103',
    userId: 'usr_9872',
    userName: 'राहुल शर्मा',
    type: 'referral_bonus',
    title: 'Referral Bonus: Amit Verma joined',
    amount: 25.00,
    status: 'completed',
    timestamp: '2026-10-29 11:20:00',
    paymentMethod: 'wallet',
    referenceNumber: 'REF/88371920',
  },
  {
    id: 'tx_104',
    userId: 'usr_9872',
    userName: 'राहुल शर्मा',
    type: 'withdrawal',
    title: 'Bank Transfer (IMPS) to State Bank of India',
    amount: 400,
    status: 'completed',
    timestamp: '2026-10-28 16:04:12',
    paymentMethod: 'bank',
    referenceNumber: 'IMPS/429817263541',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumberMasked: '•••• •••• 4589',
      ifsc: 'SBIN0001827',
    },
    note: 'Credited directly to savings account',
  },
];

const initialWithdrawRequests: WithdrawRequest[] = [
  {
    id: 'wr_501',
    userId: 'usr_4412',
    userName: 'विकास पटेल (Vikas Patel)',
    userPhone: '9821098210',
    amount: 150,
    method: 'upi',
    upiId: 'vikas.patel@okaxis',
    status: 'pending',
    requestedAt: '2026-10-31 21:10:45',
  },
  {
    id: 'wr_502',
    userId: 'usr_7721',
    userName: 'प्रिया सिंह (Priya Singh)',
    userPhone: '9711223344',
    amount: 500,
    method: 'bank',
    bankDetails: {
      accountNumber: '38192019281',
      ifsc: 'HDFC0000128',
      holderName: 'Priya Singh',
      bankName: 'HDFC Bank',
    },
    status: 'pending',
    requestedAt: '2026-10-31 22:04:19',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('datapay_lang') as Language) || 'hi';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('datapay_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [allUsers] = useState<User[]>([
    initialUser,
    {
      id: 'usr_4412',
      name: 'विकास पटेल (Vikas Patel)',
      phone: '9821098210',
      email: 'vikas@example.com',
      balance: 150,
      lifetimeEarnings: 450,
      todayEarnings: 28,
      totalDataSharedMB: 16384,
      referralCode: 'VIKAS22',
      joinedDate: '2026-10-01',
      isSellingData: true,
      dataLimitMB: 4096,
      dailyCapActive: true,
      upiId: 'vikas.patel@okaxis',
    },
    {
      id: 'usr_7721',
      name: 'प्रिया सिंह (Priya Singh)',
      phone: '9711223344',
      email: 'priya@example.com',
      balance: 500,
      lifetimeEarnings: 1200,
      todayEarnings: 65,
      totalDataSharedMB: 42000,
      referralCode: 'PRIYA99',
      joinedDate: '2026-08-12',
      isSellingData: false,
      dataLimitMB: 5120,
      dailyCapActive: true,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('datapay_txs');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>(() => {
    const saved = localStorage.getItem('datapay_withdraws');
    return saved ? JSON.parse(saved) : initialWithdrawRequests;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('datapay_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [isSellingData, setIsSellingData] = useState<boolean>(true);
  const [liveSpeedMbps, setLiveSpeedMbps] = useState<number>(3.8);
  const [livePingMs, setLivePingMs] = useState<number>(24);
  const [sessionDataMB, setSessionDataMB] = useState<number>(142.8);
  const [sessionEarnings, setSessionEarnings] = useState<number>(3.99);
  const [networkType] = useState<string>('Jio True 5G (VoNR)');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'withdraw' | 'history' | 'apk' | 'admin'>('dashboard');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'desktop'>('mobile');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('datapay_lang', language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('datapay_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('datapay_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('datapay_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('datapay_withdraws', JSON.stringify(withdrawRequests));
  }, [withdrawRequests]);

  useEffect(() => {
    localStorage.setItem('datapay_settings', JSON.stringify(settings));
  }, [settings]);

  // Real-time Bandwidth Monetization Engine (Ticker)
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isSellingData || !currentUser) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      // Fluctuate speed realistically between 2.1 MB/s and 5.4 MB/s
      const jitterSpeed = +(2.0 + Math.random() * 3.2).toFixed(1);
      const jitterPing = Math.floor(18 + Math.random() * 12);
      setLiveSpeedMbps(jitterSpeed);
      setLivePingMs(jitterPing);

      // Data sold in this 2-second tick (e.g. 1.2 to 2.8 MB)
      const chunkMB = +(0.8 + Math.random() * 1.6).toFixed(2);
      const earningIncrement = (chunkMB / 1024) * settings.ratePerGB;

      setSessionDataMB((prev) => +(prev + chunkMB).toFixed(2));
      setSessionEarnings((prev) => +(prev + earningIncrement).toFixed(2));

      setCurrentUser((prev) => {
        if (!prev) return null;
        // Check if daily cap reached
        if (prev.dailyCapActive && prev.totalDataSharedMB >= prev.dataLimitMB) {
          setIsSellingData(false);
          return prev;
        }

        const newBalance = +(prev.balance + earningIncrement).toFixed(2);
        const newToday = +(prev.todayEarnings + earningIncrement).toFixed(2);
        const newLifetime = +(prev.lifetimeEarnings + earningIncrement).toFixed(2);
        const newTotalMB = +(prev.totalDataSharedMB + chunkMB).toFixed(2);

        return {
          ...prev,
          balance: newBalance,
          todayEarnings: newToday,
          lifetimeEarnings: newLifetime,
          totalDataSharedMB: newTotalMB,
        };
      });
    }, 2500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSellingData, currentUser, settings.ratePerGB]);

  const toggleDataSelling = () => {
    setIsSellingData((prev) => !prev);
  };

  const loginUser = (phone: string, name?: string, referral?: string) => {
    const isNew = !currentUser || currentUser.phone !== phone;
    const bonus = referral ? 25 : 0;
    const user: User = {
      id: 'usr_' + Math.floor(1000 + Math.random() * 9000),
      name: name || (phone === '9876543210' ? 'राहुल शर्मा' : 'User ' + phone.slice(-4)),
      phone,
      email: `${phone}@datapay.in`,
      balance: isNew ? (50 + bonus) : (currentUser ? currentUser.balance : 50),
      lifetimeEarnings: isNew ? (50 + bonus) : (currentUser ? currentUser.lifetimeEarnings : 50),
      todayEarnings: 0,
      totalDataSharedMB: 1024,
      referralCode: 'DP' + phone.slice(-4),
      joinedDate: new Date().toISOString().split('T')[0],
      isSellingData: true,
      dataLimitMB: 5120,
      dailyCapActive: true,
      upiId: `${phone}@paytm`,
      isAdmin: phone === '9876543210' || phone === '9999999999',
    };

    setCurrentUser(user);
    setIsSellingData(true);

    if (isNew) {
      // Add welcome signup bonus transaction
      const signupTx: Transaction = {
        id: 'tx_' + Date.now(),
        userId: user.id,
        userName: user.name,
        type: 'signup_bonus',
        title: 'New Account Welcome Gift',
        amount: 50 + bonus,
        status: 'completed',
        timestamp: new Date().toLocaleString('en-IN'),
        paymentMethod: 'wallet',
        referenceNumber: 'BONUS/' + Math.floor(100000 + Math.random() * 900000),
        note: referral ? 'Includes ₹25 Referral Bonus' : 'Standard Welcome Gift',
      };
      setTransactions((prev) => [signupTx, ...prev]);
    }

    setShowAuthModal(false);
    return true;
  };

  const logoutUser = () => {
    setIsSellingData(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const requestWithdrawal = (data: {
    amount: number;
    method: 'upi' | 'bank';
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifsc: string;
      holderName: string;
      bankName: string;
    };
  }) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return { success: false, error: 'कृपया पहले लॉगिन करें (Please login first)' };
    }

    if (data.amount < settings.minWithdrawalAmount) {
      return {
        success: false,
        error: `न्यूनतम निकासी सीमा ₹${settings.minWithdrawalAmount} है। (Min withdrawal is ₹${settings.minWithdrawalAmount})`,
      };
    }

    if (data.amount > currentUser.balance) {
      return {
        success: false,
        error: `वॉलेट में पर्याप्त बैलेंस नहीं है। उपलब्ध: ₹${currentUser.balance.toFixed(2)}`,
      };
    }

    if (data.method === 'upi' && !data.upiId) {
      return { success: false, error: 'कृपया मान्य UPI ID दर्ज करें।' };
    }

    if (data.method === 'bank' && (!data.bankDetails?.accountNumber || !data.bankDetails?.ifsc)) {
      return { success: false, error: 'कृपया पूरा बैंक विवरण और IFSC कोड भरें।' };
    }

    // Deduct user balance
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        balance: +(prev.balance - data.amount).toFixed(2),
        upiId: data.upiId || prev.upiId,
      };
    });

    const txId = 'tx_' + Date.now();
    const reqId = 'wr_' + Date.now();
    const timeStr = new Date().toLocaleString('en-IN');
    const genUtr = (data.method === 'upi' ? 'UPI/' : 'IMPS/') + Math.floor(400000000000 + Math.random() * 99999999999);

    // Create withdrawal request for Admin queue
    const newReq: WithdrawRequest = {
      id: reqId,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      amount: data.amount,
      method: data.method,
      upiId: data.upiId,
      bankDetails: data.bankDetails,
      status: 'pending',
      requestedAt: timeStr,
    };
    setWithdrawRequests((prev) => [newReq, ...prev]);

    // Create Transaction record (initially processing)
    const newTx: Transaction = {
      id: txId,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'withdrawal',
      title: data.method === 'upi' ? `Payout to UPI: ${data.upiId}` : `Bank Transfer to ${data.bankDetails?.bankName || 'Bank'}`,
      amount: data.amount,
      status: 'processing',
      timestamp: timeStr,
      paymentMethod: data.method,
      referenceNumber: genUtr,
      upiId: data.upiId,
      bankDetails: data.bankDetails
        ? {
            bankName: data.bankDetails.bankName,
            accountNumberMasked: '•••• ' + data.bankDetails.accountNumber.slice(-4),
            ifsc: data.bankDetails.ifsc,
          }
        : undefined,
      note: 'Transfer request submitted. Verification in progress.',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore in tests
    }

    // Auto-approve simulation for quick demo instant gratification (small amounts)
    setTimeout(() => {
      setWithdrawRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: 'approved', utrNumber: genUtr, processedAt: new Date().toLocaleString('en-IN') } : r))
      );
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, status: 'completed', note: 'Fund successfully credited to account!' } : t))
      );
    }, 4000);

    return { success: true, txId };
  };

  const approveWithdrawal = (requestId: string, customUtr?: string) => {
    const target = withdrawRequests.find((r) => r.id === requestId);
    if (!target) return;

    const utr = customUtr || (target.method === 'upi' ? 'UPI/' : 'IMPS/') + Math.floor(400000000000 + Math.random() * 99999999999);
    const processedTime = new Date().toLocaleString('en-IN');

    setWithdrawRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved', utrNumber: utr, processedAt: processedTime } : r))
    );

    // Update transactions list
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.userId === target.userId && t.amount === target.amount && t.status === 'processing') {
          return {
            ...t,
            status: 'completed',
            referenceNumber: utr,
            note: 'Approved by Administrator. Settlement UTR verified.',
          };
        }
        return t;
      })
    );

    // Update total payout metric
    setSettings((prev) => ({
      ...prev,
      totalPayoutsDistributedINR: prev.totalPayoutsDistributedINR + target.amount,
    }));
  };

  const rejectWithdrawal = (requestId: string, reason?: string) => {
    const target = withdrawRequests.find((r) => r.id === requestId);
    if (!target) return;

    setWithdrawRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              rejectReason: reason || 'Invalid account details / security verification',
              processedAt: new Date().toLocaleString('en-IN'),
            }
          : r
      )
    );

    // Refund amount back to user if it was current user
    if (currentUser && currentUser.id === target.userId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          balance: +(prev.balance + target.amount).toFixed(2),
        };
      });
    }

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.userId === target.userId && t.amount === target.amount && t.status === 'processing') {
          return {
            ...t,
            status: 'rejected',
            note: reason || 'Transaction rejected. Amount refunded to wallet.',
          };
        }
        return t;
      })
    );
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setDataLimit = (mb: number) => {
    if (!currentUser) return;
    setCurrentUser((prev) => (prev ? { ...prev, dataLimitMB: mb } : null));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setCurrentUser(initialUser);
    setTransactions(initialTransactions);
    setWithdrawRequests(initialWithdrawRequests);
    setSettings(defaultSettings);
    setIsSellingData(true);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        setCurrentUser,
        allUsers,
        transactions,
        withdrawRequests,
        settings,
        isSellingData,
        liveSpeedMbps,
        livePingMs,
        sessionDataMB,
        sessionEarnings,
        networkType,
        activeTab,
        setActiveTab,
        deviceFrame,
        setDeviceFrame,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        selectedReceipt,
        setSelectedReceipt,
        toggleDataSelling,
        loginUser,
        logoutUser,
        requestWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        updateSettings,
        setDataLimit,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
