import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  X,
  Smartphone,
  User as UserIcon,
  KeyRound,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    language,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    loginUser,
  } = useApp();

  const t = translations[language];

  const [phone, setPhone] = useState<string>('9876543210');
  const [name, setName] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [referral, setReferral] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleFillDemoOtp = () => {
    setOtp('1234');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phone.length < 10) {
      setError(language === 'hi' ? 'कृपया 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a 10-digit mobile number.');
      return;
    }

    if (!otp) {
      setError(language === 'hi' ? 'कृपया 4-अंकीय OTP दर्ज करें।' : 'Please enter the 4-digit OTP.');
      return;
    }

    const ok = loginUser(phone, name, referral);
    if (!ok) {
      setError('Login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-7 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Smartphone className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {authMode === 'login' ? 'DataPay लॉगिन' : 'DataPay नया खाता'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'hi'
              ? 'इंटरनेट डेटा शेयरिंग शुरू करें और असली पैसे कमाएँ'
              : 'Start sharing unused data and withdraw real earnings'}
          </p>
        </div>

        {/* Welcome Bonus Callout */}
        <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-center gap-2.5">
          <Gift className="h-5 w-5 text-amber-400 shrink-0" />
          <span>{t.welcomeBonusNotice}</span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-950/40 border border-red-500/40 p-2.5 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t.nameLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  required={authMode === 'register'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              {t.phoneLabel}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-xs text-slate-400 font-semibold">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-12 pr-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                {t.otpLabel}
              </label>
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                {t.fillDemoOtp}
              </button>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 1234"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 font-mono text-sm tracking-widest text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t.referralLabel}
              </label>
              <input
                type="text"
                value={referral}
                onChange={(e) => setReferral(e.target.value.toUpperCase())}
                placeholder="DATAPAY88 (Optional)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 uppercase font-mono text-xs text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/25 hover:from-cyan-400 hover:to-sky-500 active:scale-[0.98] transition-all"
          >
            {t.verifyAndLogin}
          </button>
        </form>

        {/* Switch Login/Register */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {authMode === 'login' ? (
            <p>
              {t.needNewAccount}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-cyan-400 hover:underline ml-1"
              >
                रजिस्टर करें
              </button>
            </p>
          ) : (
            <p>
              {t.alreadyHaveAccount}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-cyan-400 hover:underline ml-1"
              >
                लॉगिन करें
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
