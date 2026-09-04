/**
 * 隨堂抽考推播服務 (Notification Service)
 * 支援 Capacitor 原生本機推播 (@capacitor/local-notifications) 與 Web Notification 降級
 * 遵循離線優先與隱私保護原則
 */
import { Capacitor } from "@capacitor/core";
import { LocalNotifications, type Channel, type LocalNotificationSchema } from "@capacitor/local-notifications";
import { QUESTIONS, type Question } from "@/data/questions";
import { ENGLISH_B2_SUBJECT } from "@/data/englishQuestions";
import { CLAUDE_CERT_SUBJECT } from "@/data/claudeCertQuestions";

export type NotificationFrequency = "1h" | "2h" | "4h" | "daily_3";
export type NotificationScope = "all" | "ipas_basic" | "ipas_intermediate" | "english" | "claude_cert" | "mistakes_first";

export interface NotificationConfig {
  enabled: boolean;
  frequency: NotificationFrequency;
  scope: NotificationScope;
  dailyTimes: string[]; // e.g. ["09:00", "14:00", "20:00"]
  sound: boolean;
  vibrate: boolean;
}

const CONFIG_KEY = "ipas-quiz-notification-config-v1";
const ATTEMPTS_KEY = "ipas-study-attempts-v1";
const CHANNEL_ID = "pop-quiz-channel";

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: false,
  frequency: "2h",
  scope: "mistakes_first",
  dailyTimes: ["09:00", "14:00", "20:00"],
  sound: true,
  vibrate: true,
};

/**
 * 讀取本機推播設定
 */
export function getNotificationConfig(): NotificationConfig {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_CONFIG;
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_CONFIG;
    return { ...DEFAULT_NOTIFICATION_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_CONFIG;
  }
}

/**
 * 保存本機推播設定
 */
export function saveNotificationConfig(config: NotificationConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

/**
 * 檢查目前推播通知權限
 */
export async function checkNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      return status.display === "granted";
    } catch (e) {
      console.warn("檢查原生推播權限失敗:", e);
      return false;
    }
  }

  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.permission === "granted";
  }

  return false;
}

/**
 * 請求推播通知權限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === "granted";
    } catch (e) {
      console.warn("請求原生推播權限失敗:", e);
      return false;
    }
  }

  if (typeof window !== "undefined" && "Notification" in window) {
    try {
      const result = await Notification.requestPermission();
      return result === "granted";
    } catch (e) {
      console.warn("請求 Web 通知權限失敗:", e);
      return false;
    }
  }

  return false;
}

/**
 * 依偏好範圍篩選並隨機選出一題抽考題目
 */
export function selectQuizQuestion(scope: NotificationScope = "all"): Question {
  let pool: Question[] = [];

  if (scope === "mistakes_first") {
    try {
      const attemptsRaw = window.localStorage.getItem(ATTEMPTS_KEY);
      if (attemptsRaw) {
        const attempts = JSON.parse(attemptsRaw) as Array<{ questionId: string; correct: boolean }>;
        const wrongIds = new Set(attempts.filter((a) => !a.correct).map((a) => a.questionId));
        pool = QUESTIONS.filter((q) => wrongIds.has(q.id));
      }
    } catch {
      pool = [];
    }
  }

  if (pool.length === 0) {
    switch (scope) {
      case "ipas_basic":
        pool = QUESTIONS.filter((q) => q.level === "初級");
        break;
      case "ipas_intermediate":
        pool = QUESTIONS.filter((q) => q.level === "中級");
        break;
      case "english":
        pool = QUESTIONS.filter((q) => q.subject === ENGLISH_B2_SUBJECT);
        break;
      case "claude_cert":
        pool = QUESTIONS.filter((q) => q.subject === CLAUDE_CERT_SUBJECT);
        break;
      case "all":
      default:
        pool = QUESTIONS;
        break;
    }
  }

  if (pool.length === 0) pool = QUESTIONS;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * 初始化 Android 通知頻道
 */
async function ensureNotificationChannel(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const channel: Channel = {
      id: CHANNEL_ID,
      name: "隨堂抽考快問快答",
      description: "定時接收 iPassAI 隨機題目與弱點抽考推播",
      importance: 4,
      visibility: 1,
      vibration: true,
    };
    await LocalNotifications.createChannel(channel);
  } catch (e) {
    console.warn("建立通知頻道失敗:", e);
  }
}

/**
 * 格式化通知內文
 */
function createNotificationPayload(question: Question, id: number, scheduleAt?: Date): LocalNotificationSchema {
  const cleanStem = question.stem.replace(/[\r\n]+/g, " ").trim();
  const summaryStem = cleanStem.length > 70 ? `${cleanStem.slice(0, 67)}...` : cleanStem;
  const title = `⚡ 隨堂抽考 [${question.subject}]`;
  const body = `【${question.difficulty}｜${question.topic}】${summaryStem}\n👉 點擊立即作答！`;

  return {
    id,
    title,
    body,
    channelId: CHANNEL_ID,
    schedule: scheduleAt ? { at: scheduleAt, allowWhileIdle: true } : undefined,
    extra: {
      questionId: question.id,
      timestamp: Date.now(),
    },
    actionTypeId: "POP_QUIZ_ACTION",
  };
}

/**
 * 取消所有已排程的抽考通知
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
    } catch (e) {
      console.warn("取消推播失敗:", e);
    }
  }
}

/**
 * 依目前設定重新排程抽考推播
 */
export async function scheduleQuizNotifications(): Promise<boolean> {
  const config = getNotificationConfig();
  if (!config.enabled) {
    await cancelAllScheduledNotifications();
    return true;
  }

  const hasPermission = await checkNotificationPermission();
  if (!hasPermission) {
    const granted = await requestNotificationPermission();
    if (!granted) return false;
  }

  await ensureNotificationChannel();
  await cancelAllScheduledNotifications();

  if (!Capacitor.isNativePlatform()) {
    // 網頁環境下僅記錄設定，由 App 內定時器或手動觸發
    return true;
  }

  const notifications: LocalNotificationSchema[] = [];
  const now = Date.now();

  if (config.frequency === "daily_3") {
    // 每天排程 3 個固定時段（例如 09:00, 14:00, 20:00）未來 3 天共 9 則推播
    let notifId = 100;
    const times = config.dailyTimes.length > 0 ? config.dailyTimes : ["09:00", "14:00", "20:00"];

    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      for (const timeStr of times) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + dayOffset);
        targetDate.setHours(hours, minutes, 0, 0);

        if (targetDate.getTime() > now + 30 * 1000) {
          const question = selectQuizQuestion(config.scope);
          notifications.push(createNotificationPayload(question, notifId++, targetDate));
        }
      }
    }
  } else {
    // 間隔式排程：每 1h / 2h / 4h，預先排定未來 8 則推播
    const intervalMinutes = config.frequency === "1h" ? 60 : config.frequency === "2h" ? 120 : 240;
    const intervalMs = intervalMinutes * 60 * 1000;

    for (let i = 1; i <= 8; i++) {
      const targetDate = new Date(now + i * intervalMs);
      const question = selectQuizQuestion(config.scope);
      notifications.push(createNotificationPayload(question, 200 + i, targetDate));
    }
  }

  if (notifications.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications });
      return true;
    } catch (e) {
      console.error("排程推播失敗:", e);
      return false;
    }
  }

  return true;
}

/**
 * 觸發即時測試推播（2 秒後發出通知，方便實機立即驗證）
 */
export async function sendInstantTestNotification(scope?: NotificationScope): Promise<Question | null> {
  const currentScope = scope ?? getNotificationConfig().scope;
  const question = selectQuizQuestion(currentScope);
  const cleanStem = question.stem.replace(/[\r\n]+/g, " ").trim();
  const summaryStem = cleanStem.length > 70 ? `${cleanStem.slice(0, 67)}...` : cleanStem;
  const title = `⚡ 隨堂抽考 [${question.subject}]`;
  const body = `【${question.difficulty}｜${question.topic}】${summaryStem}\n👉 點擊立即作答！`;

  if (Capacitor.isNativePlatform()) {
    try {
      await ensureNotificationChannel();
      const testSchedule = new Date(Date.now() + 2000); // 2 秒後觸發
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 9999,
            title,
            body,
            channelId: CHANNEL_ID,
            schedule: { at: testSchedule, allowWhileIdle: true },
            extra: {
              questionId: question.id,
              timestamp: Date.now(),
            },
          },
        ],
      });
      return question;
    } catch (e) {
      console.warn("原生測試通知發送失敗:", e);
    }
  }

  // 網頁環境或原生失敗時的 Fallback
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      setTimeout(() => {
        const notif = new Notification(title, {
          body,
          icon: "/favicon.ico",
        });
        notif.onclick = () => {
          window.focus();
          dispatchOpenQuizEvent(question.id);
        };
      }, 1500);
      return question;
    } catch (e) {
      console.warn("Web Notification 發送失敗:", e);
    }
  }

  return question;
}

/**
 * 廣播開啟抽考自訂事件
 */
export function dispatchOpenQuizEvent(questionId?: string): void {
  if (typeof window === "undefined") return;
  const event = new CustomEvent("ipass-open-quiz", { detail: { questionId } });
  window.dispatchEvent(event);
}

/**
 * 監聽通知點擊與抽考事件
 */
export function setupNotificationListeners(onOpenQuiz: (questionId: string) => void): () => void {
  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<{ questionId?: string }>;
    const qId = customEvent.detail?.questionId || selectQuizQuestion().id;
    onOpenQuiz(qId);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("ipass-open-quiz", handleCustomEvent);
  }

  let removeNativeListener: (() => void) | null = null;

  if (Capacitor.isNativePlatform()) {
    LocalNotifications.addListener("localNotificationActionPerformed", (notification) => {
      const questionId = notification.notification?.extra?.questionId as string | undefined;
      const targetId = questionId || selectQuizQuestion().id;
      onOpenQuiz(targetId);
    }).then((handle) => {
      removeNativeListener = () => handle.remove();
    }).catch((e) => console.warn("註冊推播點擊監聽失敗:", e));
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("ipass-open-quiz", handleCustomEvent);
    }
    if (removeNativeListener) {
      removeNativeListener();
    }
  };
}
