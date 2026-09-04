/**
 * 隨堂抽考推播設定面板 (Notification Settings Modal)
 * 允許使用者自訂推播頻率、題目範圍、權限管理與即時測試發送
 */
import { useEffect, useState } from "react";
import {
  X, Bell, BellRing, Clock, Target, Sparkles, ShieldCheck,
  Check, Send, Zap, Volume2, AlertCircle, Info
} from "lucide-react";
import {
  getNotificationConfig,
  saveNotificationConfig,
  scheduleQuizNotifications,
  sendInstantTestNotification,
  requestNotificationPermission,
  checkNotificationPermission,
  type NotificationConfig,
  type NotificationFrequency,
  type NotificationScope,
} from "@/services/notificationService";
import { toast } from "sonner";

export interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchInstantQuiz: () => void;
}

const FREQUENCY_OPTIONS: { id: NotificationFrequency; label: string; desc: string }[] = [
  { id: "1h", label: "每 1 小時", desc: "高強度衝刺，隨機抽考一題" },
  { id: "2h", label: "每 2 小時", desc: "適中節奏，間歇複習觀念" },
  { id: "4h", label: "每 4 小時", desc: "日常溫習，不打擾工作節奏" },
  { id: "daily_3", label: "每日 3 次定時", desc: "固定於 09:00、14:00、20:00 推播" },
];

const SCOPE_OPTIONS: { id: NotificationScope; label: string; desc: string }[] = [
  { id: "mistakes_first", label: "🎯 優先抽考歷史錯題與弱點", desc: "依個人作答紀錄優先挑選答錯題，無錯題時自動隨機出題" },
  { id: "all", label: "📚 全題庫隨機抽取", desc: "涵蓋 iPAS 初/中級全部考科與英語能力檢定" },
  { id: "ipas_basic", label: "🤖 iPAS AI 初級專屬", desc: "人工智慧基礎概論、生成式 AI 應用與規劃" },
  { id: "ipas_intermediate", label: "⚡ iPAS AI 中級專屬", desc: "技術應用規劃、大數據分析、機器學習應用" },
  { id: "english", label: "🌍 國際英語檢定專屬", desc: "CEFR B2 英文與 Cambridge B2 First 專屬題型" },
  { id: "claude_cert", label: "🧠 Claude 認證 CCAR-F 專屬", desc: "代理架構、Claude Code、提示工程、MCP 工具與情境管理五大領域" },
];

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  onLaunchInstantQuiz,
}: NotificationSettingsModalProps) {
  const [config, setConfig] = useState<NotificationConfig>(getNotificationConfig());
  const [hasPermission, setHasPermission] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getNotificationConfig());
      checkNotificationPermission().then(setHasPermission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnabled = async (nextEnabled: boolean) => {
    if (nextEnabled && !hasPermission) {
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
      if (!granted) {
        toast.error("未取得通知權限，請在系統設定中允許 iPassAI 發送通知。");
        return;
      }
    }

    const updated = { ...config, enabled: nextEnabled };
    setConfig(updated);
    saveNotificationConfig(updated);
    await scheduleQuizNotifications();
    if (nextEnabled) {
      toast.success("已開啟隨堂抽考推播！將依設定時間發送測驗通知。");
    } else {
      toast.info("已關閉隨堂抽考推播。");
    }
  };

  const handleUpdateFrequency = async (freq: NotificationFrequency) => {
    const updated = { ...config, frequency: freq };
    setConfig(updated);
    saveNotificationConfig(updated);
    if (config.enabled) {
      await scheduleQuizNotifications();
      toast.success(`已更新推播頻率為：${FREQUENCY_OPTIONS.find(f => f.id === freq)?.label}`);
    }
  };

  const handleUpdateScope = async (scope: NotificationScope) => {
    const updated = { ...config, scope };
    setConfig(updated);
    saveNotificationConfig(updated);
    if (config.enabled) {
      await scheduleQuizNotifications();
      toast.success("已更新抽考題庫範圍偏好！");
    }
  };

  const handleSendTestNotification = async () => {
    if (!hasPermission) {
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
      if (!granted) {
        toast.error("請先允許通知權限以接收測試推播。");
        return;
      }
    }

    setIsSendingTest(true);
    try {
      const question = await sendInstantTestNotification(config.scope);
      if (question) {
        toast.success(`已發送 2 秒後測試推播：[${question.subject}] ${question.topic}`, {
          description: "請留意手機通知欄或桌面推播，點擊即可作答！",
        });
      }
    } catch {
      toast.error("發送測試通知失敗，請確認裝置權限。");
    } finally {
      setTimeout(() => setIsSendingTest(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-white shadow-xs">
              <BellRing size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">手機隨堂抽考與推播設定</h3>
              <p className="text-xs text-slate-500">本機離線排程通知，點擊即可快問快答並記錄成績</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Switch Card */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell size={16} className="text-indigo-600" />
                啟用隨堂抽考推播
              </div>
              <p className="text-xs text-slate-500">
                定時在手機通知欄彈出題目，作答結果直接連動錯題與學習進度
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleToggleEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Permission Status */}
          {!hasPermission && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="font-bold">尚未開啟通知權限</div>
                <p className="text-amber-800">
                  Android 13 以上版本或瀏覽器需要授權通知才能在背景接收隨堂考題。
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const granted = await requestNotificationPermission();
                  setHasPermission(granted);
                  if (granted) toast.success("通知權限已允許！");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors shrink-0"
              >
                授予權限
              </button>
            </div>
          )}

          {/* Frequency Section */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Clock size={14} className="text-indigo-600" />
              推播頻率設定
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FREQUENCY_OPTIONS.map((option) => {
                const isSelected = config.frequency === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleUpdateFrequency(option.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 text-indigo-950"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{option.label}</span>
                      {isSelected && <Check size={14} className="text-indigo-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">{option.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope Section */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Target size={14} className="text-indigo-600" />
              抽考題庫偏好
            </label>
            <div className="space-y-1.5">
              {SCOPE_OPTIONS.map((option) => {
                const isSelected = config.scope === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleUpdateScope(option.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 text-indigo-950"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={10} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold">{option.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{option.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test & Instant Actions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              即時測試與快速抽考
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSendingTest}
                onClick={handleSendTestNotification}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
              >
                <Send size={14} className={isSendingTest ? "animate-pulse text-indigo-600" : "text-indigo-600"} />
                {isSendingTest ? "已發送推播..." : "發送測試通知 (2秒後)"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchInstantQuiz();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Zap size={14} />
                立即開啟隨堂抽考
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              💡 提示：點選「發送測試通知」後可跳回手機桌面或鎖定螢幕，體驗原生推播點擊作答流程。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" />
            完全本機排程，無資料上傳
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
}
