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
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { language, activeTab, setActiveTab, withdrawRequests } = useApp();
  const t = translations[language];

  const pendingCount = withdrawRequests.filter((r) => r.status === 'pending').length;

  interface NavItem {
    id: 'dashboard' | 'wallet' | 'withdraw' | 'history' | 'apk' | 'admin';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t.navHome, icon: Wifi },
    { id: 'wallet', label: t.navWallet, icon: Wallet },
    { id: 'withdraw', label: t.navWithdraw, icon: ArrowDownToLine },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'apk', label: 'APK', icon: Download },
    { id: 'admin', label: 'Admin', icon: Shield, badge: pendingCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
