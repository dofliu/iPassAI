import { describe, expect, it } from "vitest";
import {
  CCAR_F_DOMAINS,
  CLAUDE_CERT_QUESTIONS,
  CLAUDE_CERT_SUBJECT,
} from "./claudeCertQuestions";
import { LEVELS, QUESTIONS, SUBJECTS } from "./questions";
import {
  OFFICIAL_EXAM_SPECS,
  buildDomainQuota,
  buildOfficialExamQuestionSet,
  findExamSpec,
} from "./src/data/examSpecs";

describe("Claude Certified Architect – Foundations 題庫", () => {
  it("五大領域權重合計為 100%", () => {
    const total = CCAR_F_DOMAINS.reduce((sum, domain) => sum + domain.weight, 0);
    expect(total).toBe(100);
  });

  it("題數足以組出一份 60 題全真模考", () => {
    const spec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "claude-ccar-f")!;
    expect(CLAUDE_CERT_QUESTIONS.length).toBeGreaterThanOrEqual(spec.officialQuestionCount);
  });

  it("每個領域都有題目，且題目的 topic 都落在五大領域內", () => {
    const domainNames: string[] = CCAR_F_DOMAINS.map((domain) => domain.name);
    domainNames.forEach((name) => {
      expect(CLAUDE_CERT_QUESTIONS.filter((q) => q.topic === name).length).toBeGreaterThan(0);
    });
    expect(CLAUDE_CERT_QUESTIONS.every((q) => domainNames.includes(q.topic))).toBe(true);
  });

  it("每題結構完整：四個相異選項、答案索引合法、附解析與易錯提醒", () => {
    CLAUDE_CERT_QUESTIONS.forEach((q) => {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
      expect(q.stem.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(10);
      expect(q.trap.length).toBeGreaterThan(10);
      expect(q.level).toBe("專業認證");
      expect(q.subject).toBe(CLAUDE_CERT_SUBJECT);
    });
  });

  it("題目 id 在全題庫中唯一", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("正確答案不會集中在同一個選項位置", () => {
    const counts = [0, 1, 2, 3].map(
      (index) => CLAUDE_CERT_QUESTIONS.filter((q) => q.answer === index).length
    );
    // 四個位置都應有相當比例的正解，避免「一律選同一個選項」就能過關
    counts.forEach((count) => {
      expect(count).toBeGreaterThan(CLAUDE_CERT_QUESTIONS.length * 0.15);
      expect(count).toBeLessThan(CLAUDE_CERT_QUESTIONS.length * 0.35);
    });
  });

  it("已註冊為「專業認證」級別的考科並併入全題庫", () => {
    expect(LEVELS).toContain("專業認證");
    expect(SUBJECTS.專業認證).toContain(CLAUDE_CERT_SUBJECT);
    expect(QUESTIONS.filter((q) => q.subject === CLAUDE_CERT_SUBJECT).length).toBe(
      CLAUDE_CERT_QUESTIONS.length
    );
  });
});

describe("CCAR-F 全真模考規格", () => {
  it("符合官方考試格式：60 題 / 120 分鐘 / 720 分及格", () => {
    const spec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "claude-ccar-f")!;
    expect(spec.officialQuestionCount).toBe(60);
    expect(spec.officialDurationMinutes).toBe(120);
    expect(spec.passingScorePercent).toBe(72);
    expect(spec.level).toBe("專業認證");
  });

  it("可由級別與科目找到對應規格", () => {
    expect(findExamSpec("專業認證", CLAUDE_CERT_SUBJECT)?.id).toBe("claude-ccar-f");
  });

  it("領域配額依權重換算且合計等於總題數", () => {
    const quota = buildDomainQuota(60);
    const total = [...quota.values()].reduce((sum, value) => sum + value, 0);
    expect(total).toBe(60);
    // 27% 的代理架構應為最大宗，15% 的情境管理應為最少
    expect(quota.get("代理架構與協作編排")!).toBeGreaterThan(quota.get("情境管理與可靠性")!);
  });

  it("組出的模考題數正確且全部來自 Claude 認證考科", () => {
    const spec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "claude-ccar-f")!;
    const questions = buildOfficialExamQuestionSet(QUESTIONS, spec);
    expect(questions.length).toBe(spec.officialQuestionCount);
    expect(questions.every((q) => q.subject === CLAUDE_CERT_SUBJECT)).toBe(true);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it("模考各領域題數符合官方權重配比", () => {
    const spec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "claude-ccar-f")!;
    const questions = buildOfficialExamQuestionSet(QUESTIONS, spec);
    const quota = buildDomainQuota(spec.officialQuestionCount);
    quota.forEach((expected, domainName) => {
      expect(questions.filter((q) => q.topic === domainName).length).toBe(expected);
    });
  });
});
