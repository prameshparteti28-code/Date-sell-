import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  ArrowDownToLine,
  Smartphone,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Info,
  Check,
} from 'lucide-react';

export const WithdrawTab: React.FC = () => {
  const { language, currentUser, settings, requestWithdrawal, setActiveTab } = useApp();
  const t = translations[language];

  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [amount, setAmount] = useState<string>('100');
  const [upiId, setUpiId] = useState<string>(currentUser?.upiId || '');
  const [selectedUpiHandle, setSelectedUpiHandle] = useState<string>('');

  // Bank Form State
  const [accountNumber, setAccountNumber] = useState<string>(
    currentUser?.bankAccount?.accountNumber || ''
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>(
    currentUser?.bankAccount?.accountNumber || ''
  );
  const [ifsc, setIfsc] = useState<string>(currentUser?.bankAccount?.ifscCode || '');
  const [holderName, setHolderName] = useState<string>(
    currentUser?.bankAccount?.holderName || currentUser?.name || ''
  );
  const [bankName, setBankName] = useState<string>(
    currentUser?.bankAccount?.bankName || 'State Bank of India'
  );

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balance = currentUser?.balance || 0;
  const numAmount = parseFloat(amount) || 0;

  // Preset chips
  const quickAmounts = [50, 100, 200, 500];

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setError(null);
  };

  const handleMaxAmount = () => {
    setAmount(Math.floor(balance).toString());
    setError(null);
  };

  // UPI Handle suggestions
  const upiHandles = ['@paytm', '@ybl', '@okaxis', '@oksbi', '@ibl'];

  const appendUpiHandle = (handle: string) => {
    const raw = upiId.split('@')[0];
    setUpiId(raw + handle);
    setSelectedUpiHandle(handle);
  };

  // Detect bank from IFSC
  const handleIfscChange = (val: string) => {
    const upper = val.toUpperCase().trim();
    setIfsc(upper);
    if (upper.startsWith('SBIN')) setBankName('State Bank of India');
    else if (upper.startsWith('HDFC')) setBankName('HDFC Bank');
    else if (upper.startsWith('ICIC')) setBankName('ICICI Bank');
    else if (upper.startsWith('PUNB')) setBankName('Punjab National Bank');
    else if (upper.startsWith('BARB')) setBankName('Bank of Baroda');
    else if (upper.startsWith('PYTM')) setBankName('Paytm Payments Bank');
    else if (upper.startsWith('AIRP')) setBankName('Airtel Payments Bank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (numAmount < settings.minWithdrawalAmount) {
      setError(`${t.minAmountNotice}${settings.minWithdrawalAmount}`);
      return;
    }

    if (numAmount > balance) {
      setError(
        language === 'hi'
          ? `आपके वॉलेट में केवल ₹${balance.toFixed(2)} उपलब्ध हैं।`
          : `Insufficient balance. Available: ₹${balance.toFixed(2)}`
      );
      return;
    }

    if (method === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setError(
          language === 'hi'
            ? 'कृपया एक वैध UPI ID दर्ज करें (उदा. 9876543210@paytm)'
            : 'Please enter a valid UPI ID (e.g. mobile@paytm)'
        );
        return;
      }
    } else {
      if (!accountNumber || accountNumber.length < 8) {
        setError(
          language === 'hi'
            ? 'कृपया वैध बैंक खाता संख्या दर्ज करें।'
            : 'Please enter a valid bank account number.'
        );
        return;
      }
      if (accountNumber !== confirmAccountNumber) {
        setError(
          language === 'hi'
            ? 'खाता संख्या और पुष्टि संख्या मेल नहीं खाती हैं।'
            : 'Account numbers do not match.'
        );
        return;
      }
      if (!ifsc || ifsc.length < 11) {
        setError(
          language === 'hi'
            ? 'कृपया वैध 11-अक्षरों का IFSC कोड दर्ज करें।'
            : 'Please enter a valid 11-character IFSC code.'
        );
        return;
      }
      if (!holderName.trim()) {
        setError(
          language === 'hi'
            ? 'कृपया खाताधारक का नाम दर्ज करें।'
            : 'Please enter the account holder name.'
        );
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = requestWithdrawal({
        amount: numAmount,
        method,
        upiId: method === 'upi' ? upiId : undefined,
        bankDetails:
          method === 'bank'
            ? {
                accountNumber,
                ifsc,
                holderName,
                bankName,
              }
            : undefined,
      });

      setIsSubmitting(false);

      if (res.success) {
        setSuccessMsg(
          language === 'hi'
            ? `₹${numAmount} की निकासी अनुरोध सफलतापूर्वक दर्ज हो गई है! राशि आपके खाते में भेजी जा रही है।`
            : `Withdrawal request for ₹${numAmount} submitted! Payout is being processed to your account.`
        );
      } else {
        setError(res.error || 'Withdrawal failed');
      }
    }, 600);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Title & Available Balance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-cyan-400" />
            {t.withdrawTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'कमाए गए पैसों को सीधे अपने बैंक या UPI खाते में निकालें'
              : 'Transfer earnings instantly to your bank account or UPI ID'}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 px-4 py-2.5 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {t.walletBalance}
          </span>
          <span className="text-xl font-bold text-cyan-400 font-mono">
            ₹{balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-white">
              {language === 'hi' ? 'अनुरोध सफल!' : 'Request Accepted!'}
            </h4>
            <p className="text-xs mt-0.5 text-emerald-200">{successMsg}</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setActiveTab('history')}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                {t.viewHistory}
              </button>
              <button
                onClick={() => setSuccessMsg(null)}
                className="text-xs text-emerald-400 underline hover:text-white"
              >
                {language === 'hi' ? 'एक और निकासी करें' : 'Make another withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Method Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            {t.selectMethod}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMethod('upi');
                setError(null);
              }}
              className={`flex items-center justify-center gap-3 rounded-xl border p-4 transition-all ${
                method === 'upi'
                  ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-md shadow-cyan-900/20'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Smartphone className={`h-5 w-5 ${method === 'upi' ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div className="text-left">
                <span className="block text-sm font-bold">UPI ID</span>
                <span className="block text-[10px] text-slate-400">PhonePe / GPay / Paytm</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod('bank');
                setError(null);
              }}
              className={`flex items-center justify-center gap-3 rounded-xl border p-4 transition-all ${
                method === 'bank'
                  ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-md shadow-cyan-900/20'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Building2 className={`h-5 w-5 ${method === 'bank' ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div className="text-left">
                <span className="block text-sm font-bold">Bank Transfer</span>
                <span className="block text-[10px] text-slate-400">IMPS / NEFT Direct</span>
              </div>
            </button>
          </div>
        </div>

        {/* Withdrawal Amount Input & Quick Chips */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.enterAmount}
            </label>
            <span className="text-[11px] text-slate-400">
              {t.minAmountNotice}{settings.minWithdrawalAmount}
            </span>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-xl font-bold text-cyan-400">
              ₹
            </div>
            <input
              type="number"
              min={settings.minWithdrawalAmount}
              max={balance}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-10 pr-24 font-mono text-2xl font-bold text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
            <button
              type="button"
              onClick={handleMaxAmount}
              className="absolute inset-y-2 right-2 rounded-lg bg-slate-800 px-3 text-xs font-bold text-cyan-400 hover:bg-slate-700 transition-colors"
            >
              MAX
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold font-mono transition-colors ${
                  numAmount === val
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ₹{val}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fields for UPI */}
        {method === 'upi' ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                {t.enterUpiId}
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. 9876543210@paytm or rahul@okaxis"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                required
              />
            </div>

            {/* Quick UPI Handle suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">
                {language === 'hi' ? 'लोकप्रिय हैंडल चुनें:' : 'Popular UPI Handles:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {upiHandles.map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    onClick={() => appendUpiHandle(handle)}
                    className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-mono text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-colors"
                  >
                    {handle}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>{t.instantTransferNotice}</span>
            </div>
          </div>
        ) : (
          /* Dynamic Fields for Bank Transfer */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                {t.accountHolderName}
              </label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Name as per Bank Passbook"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  {t.accountNumber}
                </label>
                <input
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter Account Number"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  {t.reAccountNumber}
                </label>
                <input
                  type="text"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  placeholder="Re-enter Account Number"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  {t.ifscCode}
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={ifsc}
                  onChange={(e) => handleIfscChange(e.target.value)}
                  placeholder="e.g. SBIN0001234"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 uppercase focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  {t.bankName}
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank Name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Breakdown & Payout Summary */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>{language === 'hi' ? 'अनुरोधित राशि' : 'Requested Amount'}:</span>
            <span className="font-mono font-semibold text-white">₹{numAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{t.platformFee}:</span>
            <span className="font-mono font-semibold text-emerald-400">{t.free}</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-white">
            <span>{t.netAmount}:</span>
            <span className="font-mono text-cyan-400 text-base">₹{numAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || numAmount <= 0 || numAmount > balance}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 hover:from-cyan-400 hover:to-sky-500 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <ArrowDownToLine className="h-5 w-5" />
              <span>{t.withdrawButton} (₹{numAmount || 0})</span>
            </>
          )}
        </button>

        {/* Safe Banking Trust Seal */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>
            {language === 'hi'
              ? '256-bit बैंक-ग्रेड सुरक्षा · त्वरित IMPS/UPI भुगतान प्रणाली'
              : '256-Bit Bank Grade Security · Instant IMPS/UPI Payout System'}
          </span>
        </div>
      </form>
    </div>
  );
};
