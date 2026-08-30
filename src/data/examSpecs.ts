/**
 * 全科目正式全真模擬考規格定義 (Official Simulation Exam Specifications)
 * 涵蓋 iPAS AI 初級/中級各考科、CEFR B2 英文與 Cambridge B2 First
 */
import { ENGLISH_B2_SUBJECT } from "./englishQuestions";
import { CAMBRIDGE_B2_FIRST } from "./cambridgeB2FirstQuestions";
import type { Level, Question } from "./questions";

export interface ExamSpec {
  id: string;
  name: string;
  level: Level;
  subject: string;
  examFamily?: string;
  component?: string;
  officialQuestionCount: number;
  officialDurationMinutes: number; // 考試時間（分鐘）
  passingScorePercent: number; // 及格百分比門檻 (例如 70%)
  passingScoreNote: string; // 例如 "70 分及格（35/50 題）"
  badge: string;
  description: string;
  topicsCovered: string[];
}

export const OFFICIAL_EXAM_SPECS: ExamSpec[] = [
  // --- iPAS AI 初級 ---
  {
    id: "ipas-basic-ai-concepts",
    name: "iPAS AI 初級 · 人工智慧基礎概論 全真模考",
    level: "初級",
    subject: "人工智慧基礎概論",
    officialQuestionCount: 50,
    officialDurationMinutes: 60,
    passingScorePercent: 70,
    passingScoreNote: "70 分及格 (答對 ≥ 35 題)",
    badge: "iPAS 官方標準規格",
    description: "全面檢驗 AI 定義與發展演進、資料概念、機器學習基礎、電腦視覺、NLP 及 AI 倫理法規治理。",
    topicsCovered: ["AI 的定義與分類", "資料基本概念與來源", "AI 核心技術與模型基礎", "AI 應用範疇與限制", "AI 治理與倫理法規"],
  },
  {
    id: "ipas-basic-genai-planning",
    name: "iPAS AI 初級 · 生成式 AI 應用與規劃 全真模考",
    level: "初級",
    subject: "生成式 AI 應用與規劃",
    officialQuestionCount: 50,
    officialDurationMinutes: 60,
    passingScorePercent: 70,
    passingScoreNote: "70 分及格 (答對 ≥ 35 題)",
    badge: "iPAS 官方標準規格",
    description: "涵蓋 LLM 大大型語言模型、Prompt 工程、多模態生成、RAG 架構、企業落地與風險防範。",
    topicsCovered: ["生成式 AI 核心原理", "提示詞工程技巧 (Prompt Engineering)", "多模態內容生成與應用", "檢索增強生成 (RAG) 與微調基礎", "生成式 AI 專案規劃與風險控制"],
  },

  // --- iPAS AI 中級 ---
  {
    id: "ipas-intermediate-tech-planning",
    name: "iPAS AI 中級 · 人工智慧技術應用與規劃 全真模考",
    level: "中級",
    subject: "人工智慧技術應用與規劃",
    officialQuestionCount: 50,
    officialDurationMinutes: 60,
    passingScorePercent: 70,
    passingScoreNote: "70 分及格 (答對 ≥ 35 題)",
    badge: "iPAS 官方標準規格",
    description: "針對企業級 AI 系統架構、MLOps 部署維運、模型生命週期管理與高階專案效益評估。",
    topicsCovered: ["AI 專案架構規劃與可行性評估", "MLOps 與模型持續整合部署 (CI/CD)", "模型監控、資料漂移與版本控制", "企業級 AI 系統整合與資安合規", "高效能運算與邊緣推論架構"],
  },
  {
    id: "ipas-intermediate-big-data",
    name: "iPAS AI 中級 · 大數據處理分析與應用 全真模考",
    level: "中級",
    subject: "大數據處理分析與應用",
    officialQuestionCount: 50,
    officialDurationMinutes: 60,
    passingScorePercent: 70,
    passingScoreNote: "70 分及格 (答對 ≥ 35 題)",
    badge: "iPAS 官方標準規格",
    description: "檢驗分散式計算架構、資料管線 ETL、特徵工程、即時串流處理與大數據治理能力。",
    topicsCovered: ["分散式儲存與計算架構", "資料前處理與高維特徵工程", "批次與即時串流資料管線 (ETL)", "關聯式與非關聯式資料庫應用", "大數據品質管理與資料治理架構"],
  },
  {
    id: "ipas-intermediate-machine-learning",
    name: "iPAS AI 中級 · 機器學習技術與應用 全真模考",
    level: "中級",
    subject: "機器學習技術與應用",
    officialQuestionCount: 50,
    officialDurationMinutes: 60,
    passingScorePercent: 70,
    passingScoreNote: "70 分及格 (答對 ≥ 35 題)",
    badge: "iPAS 官方標準規格",
    description: "涵蓋監督/非監督演算法、集成學習、深度學習網路結構、過擬合處理與模型可解釋性 (XAI)。",
    topicsCovered: ["監督式與非監督式演算法深入", "集成學習 (Ensemble Learning) 與梯度提升", "深度神經網路與優化器原理", "模型評估指標 (ROC-AUC, F1, PR-Curve)", "模型可解釋性 (XAI) 與正則化技術"],
  },

  // --- 國際英語檢定 CEFR B2 ---
  {
    id: "cefr-b2-general-exam",
    name: "CEFR B2 國際英語能力檢定 全真綜合模考",
    level: "中級",
    subject: ENGLISH_B2_SUBJECT,
    officialQuestionCount: 50,
    officialDurationMinutes: 60,
    passingScorePercent: 60,
    passingScoreNote: "60% 達標 (答對 ≥ 30 題達 CEFR B2 門檻)",
    badge: "CEFR 國際能力標準",
    description: "涵蓋情境文法、高頻詞彙、篇章克漏字、片語搭配、句型置換與長短篇閱讀理解。",
    topicsCovered: [
      "Vocabulary in context",
      "Grammar and sentence control",
      "Cloze and discourse markers",
      "Collocations and phrasal verbs",
      "Sentence transformation and structure",
      "Applied situational pragmatics",
      "Reading for main ideas & inference",
    ],
  },

  // --- Cambridge B2 First 專屬模考 ---
  {
    id: "cambridge-b2-reading-use-of-english",
    name: "Cambridge B2 First · Reading & Use of English 全卷仿真模考",
    level: "中級",
    subject: ENGLISH_B2_SUBJECT,
    examFamily: CAMBRIDGE_B2_FIRST,
    component: "Reading & Use of English",
    officialQuestionCount: 52,
    officialDurationMinutes: 75,
    passingScorePercent: 60,
    passingScoreNote: "Grade C / 160 Scale (答對 ≥ 31 題)",
    badge: "Cambridge 官方全真規格",
    description: "完整仿真劍橋英檢 B2 First 第一大卷：Part 1-7（含克漏字、開放克漏字、單字置換、關鍵字轉換、長篇閱讀與文章填空）。",
    topicsCovered: [
      "Part 1: Multiple-Choice Cloze",
      "Part 2: Open Cloze",
      "Part 3: Word Formation",
      "Part 4: Key Word Transformation",
      "Part 5: Multiple Choice",
      "Part 6: Gapped Text",
      "Part 7: Multiple Matching",
    ],
  },
  {
    id: "cambridge-b2-listening",
    name: "Cambridge B2 First · Listening 全卷仿真模考",
    level: "中級",
    subject: ENGLISH_B2_SUBJECT,
    examFamily: CAMBRIDGE_B2_FIRST,
    component: "Listening",
    officialQuestionCount: 30,
    officialDurationMinutes: 40,
    passingScorePercent: 60,
    passingScoreNote: "Grade C / 160 Scale (答對 ≥ 18 題)",
    badge: "Cambridge 官方全真規格",
    description: "完整仿真劍橋英檢 B2 First 聽力測驗：Part 1-4（短篇會話、單句填空、多方配對、多重選擇，附原創語音音訊朗讀）。",
    topicsCovered: [
      "Part 1: Multiple-Choice Short Dialogues",
      "Part 2: Sentence Completion",
      "Part 3: Multiple Matching",
      "Part 4: Multiple Choice Interview",
    ],
  },
];

/**
 * 依目前所選級別、科目與模式尋找最適配的官方模考規格
 */
export function findExamSpec(
  level: Level,
  subject: string,
  englishMode?: string,
  cambridgeComponent?: string
): ExamSpec | undefined {
  if (subject === ENGLISH_B2_SUBJECT) {
    if (englishMode === CAMBRIDGE_B2_FIRST) {
      if (cambridgeComponent && cambridgeComponent !== "全部元件") {
        return OFFICIAL_EXAM_SPECS.find(
          (s) => s.examFamily === CAMBRIDGE_B2_FIRST && s.component === cambridgeComponent
        );
      }
      return OFFICIAL_EXAM_SPECS.find((s) => s.id === "cambridge-b2-reading-use-of-english");
    }
    return OFFICIAL_EXAM_SPECS.find((s) => s.id === "cefr-b2-general-exam");
  }

  return OFFICIAL_EXAM_SPECS.find((s) => s.level === level && s.subject === subject);
}

/**
 * 隨機生成模考試題組
 */
export function buildOfficialExamQuestionSet(
  allQuestions: Question[],
  spec: ExamSpec
): Question[] {
  let pool = allQuestions.filter((q) => {
    if (spec.examFamily === CAMBRIDGE_B2_FIRST) {
      return (
        q.examFamily === CAMBRIDGE_B2_FIRST &&
        (!spec.component || q.component === spec.component)
      );
    }
    if (spec.subject === ENGLISH_B2_SUBJECT) {
      return q.subject === ENGLISH_B2_SUBJECT && !q.examFamily;
    }
    return q.level === spec.level && q.subject === spec.subject;
  });

  if (pool.length === 0) {
    pool = allQuestions.filter((q) => q.level === spec.level && q.subject === spec.subject);
  }

  // 洗牌後依目標題數截取
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(spec.officialQuestionCount, shuffled.length));
}
