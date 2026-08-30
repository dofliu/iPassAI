import { describe, expect, it, beforeEach } from "vitest";
import {
  getNotificationConfig,
  saveNotificationConfig,
  selectQuizQuestion,
  DEFAULT_NOTIFICATION_CONFIG,
  type NotificationConfig,
} from "./src/services/notificationService";
import { QUESTIONS } from "./questions";
import { ENGLISH_B2_SUBJECT } from "./englishQuestions";

// Setup lightweight window.localStorage mock for Node test environment
const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
  },
};

(globalThis as unknown as { window: unknown }).window = {
  localStorage: localStorageMock,
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
};

describe("Notification Service & Pop Quiz Logic", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("loads default notification config when nothing stored", () => {
    const config = getNotificationConfig();
    expect(config.enabled).toBe(false);
    expect(config.frequency).toBe("2h");
    expect(config.scope).toBe("mistakes_first");
  });

  it("persists and reads custom notification config", () => {
    const custom: NotificationConfig = {
      enabled: true,
      frequency: "1h",
      scope: "ipas_basic",
      dailyTimes: ["10:00", "15:00"],
      sound: false,
      vibrate: true,
    };
    saveNotificationConfig(custom);
    const loaded = getNotificationConfig();
    expect(loaded.enabled).toBe(true);
    expect(loaded.frequency).toBe("1h");
    expect(loaded.scope).toBe("ipas_basic");
  });

  it("selects question matching the designated scope", () => {
    const basicQ = selectQuizQuestion("ipas_basic");
    expect(basicQ.level).toBe("初級");

    const interQ = selectQuizQuestion("ipas_intermediate");
    expect(interQ.level).toBe("中級");

    const engQ = selectQuizQuestion("english");
    expect(engQ.subject).toBe(ENGLISH_B2_SUBJECT);

    const allQ = selectQuizQuestion("all");
    expect(QUESTIONS.some((q) => q.id === allQ.id)).toBe(true);
  });

  it("falls back gracefully when mistakes_first has no wrong attempts", () => {
    const q = selectQuizQuestion("mistakes_first");
    expect(q).toBeDefined();
    expect(QUESTIONS.some((item) => item.id === q.id)).toBe(true);
  });

  it("selects from wrong attempts when mistakes exist", () => {
    const wrongQuestion = QUESTIONS[0];
    localStorageMock.setItem(
      "ipas-study-attempts-v1",
      JSON.stringify([
        { questionId: wrongQuestion.id, correct: false, selectedAnswer: 1, date: new Date().toISOString(), mode: "練習" },
      ])
    );
    const selected = selectQuizQuestion("mistakes_first");
    expect(selected.id).toBe(wrongQuestion.id);
  });
});
