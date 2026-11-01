import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { Transaction } from '../types';
import {
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Download,
  Share2,
  Building2,
  Smartphone,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { language, selectedReceipt, setSelectedReceipt } = useApp();
  const t = translations[language];

  if (!selectedReceipt) return null;

  const tx = selectedReceipt;
  const isWithdrawal = tx.type === 'withdrawal';

  const downloadReceipt = () => {
    // Generates simulated text receipt download
    const content = `
========================================
             DATAPAY RECEIPT
========================================
Receipt ID: ${tx.id}
Date & Time: ${tx.timestamp}
Transaction Type: ${tx.type.toUpperCase()}
Amount: INR ₹${tx.amount.toFixed(2)}
Status: ${tx.status.toUpperCase()}
UTR / Reference: ${tx.referenceNumber}
Beneficiary / Mode: ${tx.paymentMethod.toUpperCase()}
${tx.upiId ? `UPI ID: ${tx.upiId}` : ''}
${tx.bankDetails ? `Bank: ${tx.bankDetails.bankName}\nA/C: ${tx.bankDetails.accountNumberMasked}\nIFSC: ${tx.bankDetails.ifsc}` : ''}
Note: ${tx.note || 'Verified digital settlement'}
========================================
Thank you for using DataPay Platform!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DataPay_Receipt_${tx.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'hi' ? 'लेनदेन रसीद (Transaction Receipt)' : 'Official Receipt'}
            </span>
          </div>
          <button
            onClick={() => setSelectedReceipt(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-5">
          {/* Status Badge & Amount */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 mb-1 border border-emerald-500/20">
              {tx.status === 'completed' && <CheckCircle2 className="h-6 w-6" />}
              {tx.status === 'processing' && <Clock className="h-6 w-6 text-amber-400" />}
              {tx.status === 'rejected' && <XCircle className="h-6 w-6 text-red-400" />}
            </div>

            <div className="text-3xl font-black text-white font-mono">
              ₹{tx.amount.toFixed(2)}
            </div>

            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                tx.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : tx.status === 'processing'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-red-500/15 text-red-400'
              }`}
            >
              {tx.status === 'completed'
                ? t.statusCompleted
                : tx.status === 'processing'
                ? t.statusProcessing
                : t.statusRejected}
            </span>
          </div>

          {/* Details Table */}
          <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/60 text-xs">
            <div className="flex justify-between p-3 text-slate-400">
              <span>{t.utrNumber}</span>
              <span className="font-mono font-bold text-white text-right">{tx.referenceNumber}</span>
            </div>

            <div className="flex justify-between p-3 text-slate-400">
              <span>{t.date}</span>
              <span className="text-slate-200">{tx.timestamp}</span>
            </div>

            <div className="flex justify-between p-3 text-slate-400">
              <span>{language === 'hi' ? 'भुगतान विधि' : 'Payment Method'}</span>
              <span className="capitalize font-medium text-white flex items-center gap-1">
                {tx.paymentMethod === 'upi' ? (
                  <>
                    <Smartphone className="h-3.5 w-3.5 text-cyan-400" /> UPI Transfer
                  </>
                ) : tx.paymentMethod === 'bank' ? (
                  <>
                    <Building2 className="h-3.5 w-3.5 text-cyan-400" /> Bank Transfer
                  </>
                ) : (
                  'DataPay Wallet'
                )}
              </span>
            </div>

            {tx.upiId && (
              <div className="flex justify-between p-3 text-slate-400">
                <span>UPI ID</span>
                <span className="font-mono font-medium text-cyan-400">{tx.upiId}</span>
              </div>
            )}

            {tx.bankDetails && (
              <>
                <div className="flex justify-between p-3 text-slate-400">
                  <span>{t.bankName}</span>
                  <span className="font-medium text-white">{tx.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between p-3 text-slate-400">
                  <span>A/C No.</span>
                  <span className="font-mono text-white">{tx.bankDetails.accountNumberMasked}</span>
                </div>
                <div className="flex justify-between p-3 text-slate-400">
                  <span>IFSC</span>
                  <span className="font-mono text-white">{tx.bankDetails.ifsc}</span>
                </div>
              </>
            )}

            {tx.dataMB && (
              <div className="flex justify-between p-3 text-slate-400">
                <span>{language === 'hi' ? 'शेयर किया गया डेटा' : 'Shared Bandwidth'}</span>
                <span className="font-mono font-bold text-cyan-400">
                  {(tx.dataMB / 1024).toFixed(2)} GB ({tx.dataMB} MB)
                </span>
              </div>
            )}

            {tx.note && (
              <div className="p-3 text-[11px] text-slate-400 bg-slate-900/40">
                <span className="font-medium text-slate-300">Remark: </span>
                {tx.note}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={downloadReceipt}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{language === 'hi' ? 'रसीद डाउनलोड करें' : 'Download Receipt'}</span>
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              {t.close}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 text-center">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Digital UTR verified by NPCI / Reserve Bank of India framework</span>
          </div>
        </div>
      </div>
    </div>
  );
};
