import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  Shield,
  Users,
  HardDrive,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  Settings,
  Sliders,
  Smartphone,
  Building2,
  Search,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const AdminPanelTab: React.FC = () => {
  const {
    language,
    settings,
    updateSettings,
    withdrawRequests,
    approveWithdrawal,
    rejectWithdrawal,
    allUsers,
    resetToDefaults,
  } = useApp();

  const t = translations[language];

  const [ratePerGB, setRatePerGB] = useState<number>(settings.ratePerGB);
  const [minWithdraw, setMinWithdraw] = useState<number>(settings.minWithdrawalAmount);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('गलत खाता विवरण (Invalid account details)');

  const pendingRequests = withdrawRequests.filter((r) => r.status === 'pending');
  const processedRequests = withdrawRequests.filter((r) => r.status !== 'pending');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ratePerGB: Number(ratePerGB),
      minWithdrawalAmount: Number(minWithdraw),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleConfirmReject = () => {
    if (rejectId) {
      rejectWithdrawal(rejectId, rejectReason);
      setRejectId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t.adminTitle}
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
                MASTER ADMIN
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.adminSubtitle}</p>
          </div>
        </div>

        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Reset demo data"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{language === 'hi' ? 'डेमो रीसेट करें' : 'Reset Demo Data'}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.totalUsers}</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {settings.totalRegisteredUsers.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">+142 आज जुड़े</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.totalBandwidth}</span>
            <HardDrive className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {(settings.totalDataPurchasedGB / 1000).toFixed(1)} TB
          </div>
          <span className="text-[10px] text-slate-400 font-medium">184,500 GB कुल</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.totalPayouts}</span>
            <Banknote className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            ₹{(settings.totalPayoutsDistributedINR / 100000).toFixed(2)} Lakh
          </div>
          <span className="text-[10px] text-slate-400 font-medium">100% सफल निस्तारण</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.pendingRequests}</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {pendingRequests.length}
          </div>
          <span className="text-[10px] text-amber-300 font-medium">
            {pendingRequests.length > 0 ? 'कार्रवाई की आवश्यकता है' : 'सभी स्वीकृत'}
          </span>
        </div>
      </div>

      {/* Pending Withdrawals Approval Queue */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              {t.pendingRequests}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'यूज़र्स द्वारा लगाए गए निकासी अनुरोधों को स्वीकृत या रद्द करें'
                : 'Approve or reject pending user withdrawal requests'}
            </p>
          </div>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
            {pendingRequests.length} Pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              {language === 'hi'
                ? 'कोई लंबित निकासी अनुरोध नहीं है।'
                : 'No pending withdrawal requests. All settled!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/50">
                <tr>
                  <th className="p-3">User & Contact</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Payout Destination</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Requested At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {pendingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-white">{req.userName}</div>
                      <div className="font-mono text-slate-400 text-[11px]">+91 {req.userPhone}</div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-semibold uppercase text-cyan-400">
                        {req.method === 'upi' ? <Smartphone className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                        {req.method}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      {req.method === 'upi' ? (
                        <span className="text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {req.upiId}
                        </span>
                      ) : (
                        <div>
                          <div className="text-white">{req.bankDetails?.bankName}</div>
                          <div className="text-slate-400 text-[11px]">
                            A/C: {req.bankDetails?.accountNumber} | {req.bankDetails?.ifsc}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400 text-sm">
                      ₹{req.amount.toFixed(2)}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {req.requestedAt}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => approveWithdrawal(req.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm transition-all"
                        >
                          {t.approve}
                        </button>
                        <button
                          onClick={() => setRejectId(req.id)}
                          className="rounded-lg border border-red-500/40 bg-red-950/20 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-all"
                        >
                          {t.reject}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal dialog if active */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              {language === 'hi' ? 'निकासी रद्द करने का कारण' : 'Reason for Rejection'}
            </h4>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="गलत खाता विवरण (Invalid account details)">गलत खाता विवरण (Invalid account details)</option>
              <option value="अमान्य UPI ID (Invalid UPI ID)">अमान्य UPI ID (Invalid UPI ID)</option>
              <option value="दैनिक सीमा पार (Daily limit exceeded)">दैनिक सीमा पार (Daily limit exceeded)</option>
              <option value="सुरक्षा सत्यापन आवश्यक (Security review required)">सुरक्षा सत्यापन आवश्यक (Security review)</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRejectId(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                {t.reject}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate & Platform Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Settings className="h-4 w-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            {language === 'hi' ? 'प्लेटफ़ॉर्म दर और सीमा सेटिंग्स' : 'Platform Rate & Limit Settings'}
          </h3>
        </div>

        {saveSuccess && (
          <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{t.actionSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              {t.setRate}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono font-bold text-cyan-400">
                ₹
              </span>
              <input
                type="number"
                min="5"
                max="100"
                value={ratePerGB}
                onChange={(e) => setRatePerGB(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-8 pr-4 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'hi'
                ? 'यूज़र को प्रति GB डेटा बेचने पर मिलने वाली राशि।'
                : 'Payout given to user for each 1GB bandwidth monetized.'}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              {t.setMinWithdraw}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono font-bold text-cyan-400">
                ₹
              </span>
              <input
                type="number"
                min="10"
                max="500"
                value={minWithdraw}
                onChange={(e) => setMinWithdraw(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-8 pr-4 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'hi'
                ? 'न्यूनतम राशि जो यूज़र निकाल सकता है।'
                : 'Minimum balance threshold required before requesting payout.'}
            </p>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 shadow-md transition-colors"
            >
              {t.saveSettings}
            </button>
          </div>
        </form>
      </div>

      {/* Users Overview Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {language === 'hi' ? 'सक्रिय यूज़र डायरेक्टरी' : 'Active Users Directory'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">Total {allUsers.length} simulated users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/50">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Data Shared</th>
                <th className="p-3">Wallet Balance</th>
                <th className="p-3">Lifetime Earned</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="font-mono text-slate-400 text-[11px]">+91 {u.phone}</div>
                  </td>
                  <td className="p-3 font-mono text-cyan-400">
                    {(u.totalDataSharedMB / 1024).toFixed(1)} GB
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    ₹{u.balance.toFixed(2)}
                  </td>
                  <td className="p-3 font-mono text-slate-200">
                    ₹{u.lifetimeEarnings.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.isSellingData
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.isSellingData ? 'Online & Selling' : 'Paused'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
