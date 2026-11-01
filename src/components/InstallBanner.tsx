import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Sparkles, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallBanner: React.FC = () => {
  const { language, setActiveTab } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (isStandalone || dismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsStandalone(true);
      }
    } else {
      setActiveTab('apk');
    }
  };

  return (
    <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 text-white px-3 py-2 text-xs font-medium flex items-center justify-between gap-2 shadow-md relative z-30">
      <div className="flex items-center gap-2 overflow-hidden">
        <Smartphone className="h-4 w-4 shrink-0 text-cyan-200" />
        <span className="truncate">
          {language === 'hi'
            ? 'DataPay Android ऐप: अपने मोबाइल में 1-क्लिक में इंस्टॉल करें'
            : 'DataPay Android App: Install directly on your mobile device'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="rounded-lg bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-cyan-400 hover:bg-slate-900 transition-colors shadow-sm flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3" />
          <span>{language === 'hi' ? 'इंस्टॉल करें' : 'Install'}</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="rounded p-0.5 text-cyan-200 hover:text-white"
          title="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
