import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceFrame, setDeviceFrame } = useApp();
  const [timeStr, setTimeStr] = useState<string>('10:48');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const [isRealMobile, setIsRealMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsRealMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If already on a real phone or user chose desktop view, render native full-width
  if (isRealMobile || deviceFrame === 'desktop') {
    return <div className="w-full px-1 sm:px-4 pb-20 sm:pb-8">{children}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 sm:py-8 sm:px-4">
      {/* Device Mode Switcher Callout Banner */}
      <div className="mb-4 flex items-center justify-between gap-4 w-full max-w-[430px] rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <Smartphone className="h-4 w-4 text-cyan-400" />
          <span>Android Mobile Device Preview</span>
        </span>
        <button
          onClick={() => setDeviceFrame('desktop')}
          className="text-cyan-400 hover:text-white font-semibold flex items-center gap-1 transition-colors"
        >
          <Monitor className="h-3.5 w-3.5" />
          <span>Full Screen</span>
        </button>
      </div>

      {/* Android Device Chassis */}
      <div className="relative w-full max-w-[430px] overflow-hidden rounded-[44px] border-[10px] border-slate-800 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-slate-700/50">
        {/* Top Speaker & Punch Hole Camera */}
        <div className="sticky top-0 z-50 flex h-10 w-full items-center justify-between bg-slate-950 px-6 text-slate-300 text-xs">
          {/* Time */}
          <span className="font-semibold tracking-tight text-[11px] font-mono">{timeStr}</span>

          {/* Punch hole camera */}
          <div className="h-3.5 w-3.5 rounded-full bg-black ring-2 ring-slate-800" />

          {/* Status Icons: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold text-cyan-400 font-mono">5G</span>
            <Signal className="h-3.5 w-3.5 text-slate-300" />
            <Wifi className="h-3.5 w-3.5 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">98%</span>
              <div className="h-2.5 w-4 rounded-sm border border-slate-400 p-0.5 flex items-center">
                <div className="h-full w-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="max-h-[820px] min-h-[700px] overflow-y-auto pb-20 px-3 pt-2">
          {children}
        </div>

        {/* Bottom Android Gesture Navigation Bar */}
        <div className="sticky bottom-0 z-50 flex h-5 w-full items-center justify-center bg-slate-950/90 backdrop-blur-sm">
          <div className="h-1 w-32 rounded-full bg-slate-600/70" />
        </div>
      </div>
    </div>
  );
};
