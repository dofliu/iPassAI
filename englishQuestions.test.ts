import { describe, expect, it } from "vitest";
import { CEFR_B2_SOURCE_URL, ENGLISH_B2_QUESTIONS, ENGLISH_B2_SUBJECT } from "./englishQuestions";

describe("CEFR B2 English question bank", () => {
  it("contains at least 150 original questions with unique IDs", () => {
    expect(ENGLISH_B2_QUESTIONS.length).toBeGreaterThanOrEqual(150);
    expect(new Set(ENGLISH_B2_QUESTIONS.map((question) => question.id)).size).toBe(ENGLISH_B2_QUESTIONS.length);
    expect(ENGLISH_B2_QUESTIONS.every((question) => question.subject === ENGLISH_B2_SUBJECT)).toBe(true);
  });

  it("covers diverse B2 practice areas including cloze, collocations, sentence transformations and pragmatics", () => {
    const topics = new Set(ENGLISH_B2_QUESTIONS.map((question) => question.topic));
    expect(topics.has("Vocabulary in context")).toBe(true);
    expect(topics.has("Grammar and sentence control")).toBe(true);
    expect(topics.has("Functional language and interaction")).toBe(true);
    expect(topics.has("Cloze and discourse markers")).toBe(true);
    expect(topics.has("Collocations and phrasal verbs")).toBe(true);
    expect(topics.has("Sentence transformation and structure")).toBe(true);
    expect(topics.has("Applied situational pragmatics")).toBe(true);

    expect(ENGLISH_B2_QUESTIONS.every((question) => question.sourceUrl === CEFR_B2_SOURCE_URL && question.source.includes("CEFR B2"))).toBe(true);
    expect(ENGLISH_B2_QUESTIONS.every((question) => question.options.length === 4 && question.answer >= 0 && question.answer < 4)).toBe(true);
  });
});
