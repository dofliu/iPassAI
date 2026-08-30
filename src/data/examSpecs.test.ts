import { describe, expect, it } from "vitest";
import {
  OFFICIAL_EXAM_SPECS,
  findExamSpec,
  buildOfficialExamQuestionSet,
} from "./examSpecs";
import { QUESTIONS } from "../../questions";
import { ENGLISH_B2_SUBJECT } from "../../englishQuestions";
import { CAMBRIDGE_B2_FIRST } from "../../cambridgeB2FirstQuestions";

describe("Official Exam Specifications", () => {
  it("defines official exam specifications for all iPAS and English subjects", () => {
    expect(OFFICIAL_EXAM_SPECS.length).toBeGreaterThanOrEqual(7);

    const ipasBasicSpecs = OFFICIAL_EXAM_SPECS.filter((s) => s.level === "初級");
    expect(ipasBasicSpecs.length).toBe(2);
    expect(ipasBasicSpecs.every((s) => s.officialQuestionCount === 50 && s.officialDurationMinutes === 60)).toBe(true);

    const ipasInterSpecs = OFFICIAL_EXAM_SPECS.filter((s) => s.level === "中級" && s.subject !== ENGLISH_B2_SUBJECT);
    expect(ipasInterSpecs.length).toBe(3);
    expect(ipasInterSpecs.every((s) => s.officialQuestionCount === 50 && s.officialDurationMinutes === 60)).toBe(true);

    const cefrSpec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "cefr-b2-general-exam");
    expect(cefrSpec).toBeDefined();
    expect(cefrSpec?.officialDurationMinutes).toBe(60);

    const cambridgeReadingSpec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "cambridge-b2-reading-use-of-english");
    expect(cambridgeReadingSpec?.officialDurationMinutes).toBe(75);
    expect(cambridgeReadingSpec?.officialQuestionCount).toBe(52);

    const cambridgeListeningSpec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "cambridge-b2-listening");
    expect(cambridgeListeningSpec?.officialDurationMinutes).toBe(40);
    expect(cambridgeListeningSpec?.officialQuestionCount).toBe(30);
  });

  it("finds correct exam spec given level, subject and exam family", () => {
    const spec1 = findExamSpec("初級", "人工智慧基礎概論");
    expect(spec1?.id).toBe("ipas-basic-ai-concepts");

    const spec2 = findExamSpec("中級", "機器學習技術與應用");
    expect(spec2?.id).toBe("ipas-intermediate-machine-learning");

    const spec3 = findExamSpec("中級", ENGLISH_B2_SUBJECT, "通用 CEFR B2");
    expect(spec3?.id).toBe("cefr-b2-general-exam");

    const spec4 = findExamSpec("中級", ENGLISH_B2_SUBJECT, CAMBRIDGE_B2_FIRST, "Listening");
    expect(spec4?.id).toBe("cambridge-b2-listening");
  });

  it("generates a full exam question set matching spec limits", () => {
    const spec = OFFICIAL_EXAM_SPECS.find((s) => s.id === "cefr-b2-general-exam")!;
    const questions = buildOfficialExamQuestionSet(QUESTIONS, spec);
    expect(questions.length).toBe(spec.officialQuestionCount);
    expect(questions.every((q) => q.subject === ENGLISH_B2_SUBJECT)).toBe(true);
  });
});
