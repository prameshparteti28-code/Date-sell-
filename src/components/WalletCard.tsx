import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  Wallet,
  ArrowDownToLine,
  History,
  TrendingUp,
  HardDrive,
  Copy,
  Check,
  Share2,
  Gift,
} from 'lucide-react';

export const WalletCard: React.FC = () => {
  const { language, currentUser, setActiveTab } = useApp();
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const balance = currentUser?.balance || 0;
  const todayEarn = currentUser?.todayEarnings || 0;
  const lifetimeEarn = currentUser?.lifetimeEarnings || 0;
  const totalDataMB = currentUser?.totalDataSharedMB || 0;
  const totalDataGB = (totalDataMB / 1024).toFixed(1);

  const copyReferral = () => {
    if (currentUser?.referralCode) {
      navigator.clipboard.writeText(currentUser.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Wallet Gradient Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 border border-sky-900/40 shadow-xl">
        {/* Subtle decorative mesh */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t.walletBalance}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {language === 'hi' ? 'सक्रिय खाता' : 'Active Account'}
          </span>
        </div>

        {/* Big Balance Number */}
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-cyan-400">₹</span>
          <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight tabular-nums">
            {balance.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 font-medium ml-2">
            INR
          </span>
        </div>

        {/* Action Buttons: Withdraw & History */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            onClick={() => setActiveTab('withdraw')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 hover:from-cyan-400 hover:to-sky-500 active:scale-[0.98] transition-all"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>{t.withdrawNow}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <History className="h-4 w-4 text-slate-400" />
            <span>{t.viewHistory}</span>
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4">
          <div>
            <span className="text-[10px] text-slate-400 block truncate">{t.todayEarnings}</span>
            <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
              +₹{todayEarn.toFixed(2)}
            </span>
          </div>

          <div className="border-l border-slate-800 pl-2">
            <span className="text-[10px] text-slate-400 block truncate">{t.lifetimeEarnings}</span>
            <span className="text-sm font-bold text-slate-200 font-mono tabular-nums">
              ₹{lifetimeEarn.toFixed(2)}
            </span>
          </div>

          <div className="border-l border-slate-800 pl-2">
            <span className="text-[10px] text-slate-400 block truncate">{t.totalDataSold}</span>
            <span className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
              {totalDataGB} GB
            </span>
          </div>
        </div>
      </div>

      {/* Referral & Bonus Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {language === 'hi' ? 'दोस्तों को रेफर करें और ₹25 कमाएँ' : 'Refer Friends & Earn ₹25'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {language === 'hi'
                ? 'आपके कोड से जुड़ने वाले हर दोस्त पर दोनों को ₹25 बोनस।'
                : 'Every friend who joins using your code gets ₹25, and you get ₹25 too!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800 flex-1 sm:flex-initial">
            <span className="font-mono text-xs font-bold text-cyan-400">
              {currentUser?.referralCode || 'DATAPAY88'}
            </span>
            <button
              onClick={copyReferral}
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
