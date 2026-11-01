import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WithdrawTab } from './components/WithdrawTab';
import { TransactionHistoryTab } from './components/TransactionHistoryTab';
import { AdminPanelTab } from './components/AdminPanelTab';
import { ApkCenterTab } from './components/ApkCenterTab';
import { WalletCard } from './components/WalletCard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AndroidFrame } from './components/AndroidFrame';
import { InstallBanner } from './components/InstallBanner';
import { AuthModal } from './components/AuthModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ShieldCheck, Wifi, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, deviceFrame } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'wallet':
        return (
          <div className="mx-auto max-w-xl space-y-6">
            <WalletCard />
          </div>
        );
      case 'withdraw':
        return <WithdrawTab />;
      case 'history':
        return <TransactionHistoryTab />;
      case 'apk':
        return <ApkCenterTab />;
      case 'admin':
        return <AdminPanelTab />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <InstallBanner />

      <main className="flex-1">
        {deviceFrame === 'mobile' ? (
          <AndroidFrame>
            <div className="py-2">{renderActiveScreen()}</div>
          </AndroidFrame>
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            {renderActiveScreen()}
          </div>
        )}
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <MobileBottomNav />

      {/* Modals */}
      <AuthModal />
      <ReceiptModal />

      {/* Minimalist Footnote (Desktop only) */}
      <footer className="hidden sm:block border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-cyan-500" />
            <span className="font-semibold text-slate-400">DataPay India</span>
            <span>·</span>
            <span>सुरक्षित 5G डेटा मोनेटाइजेशन प्लेटफ़ॉर्म</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>UPI & IMPS समर्थित</span>
            <span>·</span>
            <span>256-Bit SSL Encrypted</span>
            <span>·</span>
            <span>Android APK v2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
