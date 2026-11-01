import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  Wifi,
  Wallet,
  ArrowDownToLine,
  History,
  Download,
  Shield,
  Smartphone,
  Monitor,
  User as UserIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currentUser,
    activeTab,
    setActiveTab,
    deviceFrame,
    setDeviceFrame,
    setShowAuthModal,
    setAuthMode,
    logoutUser,
    withdrawRequests,
  } = useApp();

  const t = translations[language];
  const pendingCount = withdrawRequests.filter((r) => r.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Zone 1: Single Brand Lockup */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex cursor-pointer items-center gap-2.5 whitespace-nowrap shrink-0 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Wifi className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">DataPay</span>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider border border-cyan-500/20">
                5G
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              {language === 'hi' ? 'डेटा बेचें · पैसे कमाएँ' : 'Data Earning App'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wifi className="h-4 w-4" />
            <span>{t.navHome}</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'wallet'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>{t.navWallet}</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'withdraw'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>{t.navWithdraw}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <History className="h-4 w-4" />
            <span>{t.navHistory}</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'apk'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>{t.navApk}</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`relative flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Shield className="h-4 w-4 text-amber-400" />
            <span>{t.navAdmin}</span>
            {pendingCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile vs Desktop View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5">
            <button
              onClick={() => setDeviceFrame('mobile')}
              title={t.viewAndroidFrame}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                deviceFrame === 'mobile'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">App</span>
            </button>
            <button
              onClick={() => setDeviceFrame('desktop')}
              title={t.viewDesktopFrame}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                deviceFrame === 'desktop'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Web</span>
            </button>
          </div>

          {/* Language Toggle (Hindi / English) */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5">
            <button
              onClick={() => setLanguage('hi')}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                language === 'hi'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                language === 'en'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* User Auth Info / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  ₹{currentUser.balance.toFixed(2)}
                </span>
              </div>
              <button
                onClick={logoutUser}
                title={t.logout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:from-cyan-500 hover:to-sky-500 shadow-sm shadow-cyan-600/20 transition-all whitespace-nowrap"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>{t.login}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
