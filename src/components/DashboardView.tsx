import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { WalletCard } from './WalletCard';
import { DataSharingWidget } from './DataSharingWidget';
import {
  Wifi,
  Smartphone,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Download,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { language, setActiveTab, transactions, setSelectedReceipt } = useApp();
  const t = translations[language];

  const recentTxs = transactions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 p-5 sm:p-6">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
            <Zap className="h-3.5 w-3.5" />
            <span>{language === 'hi' ? 'निष्क्रिय आय (Passive Income)' : 'Passive Income Node'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t.tagline}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.subTagline}
          </p>
        </div>
      </div>

      {/* Primary Layout Grid: Data Sharing Engine + Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Data Sharing Switch & Live Gauge */}
        <div className="lg:col-span-7">
          <DataSharingWidget />
        </div>

        {/* Right Column (5 cols): Wallet Card & Referral */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <WalletCard />
        </div>
      </div>

      {/* Feature Value Props (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            <Smartphone className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {language === 'hi' ? 'तुरंत UPI भुगतान' : 'Instant UPI Payouts'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'hi'
              ? 'PhonePe, Google Pay, Paytm और किसी भी UPI ID पर 2 मिनट में ट्रांसफर।'
              : 'Direct transfers to PhonePe, Google Pay, Paytm & any BHIM UPI ID.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Building2 className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {language === 'hi' ? 'सीधा बैंक खाता (IMPS/NEFT)' : 'Direct Bank Transfer'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'hi'
              ? 'SBI, HDFC, ICICI, PNB सहित सभी भारतीय बैंकों में सुरक्षित निकासी।'
              : 'Safe withdrawals to all Indian banks via official IMPS clearing.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <Download className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {language === 'hi' ? 'Android APK व सोर्स कोड' : 'Android APK & Code'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'hi'
              ? 'मोबाइल में APK इंस्टॉल करें या Android Studio में खुद बिल्ड करें।'
              : 'Download APK installer or export complete Android Studio project.'}
          </p>
        </div>
      </div>

      {/* Recent Activity Quick View */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            {language === 'hi' ? 'हाल का लेन-देन' : 'Recent Activity'}
          </h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentTxs.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedReceipt(tx)}
              className="flex items-center justify-between rounded-xl bg-slate-950 p-3 hover:bg-slate-800/60 transition-colors cursor-pointer border border-slate-800/60"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    tx.type === 'withdrawal'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {tx.type === 'withdrawal' ? 'W' : '₹'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-md">
                    {tx.title}
                  </div>
                  <div className="text-[10px] text-slate-500">{tx.timestamp}</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-xs font-mono font-bold ${
                    tx.type === 'withdrawal' ? 'text-slate-300' : 'text-emerald-400'
                  }`}
                >
                  {tx.type === 'withdrawal' ? `-₹${tx.amount.toFixed(2)}` : `+₹${tx.amount.toFixed(2)}`}
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
