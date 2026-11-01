import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { Transaction } from '../types';
import {
  History,
  ArrowDownToLine,
  Wifi,
  Gift,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Calendar,
  Filter,
} from 'lucide-react';

export const TransactionHistoryTab: React.FC = () => {
  const { language, transactions, setSelectedReceipt } = useApp();
  const t = translations[language];

  const [filter, setFilter] = useState<'all' | 'earnings' | 'withdrawals'>('all');

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'earnings') {
      return tx.type === 'data_earning' || tx.type === 'referral_bonus' || tx.type === 'signup_bonus';
    }
    if (filter === 'withdrawals') {
      return tx.type === 'withdrawal';
    }
    return true;
  });

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            <span>{t.statusCompleted}</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>{t.statusProcessing}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400 border border-red-500/20">
            <XCircle className="h-3 w-3" />
            <span>{t.statusRejected}</span>
          </span>
        );
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'withdrawal':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ArrowDownToLine className="h-5 w-5" />
          </div>
        );
      case 'data_earning':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wifi className="h-5 w-5" />
          </div>
        );
      case 'referral_bonus':
      case 'signup_bonus':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Gift className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-400" />
            {t.historyTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'आपके डेटा की कमाई, निकासी और बोनस का संपूर्ण रिकॉर्ड'
              : 'Complete record of bandwidth sales, payouts, and rewards'}
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.allTransactions}
          </button>
          <button
            onClick={() => setFilter('earnings')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === 'earnings'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.earningsOnly}
          </button>
          <button
            onClick={() => setFilter('withdrawals')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === 'withdrawals'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.withdrawalsOnly}
          </button>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <History className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <p className="text-sm font-medium">{t.noTransactions}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => {
            const isCredit = tx.type !== 'withdrawal';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedReceipt(tx)}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900 cursor-pointer shadow-sm"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {getTypeIcon(tx.type)}
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {tx.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-[11px] text-slate-500">
                        {tx.referenceNumber}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        {tx.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div
                      className={`text-base font-bold font-mono tabular-nums ${
                        isCredit ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {isCredit ? `+₹${tx.amount.toFixed(2)}` : `-₹${tx.amount.toFixed(2)}`}
                    </div>
                    <div className="mt-0.5">{getStatusBadge(tx.status)}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReceipt(tx);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 group-hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                    title="View Receipt"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
