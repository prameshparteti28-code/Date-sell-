import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  Power,
  Zap,
  Activity,
  Radio,
  Sliders,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const DataSharingWidget: React.FC = () => {
  const {
    language,
    isSellingData,
    toggleDataSelling,
    liveSpeedMbps,
    livePingMs,
    sessionDataMB,
    sessionEarnings,
    networkType,
    settings,
    currentUser,
    setDataLimit,
  } = useApp();

  const t = translations[language];

  // Helper for MB or GB display
  const formatDataSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const limitOptions = [1024, 2048, 5120, 10240, 999999]; // in MB

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl">
      {/* Decorative ambient background blur */}
      <div
        className={`absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          isSellingData ? 'bg-cyan-500/15' : 'bg-slate-700/10'
        }`}
      />

      {/* Header of the Widget */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-3 w-3 rounded-full transition-colors ${
              isSellingData ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-slate-500'
            }`}
          />
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {isSellingData ? t.sharingActive : t.sharingInactive}
            </h3>
            <p className="text-[11px] text-slate-400">
              {networkType} · {isSellingData ? `${livePingMs}ms ping` : 'Paused'}
            </p>
          </div>
        </div>

        {/* Current Rate Badge */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {t.currentRate}
          </span>
          <div className="text-sm font-extrabold text-cyan-400 font-mono">
            ₹{settings.ratePerGB} <span className="text-xs font-normal text-slate-400">/{t.perGb}</span>
          </div>
        </div>
      </div>

      {/* Main Switch & Dial Visualization */}
      <div className="my-6 flex flex-col items-center justify-center">
        {/* Animated Circle Radar */}
        <div className="relative flex items-center justify-center">
          {/* Wave Ripple when active */}
          {isSellingData && (
            <>
              <div className="absolute h-44 w-44 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
              <div className="absolute h-52 w-52 rounded-full border border-sky-500/10 animate-pulse" />
            </>
          )}

          {/* Interactive Button */}
          <button
            onClick={toggleDataSelling}
            className={`group relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 transition-all duration-300 shadow-2xl active:scale-95 ${
              isSellingData
                ? 'border-cyan-400 bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white shadow-cyan-500/30 ring-8 ring-cyan-500/10 hover:brightness-110'
                : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <Power className={`h-8 w-8 mb-1.5 transition-transform group-hover:scale-110 ${isSellingData ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isSellingData ? (language === 'hi' ? 'चालू है' : 'ACTIVE') : (language === 'hi' ? 'शुरू करें' : 'START')}
            </span>
            <span className="text-[9px] opacity-80 mt-0.5">
              {isSellingData ? (language === 'hi' ? 'रोकने के लिए दबाएँ' : 'Tap to Pause') : (language === 'hi' ? 'बेचना शुरू करें' : 'Tap to Share')}
            </span>
          </button>
        </div>

        {/* Live Speed Ticker */}
        <div className="mt-5 flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className={`h-3.5 w-3.5 ${isSellingData ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{t.liveUploadRate}:</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {isSellingData ? `${liveSpeedMbps} MB/s` : '0.0 MB/s'}
            </span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t.ping}:</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {isSellingData ? `${livePingMs} ms` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Session Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-950/70 p-3.5 border border-slate-800">
        <div>
          <span className="text-[11px] text-slate-400">{t.sessionData}</span>
          <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
            {formatDataSize(sessionDataMB)}
          </div>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
            <TrendingUp className="h-3 w-3 text-cyan-400" />
            {isSellingData ? '+1.8 MB/tick' : 'Standby'}
          </span>
        </div>

        <div className="border-l border-slate-800 pl-3">
          <span className="text-[11px] text-slate-400">{t.sessionEarned}</span>
          <div className="text-base font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
            ₹{sessionEarnings.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            {language === 'hi' ? 'सीधा वॉलेट में जुड़ा' : 'Added to wallet'}
          </span>
        </div>
      </div>

      {/* Daily Data Quota Selection */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            {t.dailyQuota}
          </span>
          <span className="text-slate-400 text-[11px] font-mono">
            {currentUser?.dataLimitMB && currentUser.dataLimitMB >= 999999
              ? t.unlimited
              : `${((currentUser?.dataLimitMB || 5120) / 1024).toFixed(0)} GB / day`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {limitOptions.map((mb) => {
            const isSelected = (currentUser?.dataLimitMB || 5120) === mb;
            const label = mb >= 999999 ? '∞ Max' : `${mb / 1024} GB`;
            return (
              <button
                key={mb}
                onClick={() => setDataLimit(mb)}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & Battery Safety Notice */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30 px-3 py-2 text-[11px] text-emerald-300">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
        <span>
          {language === 'hi'
            ? 'सुरक्षित एन्क्रिप्टेड नोड: केवल अप्रयुक्त बैंडविड्थ का मुद्रीकरण होता है। आपकी व्यक्तिगत फाइलें कभी एक्सेस नहीं की जाती हैं।'
            : 'End-to-End Encrypted Node: Only unused bandwidth is monetized. Your personal data is never accessed.'}
        </span>
      </div>
    </div>
  );
};
