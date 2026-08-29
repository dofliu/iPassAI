import { describe, expect, it } from "vitest";
import { CEFR_B2_SOURCE_URL, ENGLISH_B2_QUESTIONS, ENGLISH_B2_SUBJECT } from "./englishQuestions";

describe("CEFR B2 English question bank", () => {
  it("contains at least 100 original questions with unique IDs", () => {
    expect(ENGLISH_B2_QUESTIONS.length).toBeGreaterThanOrEqual(100);
    expect(new Set(ENGLISH_B2_QUESTIONS.map((question) => question.id)).size).toBe(ENGLISH_B2_QUESTIONS.length);
    expect(ENGLISH_B2_QUESTIONS.every((question) => question.subject === ENGLISH_B2_SUBJECT)).toBe(true);
  });

  it("covers the four B2 practice areas and provides traceable sources", () => {
    const topics = new Set(ENGLISH_B2_QUESTIONS.map((question) => question.topic));
    expect(topics).toEqual(new Set([
      "Vocabulary in context",
      "Grammar and sentence control",
      "Reading for main ideas",
      "Reading for inference",
      "Reading for writer attitude",
      "Reading for precise meaning",
      "Reading for synthesis",
      "Reading for detail",
      "Reading for cause and effect",
      "Reading for text organisation",
      "Reading for comparison",
      "Functional language and interaction",
    ]));
    expect(ENGLISH_B2_QUESTIONS.every((question) => question.sourceUrl === CEFR_B2_SOURCE_URL && question.source.includes("CEFR B2"))).toBe(true);
    expect(ENGLISH_B2_QUESTIONS.every((question) => question.options.length === 4 && question.answer >= 0 && question.answer < 4)).toBe(true);
  });
});
