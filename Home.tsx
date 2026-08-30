/**
 * 靛藍題庫工坊主頁：左側學習軌道、紙本題目閱讀板與螢光標記線。
 * 所有練習紀錄僅儲存在目前瀏覽器的 localStorage，不會上傳。
 */
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, BookOpenText, CheckCircle2, ChevronRight,
  CircleHelp, Clock3, ExternalLink, Flag, GraduationCap, Headphones, Layers3, Play,
  RotateCcw, Sparkles, Volume2, XCircle, Bookmark, CalendarDays, FileText, Search, Tag,
  CalendarClock, Download, Flame, Target, Upload, ShieldCheck, Bell, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFICIAL_RESOURCE_URL, QUESTIONS, SUBJECTS, type Level, type Question } from "@/data/questions";
import { ENGLISH_B2_SUBJECT } from "@/data/englishQuestions";
import { CAMBRIDGE_B2_FIRST } from "@/data/cambridgeB2FirstQuestions";
import PopQuizModal from "@/components/PopQuizModal";
import NotificationSettingsModal from "@/components/NotificationSettingsModal";
import {
  setupNotificationListeners,
  scheduleQuizNotifications,
  getNotificationConfig,
  selectQuizQuestion,
} from "@/services/notificationService";

type View = "dashboard" | "practice" | "exam" | "review" | "library";
type ExamMode = "normal" | "mistakes";
type EnglishMode = "通用 CEFR B2" | "Cambridge B2 First";
type CambridgeComponent = "全部元件" | "Reading & Use of English" | "Listening";
type LibraryExamFilter = "全部模式" | EnglishMode;
type Attempt = { questionId: string; correct: boolean; selectedAnswer?: number; date: string; mode: "練習" | "測驗" };
type BackupPayload = { version: 1; exportedAt: string; bookmarks: string[]; notes: Record<string, string> };

const LOGO_URL = "/manus-storage/ipas-logo-mark_67d604fe.png";
const HERO_URL = "/manus-storage/ipas-hero-study-desk_6d68be79.png";
const REVIEW_URL = "/manus-storage/ipas-progress-review_fd4c9aca.png";
const CARDS_URL = "/manus-storage/ipas-syllabus-index-cards_7bed8531.png";
const ATTEMPTS_KEY = "ipas-study-attempts-v1";
const BOOKMARKS_KEY = "ipas-study-bookmarks-v1";
const NOTES_KEY = "ipas-study-notes-v1";
const GOAL_DATE_KEY = "ipas-study-goal-date-v1";
const CHOICES = ["A", "B", "C", "D"];

const NAV_ITEMS: { id: View; label: string; Icon: typeof BookOpen }[] = [
  { id: "dashboard", label: "學習首頁", Icon: Layers3 },
  { id: "practice", label: "即時練習", Icon: CircleHelp },
  { id: "exam", label: "模擬測驗", Icon: GraduationCap },
  { id: "review", label: "錯題複盤", Icon: BarChart3 },
  { id: "library", label: "收藏與筆記", Icon: Bookmark },
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function timeText(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function dateText(value: string) {
  return new Intl.DateTimeFormat("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function dateInputValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const date = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function localDateKey(value: string | Date) {
  return dateInputValue(typeof value === "string" ? new Date(value) : value);
}

function defaultGoalDate() {
  const date = new Date();
  date.setDate(date.getDate() + 90);
  return dateInputValue(date);
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [level, setLevel] = useState<Level>("初級");
  const [subject, setSubject] = useState(SUBJECTS.初級[0]);
  const [topic, setTopic] = useState("全部主題");
  const [englishMode, setEnglishMode] = useState<EnglishMode>("通用 CEFR B2");
  const [cambridgeComponent, setCambridgeComponent] = useState<CambridgeComponent>("全部元件");
  const [cambridgePart, setCambridgePart] = useState("全部 Part");
  const [count, setCount] = useState(10);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryLevel, setLibraryLevel] = useState<"全部" | Level>("全部");
  const [librarySubject, setLibrarySubject] = useState("全部");
  const [libraryTopic, setLibraryTopic] = useState("全部");
  const [libraryDifficulty, setLibraryDifficulty] = useState<"全部" | Question["difficulty"]>("全部");
  const [libraryExamFamily, setLibraryExamFamily] = useState<LibraryExamFilter>("全部模式");
  const [libraryPart, setLibraryPart] = useState("全部 Part");
  const [libraryBookmarksOnly, setLibraryBookmarksOnly] = useState(false);
  const [goalDate, setGoalDate] = useState(defaultGoalDate);
  const [pendingBackup, setPendingBackup] = useState<BackupPayload | null>(null);
  const [backupMessage, setBackupMessage] = useState("");
  const backupInputRef = useRef<HTMLInputElement>(null);

  const [practiceSet, setPracticeSet] = useState<Question[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceFinished, setPracticeFinished] = useState(false);

  const [examSet, setExamSet] = useState<Question[]>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [examSeconds, setExamSeconds] = useState(20 * 60);
  const [examFinished, setExamFinished] = useState(false);
  const [examMode, setExamMode] = useState<ExamMode>("normal");

  const [isPopQuizOpen, setIsPopQuizOpen] = useState(false);
  const [popQuizQuestionId, setPopQuizQuestionId] = useState<string | null>(null);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [notifConfig, setNotifConfig] = useState(getNotificationConfig);

  useEffect(() => {
    const saved = window.localStorage.getItem(ATTEMPTS_KEY);
    if (!saved) return;
    try { setAttempts(JSON.parse(saved)); } catch { window.localStorage.removeItem(ATTEMPTS_KEY); }
  }, []);

  useEffect(() => {
    try { setBookmarks(JSON.parse(window.localStorage.getItem(BOOKMARKS_KEY) ?? "[]")); } catch { window.localStorage.removeItem(BOOKMARKS_KEY); }
    try { setNotes(JSON.parse(window.localStorage.getItem(NOTES_KEY) ?? "{}")); } catch { window.localStorage.removeItem(NOTES_KEY); }
    const storedGoalDate = window.localStorage.getItem(GOAL_DATE_KEY);
    if (storedGoalDate && /^\d{4}-\d{2}-\d{2}$/.test(storedGoalDate)) setGoalDate(storedGoalDate);
  }, []);

  useEffect(() => {
    if (notifConfig.enabled) {
      scheduleQuizNotifications();
    }
    const cleanup = setupNotificationListeners((targetQuestionId) => {
      setPopQuizQuestionId(targetQuestionId);
      setIsPopQuizOpen(true);
    });
    return cleanup;
  }, [notifConfig.enabled]);

  useEffect(() => {
    if (!examSet.length || examFinished || view !== "exam") return;
    const tick = window.setInterval(() => setExamSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(tick);
  }, [examSet.length, examFinished, view]);

  useEffect(() => {
    if (examSeconds === 0 && examSet.length && !examFinished) finishExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examSeconds]);

  const filtered = useMemo(() => QUESTIONS.filter((q) => {
    const isCambridgeSubject = subject === ENGLISH_B2_SUBJECT;
    const matchesMode = !isCambridgeSubject || (englishMode === CAMBRIDGE_B2_FIRST ? q.examFamily === CAMBRIDGE_B2_FIRST : !q.examFamily);
    const matchesComponent = !isCambridgeSubject || englishMode !== CAMBRIDGE_B2_FIRST || cambridgeComponent === "全部元件" || q.component === cambridgeComponent;
    const matchesPart = !isCambridgeSubject || englishMode !== CAMBRIDGE_B2_FIRST || cambridgePart === "全部 Part" || q.part === cambridgePart;
    return q.level === level && q.subject === subject && matchesMode && matchesComponent && matchesPart && (topic === "全部主題" || q.topic === topic);
  }), [cambridgeComponent, cambridgePart, englishMode, level, subject, topic]);
  const topics = useMemo(() => ["全部主題", ...Array.from(new Set(filtered.map((q) => q.topic)))], [filtered]);
  const cambridgeParts = useMemo(() => {
    const parts = QUESTIONS.filter((q) => q.examFamily === CAMBRIDGE_B2_FIRST && (!q.component || cambridgeComponent === "全部元件" || q.component === cambridgeComponent)).map((q) => q.part).filter((part): part is string => Boolean(part));
    return ["全部 Part", ...Array.from(new Set(parts))];
  }, [cambridgeComponent]);
  const accuracy = attempts.length ? Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100) : 0;
  const currentQuestion = practiceSet[practiceIndex];
  const currentExamQuestion = examSet[examIndex];
  const allLibraryTopics = useMemo(() => Array.from(new Set(QUESTIONS.map((question) => question.topic))), []);
  const allCambridgeParts = useMemo(() => {
    const parts = QUESTIONS.filter((question) => question.examFamily === CAMBRIDGE_B2_FIRST).map((question) => question.part).filter((part): part is string => Boolean(part));
    return ["全部 Part", ...Array.from(new Set(parts))];
  }, []);
  const librarySubjects = useMemo(() => libraryLevel === "全部" ? [...SUBJECTS.初級, ...SUBJECTS.中級] : SUBJECTS[libraryLevel], [libraryLevel]);
  const bookmarkQuestions = useMemo(() => QUESTIONS.filter((question) => bookmarks.includes(question.id)), [bookmarks]);
  const todayKey = localDateKey(new Date());
  const todayCompleted = useMemo(() => new Set(attempts.filter((attempt) => localDateKey(attempt.date) === todayKey).map((attempt) => attempt.questionId)).size, [attempts, todayKey]);
  const studyStreak = useMemo(() => {
    const studyDays = new Set(attempts.map((attempt) => localDateKey(attempt.date)));
    const cursor = new Date();
    if (!studyDays.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (studyDays.has(localDateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    return streak;
  }, [attempts]);
  const countdownPlan = useMemo(() => {
    const target = new Date(`${goalDate}T00:00:00`);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((target.getTime() - now.getTime()) / 86400000);
    const plannedWorkload = Math.max(160, Math.ceil(QUESTIONS.length * 1.2) - attempts.length);
    const dailyTarget = daysLeft > 0 ? Math.max(5, Math.min(40, Math.ceil(plannedWorkload / daysLeft))) : 20;
    const status = daysLeft > 0 ? `距目標考期 ${daysLeft} 天` : daysLeft === 0 ? "目標考期就是今天" : "目標考期已過";
    return { daysLeft, dailyTarget, weeklyTarget: dailyTarget * 6, status };
  }, [attempts.length, goalDate]);
  const dailyCompletion = Math.min(100, Math.round((todayCompleted / countdownPlan.dailyTarget) * 100));
  const libraryResults = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase();
    return QUESTIONS.filter((question) => {
      const text = `${question.stem} ${question.options.join(" ")} ${question.subject} ${question.topic} ${question.difficulty} ${question.component ?? ""} ${question.part ?? ""}`.toLowerCase();
      const matchesExam = libraryExamFamily === "全部模式" || (libraryExamFamily === CAMBRIDGE_B2_FIRST ? question.examFamily === CAMBRIDGE_B2_FIRST : !question.examFamily);
      const matchesPart = libraryPart === "全部 Part" || question.part === libraryPart;
      return (!query || text.includes(query)) && (libraryLevel === "全部" || question.level === libraryLevel) && (librarySubject === "全部" || question.subject === librarySubject) && (libraryTopic === "全部" || question.topic === libraryTopic) && (libraryDifficulty === "全部" || question.difficulty === libraryDifficulty) && matchesExam && matchesPart && (!libraryBookmarksOnly || bookmarks.includes(question.id));
    });
  }, [bookmarks, libraryBookmarksOnly, libraryDifficulty, libraryExamFamily, libraryLevel, libraryPart, libraryQuery, librarySubject, libraryTopic]);

  const persistAttempts = (newAttempts: Attempt[]) => {
    setAttempts((previous) => {
      const combined = [...previous, ...newAttempts];
      window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(combined));
      return combined;
    });
  };

  const changeLevel = (nextLevel: Level) => {
    setLevel(nextLevel);
    setSubject(SUBJECTS[nextLevel][0]);
    setEnglishMode("通用 CEFR B2");
    setCambridgeComponent("全部元件");
    setCambridgePart("全部 Part");
    setTopic("全部主題");
  };

  const changeSubject = (nextSubject: string) => {
    setSubject(nextSubject);
    setEnglishMode(nextSubject === ENGLISH_B2_SUBJECT ? englishMode : "通用 CEFR B2");
    setCambridgeComponent("全部元件");
    setCambridgePart("全部 Part");
    setTopic("全部主題");
  };

  const changeEnglishMode = (nextMode: EnglishMode) => {
    setEnglishMode(nextMode);
    setCambridgeComponent("全部元件");
    setCambridgePart("全部 Part");
    setTopic("全部主題");
  };

  const changeCambridgeComponent = (nextComponent: CambridgeComponent) => {
    setCambridgeComponent(nextComponent);
    setCambridgePart("全部 Part");
    setTopic("全部主題");
  };

  const makeSet = (requestedCount: number) => shuffle(filtered).slice(0, Math.min(requestedCount, filtered.length));

  const startPractice = (requestedCount = count) => {
    const next = makeSet(requestedCount);
    setPracticeSet(next); setPracticeIndex(0); setPracticeAnswer(null); setPracticeSubmitted(false); setPracticeFinished(false); setView("practice");
  };

  const submitPractice = () => {
    if (practiceAnswer === null || practiceSubmitted || !currentQuestion) return;
    setPracticeSubmitted(true);
    persistAttempts([{ questionId: currentQuestion.id, selectedAnswer: practiceAnswer, correct: practiceAnswer === currentQuestion.answer, date: new Date().toISOString(), mode: "練習" }]);
  };

  const nextPractice = () => {
    if (practiceIndex >= practiceSet.length - 1) { setPracticeFinished(true); return; }
    setPracticeIndex((index) => index + 1); setPracticeAnswer(null); setPracticeSubmitted(false);
  };

  const startExam = () => {
    const next = makeSet(count);
    setExamSet(next); setExamIndex(0); setExamAnswers({}); setExamSeconds(Math.max(10, next.length) * 60); setExamFinished(false); setExamMode("normal"); setView("exam");
  };

  function finishExam() {
    if (!examSet.length || examFinished) return;
    const now = new Date().toISOString();
    persistAttempts(examSet.map((question) => ({ questionId: question.id, selectedAnswer: examAnswers[question.id], correct: examAnswers[question.id] === question.answer, date: now, mode: "測驗" })));
    setExamFinished(true);
  }

  const resetProgress = () => {
    window.localStorage.removeItem(ATTEMPTS_KEY);
    setAttempts([]);
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarks((previous) => {
      const next = previous.includes(questionId) ? previous.filter((id) => id !== questionId) : [...previous, questionId];
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateNote = (questionId: string, value: string) => {
    setNotes((previous) => {
      const next = { ...previous };
      if (value.trim()) next[questionId] = value;
      else delete next[questionId];
      window.localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateGoalDate = (value: string) => {
    setGoalDate(value);
    window.localStorage.setItem(GOAL_DATE_KEY, value);
  };

  const exportPersonalData = () => {
    const payload: BackupPayload = { version: 1, exportedAt: new Date().toISOString(), bookmarks, notes };
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `題策-收藏與筆記-${dateInputValue(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    setBackupMessage(`已匯出 ${bookmarks.length} 題收藏與 ${Object.keys(notes).length} 則筆記。`);
  };

  const inspectBackupFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 1024 * 1024) { setBackupMessage("備份檔超過 1 MB，請確認選擇的是題策匯出的 JSON 檔。 "); return; }
    try {
      const source: unknown = JSON.parse(await file.text());
      if (!source || typeof source !== "object" || Array.isArray(source)) throw new Error("format");
      const record = source as Record<string, unknown>;
      if (!Array.isArray(record.bookmarks) || !record.notes || typeof record.notes !== "object" || Array.isArray(record.notes)) throw new Error("format");
      const validIds = new Set(QUESTIONS.map((question) => question.id));
      const importedBookmarks = Array.from(new Set(record.bookmarks.filter((id): id is string => typeof id === "string" && validIds.has(id))));
      const importedNotes: Record<string, string> = {};
      Object.entries(record.notes as Record<string, unknown>).forEach(([id, value]) => {
        if (validIds.has(id) && typeof value === "string" && value.trim()) importedNotes[id] = value;
      });
      setPendingBackup({ version: 1, exportedAt: typeof record.exportedAt === "string" ? record.exportedAt : "", bookmarks: importedBookmarks, notes: importedNotes });
      setBackupMessage(`已讀取備份：${importedBookmarks.length} 題收藏、${Object.keys(importedNotes).length} 則筆記。請選擇復原方式。`);
    } catch {
      setPendingBackup(null);
      setBackupMessage("無法辨識此檔案；請選擇由題策匯出的 JSON 備份檔。 ");
    }
  };

  const restoreBackup = (mode: "merge" | "overwrite") => {
    if (!pendingBackup) return;
    setBookmarks((previous) => {
      const next = mode === "overwrite" ? pendingBackup.bookmarks : Array.from(new Set([...previous, ...pendingBackup.bookmarks]));
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      return next;
    });
    setNotes((previous) => {
      const next = mode === "overwrite" ? pendingBackup.notes : { ...pendingBackup.notes, ...previous };
      window.localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      return next;
    });
    setBackupMessage(mode === "overwrite" ? "已以備份完整還原收藏與筆記。" : "已安全合併備份；本機同題筆記已優先保留。");
    setPendingBackup(null);
  };

  const mistakes = useMemo(() => {
    const mistakenIds = new Set(attempts.filter((attempt) => !attempt.correct).map((attempt) => attempt.questionId));
    return QUESTIONS.filter((question) => mistakenIds.has(question.id));
  }, [attempts]);
  const weakTopics = useMemo(() => {
    const stats = new Map<string, { level: Level; subject: string; topic: string; total: number; wrong: number }>();
    attempts.forEach((attempt) => {
      const question = QUESTIONS.find((item) => item.id === attempt.questionId);
      if (!question) return;
      const key = `${question.level}::${question.subject}::${question.topic}`;
      const previous = stats.get(key) ?? { level: question.level, subject: question.subject, topic: question.topic, total: 0, wrong: 0 };
      previous.total += 1;
      if (!attempt.correct) previous.wrong += 1;
      stats.set(key, previous);
    });
    return Array.from(stats.values())
      .filter((item) => item.wrong > 0)
      .map((item) => ({ ...item, wrongRate: Math.round((item.wrong / item.total) * 100) }))
      .sort((a, b) => b.wrongRate - a.wrongRate || b.wrong - a.wrong || b.total - a.total)
      .slice(0, 3);
  }, [attempts]);
  const startTopicPractice = (next: { level: Level; subject: string; topic: string }) => {
    const set = shuffle(QUESTIONS.filter((item) => item.level === next.level && item.subject === next.subject && item.topic === next.topic)).slice(0, count);
    const first = set[0];
    setLevel(next.level); setSubject(next.subject); setTopic(next.topic); setEnglishMode(first?.examFamily === CAMBRIDGE_B2_FIRST ? CAMBRIDGE_B2_FIRST : "通用 CEFR B2"); setCambridgeComponent(first?.component ?? "全部元件"); setCambridgePart(first?.part ?? "全部 Part"); setPracticeSet(set); setPracticeIndex(0); setPracticeAnswer(null); setPracticeSubmitted(false); setPracticeFinished(false); setView("practice");
  };
  const startMistakeExam = () => {
    const next = shuffle(mistakes).slice(0, Math.min(Math.max(count, 5), mistakes.length));
    if (!next.length) return;
    setExamSet(next); setExamIndex(0); setExamAnswers({}); setExamSeconds(Math.max(10, next.length) * 60); setExamFinished(false); setExamMode("mistakes"); setView("exam");
  };
  const dailyPlan = useMemo(() => {
    const now = Date.now();
    const fortnight = 14 * 24 * 60 * 60 * 1000;
    const recent = attempts.filter((attempt) => now - new Date(attempt.date).getTime() <= fortnight);
    if (!recent.length) return [] as { question: Question; reason: string; priority: number }[];
    const questionStats = new Map<string, { total: number; wrong: number; latest: number }>();
    const topicStats = new Map<string, { total: number; wrong: number }>();
    recent.forEach((attempt) => {
      const question = QUESTIONS.find((item) => item.id === attempt.questionId);
      if (!question) return;
      const stat = questionStats.get(question.id) ?? { total: 0, wrong: 0, latest: 0 };
      stat.total += 1; if (!attempt.correct) stat.wrong += 1; stat.latest = Math.max(stat.latest, new Date(attempt.date).getTime()); questionStats.set(question.id, stat);
      const topicKey = `${question.subject}::${question.topic}`;
      const topicStat = topicStats.get(topicKey) ?? { total: 0, wrong: 0 };
      topicStat.total += 1; if (!attempt.correct) topicStat.wrong += 1; topicStats.set(topicKey, topicStat);
    });
    return QUESTIONS.map((question) => {
      const stat = questionStats.get(question.id);
      const topicStat = topicStats.get(`${question.subject}::${question.topic}`);
      const difficultyWeight = question.difficulty === "進階" ? 55 : question.difficulty === "情境" ? 35 : 15;
      const recencyWeight = stat ? Math.max(0, 90 - Math.floor((now - stat.latest) / 86400000) * 6) : 0;
      const wrongWeight = stat?.wrong ? 900 + Math.round((stat.wrong / stat.total) * 160) : 0;
      const topicWeight = topicStat?.wrong ? 260 + Math.round((topicStat.wrong / topicStat.total) * 120) : 0;
      const priority = wrongWeight + topicWeight + recencyWeight + difficultyWeight;
      const reason = stat?.wrong ? `近期答錯 ${stat.wrong}/${stat.total}` : topicStat?.wrong ? "延伸複習弱點主題" : question.difficulty === "進階" ? "以進階題鞏固觀念" : "近期概念回看";
      return { question, reason, priority };
    }).filter((item) => item.priority > 0).sort((a, b) => b.priority - a.priority || a.question.id.localeCompare(b.question.id)).slice(0, countdownPlan.dailyTarget);
  }, [attempts, countdownPlan.dailyTarget]);
  const startDailyPlan = () => {
    if (!dailyPlan.length) return;
    const next = dailyPlan.map((item) => item.question);
    setPracticeSet(next); setPracticeIndex(0); setPracticeAnswer(null); setPracticeSubmitted(false); setPracticeFinished(false); setView("practice");
  };
  const startBookmarkPractice = () => {
    if (!bookmarkQuestions.length) return;
    const next = shuffle(bookmarkQuestions).slice(0, Math.min(count, bookmarkQuestions.length));
    setPracticeSet(next); setPracticeIndex(0); setPracticeAnswer(null); setPracticeSubmitted(false); setPracticeFinished(false); setView("practice");
  };
  const openLibraryQuestion = (question: Question) => {
    setLevel(question.level); setSubject(question.subject); setTopic(question.topic); setEnglishMode(question.examFamily === CAMBRIDGE_B2_FIRST ? CAMBRIDGE_B2_FIRST : "通用 CEFR B2"); setCambridgeComponent(question.component ?? "全部元件"); setCambridgePart(question.part ?? "全部 Part"); setPracticeSet([question]); setPracticeIndex(0); setPracticeAnswer(null); setPracticeSubmitted(false); setPracticeFinished(false); setView("practice");
  };
  const subjectAccuracy = useMemo(() => SUBJECTS.中級.concat(SUBJECTS.初級).map((name) => {
    const ids = new Set(QUESTIONS.filter((q) => q.subject === name).map((q) => q.id));
    const scoped = attempts.filter((attempt) => ids.has(attempt.questionId));
    return { name, total: scoped.length, score: scoped.length ? Math.round((scoped.filter((item) => item.correct).length / scoped.length) * 100) : 0 };
  }).filter((item) => item.total > 0).slice(0, 4), [attempts]);

  const renderSidebarFilters = (action: "practice" | "exam") => (
    <aside className="task-sidebar">
      <div className="eyebrow">題目篩選器</div>
      <h2>{action === "practice" ? "這次想練哪裡？" : "設定這回測驗"}</h2>
      <p>{action === "practice" ? "抽題條件會顯示在題目上方。做錯後立即看見原因。" : "題目來自目前條件的原創題庫；每題預設 1 分鐘，時間可作為自我節奏提示。"}</p>
      <div className="filter-stack">
        <label><span className="field-label">級別</span><select className="select-field" value={level} onChange={(event) => changeLevel(event.target.value as Level)}><option>初級</option><option>中級</option></select></label>
        <label><span className="field-label">科目</span><select className="select-field" value={subject} onChange={(event) => changeSubject(event.target.value)}>{SUBJECTS[level].map((item) => <option key={item}>{item}</option>)}</select></label>
        {subject === ENGLISH_B2_SUBJECT && <>
          <label><span className="field-label">英文模式</span><select className="select-field" value={englishMode} onChange={(event) => changeEnglishMode(event.target.value as EnglishMode)}><option>通用 CEFR B2</option><option>Cambridge B2 First</option></select></label>
          {englishMode === CAMBRIDGE_B2_FIRST && <>
            <label><span className="field-label">測驗元件</span><select className="select-field" value={cambridgeComponent} onChange={(event) => changeCambridgeComponent(event.target.value as CambridgeComponent)}><option>全部元件</option><option>Reading &amp; Use of English</option><option>Listening</option></select></label>
            <label><span className="field-label">Part</span><select className="select-field" value={cambridgePart} onChange={(event) => { setCambridgePart(event.target.value); setTopic("全部主題"); }}>{cambridgeParts.map((item) => <option key={item}>{item}</option>)}</select></label>
          </>}
        </>}
        <label><span className="field-label">主題</span><select className="select-field" value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="filter-divider" />
        <div><span className="field-label">題數</span><div className="count-set">{[5, 10, 20].map((item) => <button key={item} className={`count-button ${count === item ? "active" : ""}`} onClick={() => setCount(item)}>{item}</button>)}</div></div>
        <Button className="solid-button" onClick={() => action === "practice" ? startPractice() : startExam()}>{action === "practice" ? <><Sparkles />重新抽題</> : <><Play />開始計時測驗</>}</Button>
      </div>
      <div className="source-note">可用題數：<strong>{filtered.length}</strong> 題。{englishMode === CAMBRIDGE_B2_FIRST ? "Reading & Use of English Part 1–7、Listening Part 1–4；Listening 以本站原創語音稿播放。" : "所有互動題均為依官方範圍自編。"} <a href={OFFICIAL_RESOURCE_URL} target="_blank" rel="noreferrer">官方歷屆公告試題 <ExternalLink size={11} /></a></div>
    </aside>
  );

  const speakListening = (question: Question, rate = 0.88) => {
    if (!question.audioScript || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(question.audioScript);
    speech.lang = "en-GB";
    speech.rate = rate;
    window.speechSynthesis.speak(speech);
  };
  const renderSource = (question: Question) => <a className="question-source" href={question.sourceUrl ?? OFFICIAL_RESOURCE_URL} target="_blank" rel="noreferrer"><ExternalLink size={13} /><span><strong>題目來源：</strong>{question.source}</span></a>;
  const renderCambridgeContext = (question: Question, revealTranscript = false) => question.examFamily === CAMBRIDGE_B2_FIRST ? <section className="cambridge-context"><div className="cambridge-context-head"><span className="index-tag yellow">{question.component}</span><span className="index-tag">{question.part}</span><span className="index-tag">{question.questionType}</span></div>{question.stimulus && <div className="reading-passage"><div className="reading-passage-label"><BookOpenText size={15} />閱讀材料</div>{question.stimulus.split("\n").map((line, index) => <p key={`${question.id}-stimulus-${index}`}>{line}</p>)}</div>}{question.audioScript && <div className="listening-player"><div className="listening-player-copy"><Headphones size={17} /><div><strong>Listening 音訊</strong><span>本站原創語音稿；可調整速度重播</span></div></div><div className="audio-actions"><button className="outline-button" onClick={() => speakListening(question, 0.88)}><Volume2 size={15} />播放</button><button className="text-button" onClick={() => speakListening(question, 0.68)}>慢速 0.68×</button></div>{revealTranscript && <details className="audio-transcript"><summary>查看音訊逐字稿與解析提示</summary><p>{question.audioScript}</p></details>}</div>}</section> : null;
  const renderQuestionTools = (question: Question) => <section className="question-tools"><div className="question-tools-head"><button className={`bookmark-button ${bookmarks.includes(question.id) ? "saved" : ""}`} onClick={() => toggleBookmark(question.id)}><Bookmark size={16} fill={bookmarks.includes(question.id) ? "currentColor" : "none"} />{bookmarks.includes(question.id) ? "已收藏" : "收藏此題"}</button><span>收藏與筆記僅儲存在此裝置</span></div><label className="note-field"><span><FileText size={14} />我的筆記</span><textarea value={notes[question.id] ?? ""} onChange={(event) => updateNote(question.id, event.target.value)} placeholder="記下判斷關鍵、公式或容易混淆的觀念…" /></label></section>;

  const renderQuestion = () => {
    if (!currentQuestion) return <div className="empty-stage"><Layers3 /><div><h3>先設定篩選條件</h3><p>選擇級別、科目與題數後，按下「重新抽題」開始。你可以隨時換題、換科目或切換級別。</p></div></div>;
    if (practiceFinished) {
      const answered = practiceSet.slice(0, practiceIndex + 1);
      const correct = answered.filter((item) => attempts.filter((attempt) => attempt.questionId === item.id).some((attempt) => attempt.correct)).length;
      return <div className="practice-complete"><div className="eyebrow">一輪完成</div><h3>把每個選項的理由，變成下一次的直覺。</h3><div className="complete-score">{correct}<span style={{ color: "rgba(255,255,255,.65)", fontSize: "20px", letterSpacing: "0" }}> / {practiceSet.length}</span></div><p>此輪已完成。可重新抽題、變更主題，或到錯題複盤查看需要再練的概念。</p><Button className="solid-button" onClick={() => startPractice()}><RotateCcw />再抽一輪</Button></div>;
    }
    const correct = practiceAnswer === currentQuestion.answer;
    return <>
      <div className="progress-rule"><span style={{ width: `${((practiceIndex + (practiceSubmitted ? 1 : 0)) / practiceSet.length) * 100}%` }} /></div>
      <article className="question-sheet">
        <div className="question-meta"><div className="tag-row"><span className="index-tag yellow">{currentQuestion.level}</span><span className="index-tag">{currentQuestion.subject}</span><span className="index-tag">{currentQuestion.topic}</span>{currentQuestion.examFamily && <span className="index-tag cambridge-tag">{currentQuestion.part}</span>}</div><span className="question-number">{String(practiceIndex + 1).padStart(2, "0")} / {String(practiceSet.length).padStart(2, "0")}</span></div>
        {renderCambridgeContext(currentQuestion, practiceSubmitted)}
        <h2 className="question-stem">{currentQuestion.stem}</h2>
        <div className="option-list">{currentQuestion.options.map((option, index) => {
          const status = practiceSubmitted ? (index === currentQuestion.answer ? "correct" : index === practiceAnswer ? "wrong" : "") : (index === practiceAnswer ? "chosen" : "");
          return <button key={option} className={`option ${status}`} disabled={practiceSubmitted} onClick={() => setPracticeAnswer(index)}><span className="option-letter">{CHOICES[index]}</span><span className="option-copy">{option}</span></button>;
        })}</div>
        <div className="answer-actions">{!practiceSubmitted ? <span className="answer-hint">選好答案後送出；回饋會直接顯示在題目下方。</span> : <span className="answer-hint">已記錄於此裝置的複盤紀錄。</span>}{!practiceSubmitted ? <Button className="solid-button" disabled={practiceAnswer === null} onClick={submitPractice}>送出答案 <ArrowRight /></Button> : <Button className="solid-button" onClick={nextPractice}>{practiceIndex === practiceSet.length - 1 ? "完成這輪" : "下一題"} <ArrowRight /></Button>}</div>
        {practiceSubmitted && <div className={`feedback ${correct ? "" : "incorrect"}`}><div className="feedback-head">{correct ? <CheckCircle2 /> : <XCircle />}{correct ? "判斷正確" : `正確答案是 ${CHOICES[currentQuestion.answer]}`}</div><p>{currentQuestion.explanation}</p><p className="trap-note"><strong>易錯提醒：</strong>{currentQuestion.trap}</p></div>}
        {renderSource(currentQuestion)}
        {renderQuestionTools(currentQuestion)}
      </article>
    </>;
  };

  const renderExam = () => {
    if (!examSet.length) return <div className="empty-stage"><GraduationCap /><div><h3>設定模擬測驗</h3><p>左側可設定級別、科目、主題與題數。開始後每題預設 1 分鐘，並可在任何時候交卷。</p></div></div>;
    if (examFinished) {
      const correct = examSet.filter((q) => examAnswers[q.id] === q.answer).length;
      return <div className="exam-result"><div className="result-banner"><div className="eyebrow">{examMode === "mistakes" ? "錯題專屬測驗完成" : "測驗完成"}</div><h2>結果不是終點，是下一輪篩選條件。</h2><p>下方保留每題答案、解析、來源與易錯提醒；錯題會收錄到本機複盤清單。</p><div className="result-score">{correct}<small> / {examSet.length} 題正確</small></div></div>{examSet.map((question, index) => { const selected = examAnswers[question.id]; const ok = selected === question.answer; return <article key={question.id} className={`review-item ${ok ? "" : "wrong"}`}><div className="eyebrow">{String(index + 1).padStart(2, "0")} · {question.topic}{question.examFamily ? ` · ${question.part}` : ""}</div>{renderCambridgeContext(question, true)}<h3>{question.stem}</h3><p className="review-answer">{ok ? "答對" : `答錯 · 你的答案：${selected === undefined ? "未作答" : `${CHOICES[selected]} ${question.options[selected]}`}`}</p><p><strong>正解：</strong>{CHOICES[question.answer]} {question.options[question.answer]}</p><p><strong>解析：</strong>{question.explanation}</p><p><strong>易錯提醒：</strong>{question.trap}</p>{renderSource(question)}</article>; })}</div>;
    }
    if (!currentExamQuestion) return null;
    return <div><div className="exam-topline"><span>{examMode === "mistakes" ? "錯題專屬測驗 · 已答錯題目" : `模擬測驗 · ${level} / ${subject}`}</span><span className="exam-clock"><Clock3 />{timeText(examSeconds)}</span></div><div className="exam-pager">{examSet.map((item, index) => <button key={item.id} className={`pager-button ${index === examIndex ? "current" : ""} ${examAnswers[item.id] !== undefined ? "answered" : ""}`} onClick={() => setExamIndex(index)}>{index + 1}</button>)}</div><article className="question-sheet"><div className="question-meta"><div className="tag-row"><span className="index-tag yellow">{currentExamQuestion.level}</span><span className="index-tag">{currentExamQuestion.topic}</span><span className="index-tag">{currentExamQuestion.difficulty}</span>{currentExamQuestion.examFamily && <span className="index-tag cambridge-tag">{currentExamQuestion.part}</span>}</div><span className="question-number">題次 {examIndex + 1} / {examSet.length}</span></div>{renderCambridgeContext(currentExamQuestion)}<h2 className="question-stem">{currentExamQuestion.stem}</h2><div className="option-list">{currentExamQuestion.options.map((option, index) => <button key={option} className={`option ${examAnswers[currentExamQuestion.id] === index ? "chosen" : ""}`} onClick={() => setExamAnswers((answers) => ({ ...answers, [currentExamQuestion.id]: index }))}><span className="option-letter">{CHOICES[index]}</span><span className="option-copy">{option}</span></button>)}</div><div className="exam-nav"><Button className="outline-button" disabled={examIndex === 0} onClick={() => setExamIndex((index) => index - 1)}><ArrowLeft />上一題</Button><div className="exam-nav-right">{examIndex < examSet.length - 1 && <Button className="outline-button" onClick={() => setExamIndex((index) => index + 1)}>下一題<ArrowRight /></Button>}<Button className="solid-button" onClick={finishExam}>交卷並看解析</Button></div></div>{renderSource(currentExamQuestion)}</article></div>;
  };

  const renderDailyPlan = () => <section className="daily-plan"><div className="daily-plan-title"><div><div className="eyebrow">TODAY'S REVIEW FILE</div><h2>今日複習計畫</h2><p>{dailyPlan.length ? "以最近 14 天的作答、錯題主題與題目難度排出優先順序。" : "先完成幾題練習；系統會依近期作答與難度建立你的今日複習清單。"}</p></div><CalendarDays /></div>{dailyPlan.length ? <><div className="plan-list">{dailyPlan.slice(0, 4).map((item, index) => <div className="plan-item" key={item.question.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.question.topic}</strong><small>{item.question.difficulty} · {item.reason}</small></div></div>)}</div><Button className="solid-button" onClick={startDailyPlan}><CalendarDays />開始今日 8 題複習</Button></> : <div className="plan-empty"><Tag size={17} />完成作答後，會優先安排近期錯答與進階題。</div>}</section>;

  const renderStudyTracking = () => <section className="study-tracking"><article className="completion-file"><div className="eyebrow">DAILY COMPLETION</div><div className="completion-main"><div className="completion-ring" style={{ background: `conic-gradient(var(--yellow) ${dailyCompletion}%, rgba(25,60,107,.12) 0)` }}><span>{dailyCompletion}%</span></div><div><h2>今天完成 {todayCompleted} / {countdownPlan.dailyTarget} 題</h2><p>{dailyCompletion >= 100 ? "今日建議題量已完成；可轉往錯題專測或收藏題複習。" : `再完成 ${Math.max(0, countdownPlan.dailyTarget - todayCompleted)} 題，即可達成今天的倒數計畫。`}</p></div></div></article><article className="streak-file"><div className="eyebrow">STUDY STREAK</div><Flame /><strong>{studyStreak}<small> 天</small></strong><p>{studyStreak ? "連續學習會以每天至少完成一題計算。" : "完成今天第一題，開始建立你的學習連續紀錄。"}</p></article><article className="countdown-file"><div className="eyebrow">EXAM COUNTDOWN</div><div className="countdown-head"><CalendarClock /><strong>{countdownPlan.status}</strong></div><label><span className="field-label">目標考期</span><input className="date-field" type="date" value={goalDate} min={todayKey} onChange={(event) => updateGoalDate(event.target.value)} /></label><div className="target-numbers"><span><b>{countdownPlan.dailyTarget}</b> 題／日</span><span><b>{countdownPlan.weeklyTarget}</b> 題／週</span></div><p><Target size={13} /> 以剩餘題庫至少完成 1.2 輪為基準，並保留每週 1 日彈性調整。</p></article></section>;

  const renderDashboard = () => <>{renderStudyTracking()}{renderDailyPlan()}
    <section className="dash-grid"><article className="hero-panel"><img className="hero-art" src={HERO_URL} alt="深靛藍題庫工作台插畫" /><div className="hero-content"><div className="eyebrow">AI APPLICATION PLANNER · STUDY DESK</div><h2>從一題開始，找出你真正的盲點。</h2><p>初級與中級的原創練習題，依官方科目範圍整理。每次作答，都會留下正解、理由、來源與易錯提醒。</p><div className="hero-markers"><span className="hero-marker"><b />{QUESTIONS.length} 題題庫</span><span className="hero-marker"><b />原因＋來源</span><span className="hero-marker"><b />錯題複盤</span></div><Button className="solid-button" onClick={() => startPractice(1)}>開始 1 題盲點檢核 <Sparkles /></Button></div><div className="hero-dossier" aria-label="題目解析檔案示意"><div className="dossier-strip"><span /> <span /> <span /></div><div className="dossier-label">QUESTION / 042 · REVIEW FILE</div><p>模型驗證集表現下降，優先檢查？</p><div className="dossier-option"><b>B</b>資料漂移與近期輸入分佈</div><small><em>錯因標記</em> 勿只看訓練集準確率 · 來源註記</small></div></article><aside className="welcome-panel"><div className="eyebrow">快速練習</div><h3>現在建立一輪科目檢核。</h3><p>每科至少 100 題原創題目。選一門科目，立即依目前範圍建立練習。</p><div className="quick-form"><label><span className="field-label">抽題範圍</span><select className="select-field" value={subject} onChange={(event) => changeSubject(event.target.value)}>{SUBJECTS[level].map((item) => <option key={item}>{item}</option>)}</select></label>{subject === ENGLISH_B2_SUBJECT && <label><span className="field-label">英文模式</span><select className="select-field" value={englishMode} onChange={(event) => changeEnglishMode(event.target.value as EnglishMode)}><option>通用 CEFR B2</option><option>Cambridge B2 First</option></select></label>}{subject === ENGLISH_B2_SUBJECT && englishMode === CAMBRIDGE_B2_FIRST && <div className="quick-mode-note"><Headphones size={14} /> Reading 七個 Part · Listening 四個 Part · 原創仿真題</div>}<div className="quick-row"><select className="select-field" value={level} onChange={(event) => changeLevel(event.target.value as Level)}><option>初級</option><option>中級</option></select><Button className="solid-button" onClick={() => startPractice(10)}><Play />建立 10 題練習</Button></div></div></aside><div className="metrics-row"><div className="metric"><div className="metric-label">題庫總數</div><div className="metric-value">{QUESTIONS.length}</div><div className="metric-detail">原創練習題</div></div><div className="metric"><div className="metric-label">已作答</div><div className="metric-value">{attempts.length}</div><div className="metric-detail">本機累積紀錄</div></div><div className="metric"><div className="metric-label">答對率</div><div className="metric-value">{accuracy}%</div><div className="metric-detail">所有已作答題目</div></div><div className="metric"><div className="metric-label">待複盤</div><div className="metric-value">{mistakes.length}</div><div className="metric-detail">曾答錯的題目</div></div></div></section>
    <div className="section-head"><div><div className="eyebrow">考科索引</div><h2>依範圍選題，不讓複習失焦。</h2></div><p className="section-caption">以「起點」與「專科檔案」排序；每科題目均為依官方範圍自編。</p></div><section className="course-archive"><aside className="archive-spine"><span>STUDY<br />ARCHIVE</span><strong>從<br />01<br />起</strong><small>建議先完成初級基礎概論，再往應用與中級專科展開。</small></aside><div className="course-lanes">{[...SUBJECTS.初級, ...SUBJECTS.中級].map((name, index) => <button key={name} className={`course-lane ${index === 0 ? "recommended" : ""}`} onClick={() => { const nextLevel: Level = SUBJECTS.初級.includes(name) ? "初級" : "中級"; changeLevel(nextLevel); setSubject(name); setTopic("全部主題"); setView("practice"); setPracticeSet([]); }}><span className="lane-index">{String(index + 1).padStart(2, "0")} · {SUBJECTS.初級.includes(name) ? "初級" : "中級"}</span>{index === 0 && <span className="recommended-tag">建議起點</span>}<span className="lane-name">{name}</span><span className="lane-count">{QUESTIONS.filter((q) => q.subject === name).length} 題 · 前往練習 <ChevronRight size={13} style={{ verticalAlign: "-2px" }} /></span></button>)}</div></section>
  </>;

  const renderReview = () => <><section className="review-layout"><article className="review-board"><img className="review-board-art" src={REVIEW_URL} alt="學習成效複盤插畫" /><div className="review-content"><div className="eyebrow">REVIEW BOARD · LOCAL ONLY</div><h2>{attempts.length ? "每次答錯，都是下一輪的指引。" : "先完成一題，複盤才有方向。"}</h2><p>{attempts.length ? `目前共 ${attempts.length} 次作答，整體答對率 ${accuracy}%。以下依已作答科目顯示表現；數據僅保留在此瀏覽器。` : "即時練習或模擬測驗後，正誤與錯題會出現在這裡。"}</p>{subjectAccuracy.length > 0 && <div className="score-bars">{subjectAccuracy.map((item) => <div key={item.name}><div className="score-bar-head"><span>{item.name}</span><span>{item.score}% · {item.total} 題</span></div><div className="score-bar"><span style={{ width: `${item.score}%` }} /></div></div>)}</div>}</div></article><aside className="review-aside"><div className="eyebrow">弱點推薦</div><h3>依答錯比例安排下一輪</h3>{weakTopics.length ? <div className="weakness-list">{weakTopics.map((item, index) => <button className="weakness-item" key={`${item.subject}-${item.topic}`} onClick={() => startTopicPractice(item)}><span className="weakness-rank">0{index + 1}</span><span><strong>{item.topic}</strong><small>{item.subject} · 答錯率 {item.wrongRate}%（{item.wrong}/{item.total}）</small></span><ChevronRight size={16} /></button>)}</div> : <p className="no-data">累積至少一題錯答後，這裡會依錯誤率推薦你最該先練的主題。</p>}<div className="review-divider" /><div className="eyebrow">錯題索引</div><h3>把答錯題目再考一次</h3>{mistakes.length ? <><p className="no-data">目前 {mistakes.length} 題待複盤，計時再測會直接從這些題目抽題。</p><Button className="solid-button review-exam-button" onClick={startMistakeExam}><Flag />開始錯題專屬測驗</Button><div className="mistake-list">{mistakes.slice(0, 5).map((question) => <div className="mistake-item" key={question.id}><button onClick={() => openLibraryQuestion(question)}>{question.stem}</button><small>{question.level} · {question.topic}</small></div>)}</div></> : <p className="no-data">尚無錯題紀錄。先抽一題，作答後會自動整理到這裡。</p>}</aside></section><div className="section-head"><div><div className="eyebrow">最近作答</div><h2>保留可回看的學習軌跡。</h2></div>{attempts.length > 0 && <Button className="text-button" onClick={resetProgress}><RotateCcw />清除本機紀錄</Button>}</div>{attempts.length ? <section className="recent-grid">{[...attempts].reverse().slice(0, 8).map((attempt, index) => { const question = QUESTIONS.find((item) => item.id === attempt.questionId); return <div className="recent-row" key={`${attempt.date}-${attempt.questionId}-${index}`}><span className={`recent-status ${attempt.correct ? "good" : "bad"}`}>{attempt.correct ? "答對" : "待複盤"}</span><span className="recent-title">{question?.stem ?? "已移除的題目"}</span><span className="recent-date">{dateText(attempt.date)}</span></div>; })}</section> : <div className="empty-stage" style={{ minHeight: 190 }}><img src={CARDS_URL} alt="題庫索引卡插畫" style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 0 }} /><div><h3>尚未開始記錄</h3><p>資料不會上傳，只有你在這台裝置上的答題會被保存。</p></div></div>}</>;

  const renderLibrary = () => <section className="library-layout"><div className="library-head"><div><div className="eyebrow">PERSONAL INDEX</div><h2>收藏、筆記與標籤搜尋</h2><p>搜尋題幹、選項、考科或主題；收藏與筆記只保存在目前瀏覽器。</p></div><div className="library-count"><Bookmark size={16} />{bookmarkQuestions.length} 題已收藏</div></div><div className="library-toolbar"><label className="search-field"><Search size={17} /><input value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} placeholder="搜尋題目、主題或關鍵字" /></label><label><span className="field-label">級別</span><select className="select-field" value={libraryLevel} onChange={(event) => { setLibraryLevel(event.target.value as "全部" | Level); setLibrarySubject("全部"); }}><option>全部</option><option>初級</option><option>中級</option></select></label><label><span className="field-label">考科</span><select className="select-field" value={librarySubject} onChange={(event) => { setLibrarySubject(event.target.value); setLibraryExamFamily("全部模式"); setLibraryPart("全部 Part"); }}><option>全部</option>{librarySubjects.map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="field-label">測驗模式</span><select className="select-field" value={libraryExamFamily} onChange={(event) => { setLibraryExamFamily(event.target.value as LibraryExamFilter); setLibraryPart("全部 Part"); }}><option>全部模式</option><option>通用 CEFR B2</option><option>Cambridge B2 First</option></select></label>{libraryExamFamily === CAMBRIDGE_B2_FIRST && <label><span className="field-label">Part</span><select className="select-field" value={libraryPart} onChange={(event) => setLibraryPart(event.target.value)}>{allCambridgeParts.map((item) => <option key={item}>{item}</option>)}</select></label>}<label><span className="field-label">主題標籤</span><select className="select-field" value={libraryTopic} onChange={(event) => setLibraryTopic(event.target.value)}><option>全部</option>{allLibraryTopics.map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="field-label">難度</span><select className="select-field" value={libraryDifficulty} onChange={(event) => setLibraryDifficulty(event.target.value as "全部" | Question["difficulty"])}><option>全部</option><option>基礎</option><option>情境</option><option>進階</option></select></label><button className={`bookmark-filter ${libraryBookmarksOnly ? "active" : ""}`} onClick={() => setLibraryBookmarksOnly((value) => !value)}><Bookmark size={15} fill={libraryBookmarksOnly ? "currentColor" : "none"} />只看收藏</button></div><div className="library-summary"><span><Tag size={14} />符合 {libraryResults.length} 題</span>{bookmarkQuestions.length > 0 && <Button className="outline-button" onClick={startBookmarkPractice}><Play />練習收藏題</Button>}</div><div className="library-results">{libraryResults.slice(0, 100).map((question) => <article className="library-card" key={question.id}><button className="library-card-main" onClick={() => openLibraryQuestion(question)}><div className="tag-row"><span className="index-tag yellow">{question.level}</span><span className="index-tag">{question.subject}</span><span className="index-tag">{question.topic}</span><span className="index-tag">{question.difficulty}</span>{question.examFamily && <span className="index-tag cambridge-tag">{question.part}</span>}</div><h3>{question.stem}</h3><p>{notes[question.id] ? `筆記：${notes[question.id]}` : "尚未留下筆記"}</p></button><button className={`library-bookmark ${bookmarks.includes(question.id) ? "saved" : ""}`} onClick={() => toggleBookmark(question.id)} aria-label="切換收藏"><Bookmark size={17} fill={bookmarks.includes(question.id) ? "currentColor" : "none"} /></button></article>)}{libraryResults.length > 100 && <p className="library-limit">目前顯示前 100 筆；請用考科、主題、難度或關鍵字縮小範圍。</p>}{!libraryResults.length && <div className="empty-stage"><Search /><div><h3>沒有符合的題目</h3><p>嘗試清除部分篩選條件，或先在練習中收藏你要回看的題目。</p></div></div>}</div></section>;

  const renderBackupPanel = () => <section className="backup-file"><div><div className="eyebrow">PRIVATE BACKUP</div><h3>把收藏與筆記帶著走</h3><p>匯出為 JSON 備份；匯入會先顯示有效題數，再讓你選擇安全合併或完整還原。</p></div><div className="backup-actions"><Button className="outline-button" onClick={exportPersonalData}><Download />匯出備份</Button><Button className="solid-button" onClick={() => backupInputRef.current?.click()}><Upload />匯入備份</Button><input ref={backupInputRef} className="sr-only" type="file" accept="application/json,.json" onChange={inspectBackupFile} /></div>{backupMessage && <div className="backup-message"><ShieldCheck size={15} />{backupMessage}</div>}{pendingBackup && <div className="restore-confirm"><div><strong>備份已就緒</strong><span>{pendingBackup.bookmarks.length} 題收藏 · {Object.keys(pendingBackup.notes).length} 則筆記</span></div><div><Button className="outline-button" onClick={() => restoreBackup("merge")}>安全合併</Button><Button className="danger-outline" onClick={() => restoreBackup("overwrite")}>完整還原</Button></div></div>}</section>;

  const renderView = () => {
    if (view === "practice") return <div className="task-layout">{renderSidebarFilters("practice")}<main className="practice-stage">{renderQuestion()}</main></div>;
    if (view === "exam") return <div className="task-layout">{renderSidebarFilters("exam")}<main className="practice-stage">{renderExam()}</main></div>;
    if (view === "review") return renderReview();
    if (view === "library") return <>{renderBackupPanel()}{renderLibrary()}</>;
    return renderDashboard();
  };

  return (
    <div className="app-shell">
      <aside className="study-rail">
        <div className="brand-lockup">
          <img className="brand-logo" src={LOGO_URL} alt="題策標誌" />
          <div>
            <div className="brand-name">題策</div>
            <span className="brand-caption">IPAS STUDY WORKBENCH</span>
          </div>
        </div>
        <div className="rail-label">學習軌道</div>
        <nav className="rail-nav">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
              <Icon />{label}
            </button>
          ))}
        </nav>
        <div className="rail-footer">
          <div className="rail-label" style={{ padding: 0 }}>目前累積</div>
          <div className="rail-score">{attempts.length}<span style={{ color: "rgba(238,244,248,.58)", fontSize: 13, letterSpacing: 0 }}> 題</span></div>
          <div className="rail-footnote">答對率 {accuracy}%<br />收藏 {bookmarkQuestions.length} 題 · 本機保存</div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{NAV_ITEMS.find((item) => item.id === view)?.label}</h1>
            <span className="topbar-separator" />
            <span className="topbar-meta">題庫 v4.0 · iPAS＋CEFR B2 · Cambridge B2 First</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                const q = selectQuizQuestion(notifConfig.scope);
                setPopQuizQuestionId(q.id);
                setIsPopQuizOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="立即開啟隨堂快問快答"
            >
              <Zap size={14} className="text-amber-600 fill-amber-500" />
              <span>隨堂抽考</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationSettingsOpen(true)}
              className="relative inline-flex items-center justify-center p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-xs cursor-pointer"
              title="手機隨堂推播與抽考設定"
              aria-label="推播設定"
            >
              <Bell size={16} />
              {notifConfig.enabled && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              )}
            </button>

            <span className="identity-tag">
              <span className="identity-dot" />依官方範圍自編
            </span>
          </div>
        </header>

        {renderView()}
      </div>

      <nav className="mobile-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
            <Icon />{label.replace("學習", "").replace("即時", "").replace("與筆記", "")}
          </button>
        ))}
      </nav>

      {/* Pop Quiz & Notification Modals */}
      <PopQuizModal
        questionId={popQuizQuestionId}
        isOpen={isPopQuizOpen}
        onClose={() => setIsPopQuizOpen(false)}
        onRecordAttempt={(newAttempt) => persistAttempts([newAttempt])}
        bookmarks={bookmarks}
        onToggleBookmark={toggleBookmark}
        notes={notes}
        onUpdateNote={updateNote}
      />

      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => {
          setIsNotificationSettingsOpen(false);
          setNotifConfig(getNotificationConfig());
        }}
        onLaunchInstantQuiz={() => {
          const q = selectQuizQuestion(notifConfig.scope);
          setPopQuizQuestionId(q.id);
          setIsPopQuizOpen(true);
        }}
      />
    </div>
  );
}

