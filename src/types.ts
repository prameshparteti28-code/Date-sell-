export type Language = 'hi' | 'en';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
  lifetimeEarnings: number;
  todayEarnings: number;
  totalDataSharedMB: number;
  referralCode: string;
  joinedDate: string;
  isSellingData: boolean;
  dataLimitMB: number; // e.g. 2048 MB (2 GB)
  dailyCapActive: boolean;
  upiId?: string;
  bankAccount?: {
    accountNumber: string;
    ifscCode: string;
    holderName: string;
    bankName: string;
  };
  isAdmin?: boolean;
}

export type TransactionType = 'data_earning' | 'withdrawal' | 'referral_bonus' | 'signup_bonus';
export type TransactionStatus = 'completed' | 'processing' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  title: string;
  amount: number;
  dataMB?: number;
  status: TransactionStatus;
  timestamp: string;
  paymentMethod: 'upi' | 'bank' | 'wallet';
  referenceNumber: string;
  upiId?: string;
  bankDetails?: {
    bankName: string;
    accountNumberMasked: string;
    ifsc: string;
  };
  note?: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: 'upi' | 'bank';
  upiId?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    holderName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  utrNumber?: string;
  rejectReason?: string;
}

export interface SystemSettings {
  ratePerGB: number; // In Rupees, e.g., 25
  minWithdrawalAmount: number; // In Rupees, e.g., 50
  maxDailyDataGB: number; // Default 5GB
  platformActive: boolean;
  totalRegisteredUsers: number;
  totalDataPurchasedGB: number;
  totalPayoutsDistributedINR: number;
}
