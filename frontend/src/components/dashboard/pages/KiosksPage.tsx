import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  Tablet, 
  Wifi, 
  Battery, 
  RotateCcw, 
  Lock, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';

export const KiosksPage: React.FC = () => {
  const { tableNumber, setTableNumber, setView, showToast } = useKiosk();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKioskForQR, setSelectedKioskForQR] = useState<number | null>(null);

  // 20 Table Kiosk Devices
  const kiosks = Array.from({ length: 20 }, (_, i) => {
    const tbl = i + 1;
    const isSpecialStandby = tbl === 14 || tbl === 19;
    return {
      tableNum: tbl,
      deviceId: `TAB-KIOSK-${String(tbl).padStart(2, '0')}`,
      model: tbl % 2 === 0 ? 'Galaxy Tab S9 FE 11"' : 'iPad 10th Gen 10.9"',
      batteryPercent: isSpecialStandby ? 48 : Math.min(100, 75 + (tbl * 3) % 25),
      isCharging: isSpecialStandby,
      wifiSignal: '-52 dBm (Excellent)',
      status: isSpecialStandby ? 'STANDBY' : 'ONLINE',
      appVersion: 'v2.4.2-prod',
      lastPing: '2s ago',
      assignedWaiter: tbl <= 5 ? 'Waiter Ravi' : tbl <= 10 ? 'Waiter Priya' : tbl <= 15 ? 'Waiter Arjun' : 'Waiter Suresh',
    };
  });

  const filteredKiosks = kiosks.filter(k => 
    !searchQuery || 
    k.tableNum.toString().includes(searchQuery) || 
    k.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Summary */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Table-Side Kiosk Fleet Management
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
              20 Active Tablets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time heartbeat, battery telemetry, and app lock controls for customer ordering tablets
          </p>
        </div>

        <button
          onClick={() => showToast('Pinged all 20 kiosks successfully (Latency: 14ms)')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ping Fleet</span>
        </button>
      </div>

      {/* Fleet Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Total Kiosks</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-display">20</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">Tables #1 to #20</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Online &amp; Active</span>
          <div className="text-2xl font-black text-emerald-600 font-display">18</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">Live table interaction</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Standby / Charging</span>
          <div className="text-2xl font-black text-amber-500 font-display">2</div>
          <span className="text-[10px] text-amber-600 mt-1 block">Tables #14, #19 docked</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Fleet Battery Avg</span>
          <div className="text-2xl font-black text-blue-600 font-display">94%</div>
          <span className="text-[10px] text-blue-600 mt-1 block">Safe operating threshold</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by table number or device ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Kiosk Devices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Table #</th>
                <th className="py-3 px-4">Device ID</th>
                <th className="py-3 px-4">Hardware Model</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Wifi Signal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Assigned Server</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredKiosks.map((kiosk) => (
                <tr key={kiosk.tableNum} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                      Table {kiosk.tableNum}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-500 text-[11px]">
                    {kiosk.deviceId}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {kiosk.model}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Battery className={`w-3.5 h-3.5 ${kiosk.batteryPercent < 50 ? 'text-amber-500' : 'text-emerald-500'}`} />
                      <span className="text-[11px]">{kiosk.batteryPercent}%</span>
                      {kiosk.isCharging && <span className="text-[10px] text-blue-500 font-bold">(Charging)</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                      {kiosk.wifiSignal}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      kiosk.status === 'ONLINE' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400' 
                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}>
                      {kiosk.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                    {kiosk.assignedWaiter}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedKioskForQR(kiosk.tableNum)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="View Table QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setTableNumber(kiosk.tableNum);
                          setView('kiosk');
                          showToast(`Opened Table ${kiosk.tableNum} Guest Kiosk view`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Open Kiosk</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Dialog Modal */}
      {selectedKioskForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="font-extrabold text-base font-display">Table {selectedKioskForQR} Kiosk QR</span>
              <button onClick={() => setSelectedKioskForQR(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
              <div className="w-40 h-40 bg-white rounded-xl p-2.5 shadow-md flex items-center justify-center border">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <p className="font-mono text-xs text-slate-500 mt-3">
                tbl_{selectedKioskForQR}_tok_{Date.now().toString(36)}
              </p>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Scan from customer smartphone to order directly at Table #{selectedKioskForQR}
            </p>

            <button
              onClick={() => {
                showToast(`QR Code print job sent for Table ${selectedKioskForQR}`);
                setSelectedKioskForQR(null);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Print Table QR Standee
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default KiosksPage;
