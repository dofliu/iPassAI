import { describe, expect, it } from "vitest";
import {
  CAMBRIDGE_B2_FIRST,
  CAMBRIDGE_B2_FIRST_QUESTIONS,
  CAMBRIDGE_B2_FIRST_SOURCE_URL,
} from "./cambridgeB2FirstQuestions";

const reading = CAMBRIDGE_B2_FIRST_QUESTIONS.filter((question) => question.component === "Reading & Use of English");
const listening = CAMBRIDGE_B2_FIRST_QUESTIONS.filter((question) => question.component === "Listening");

describe("Cambridge B2 First question bank", () => {
  it("contains original questions across all Reading & Use of English Parts", () => {
    expect(reading.length).toBeGreaterThanOrEqual(20);
    expect(new Set(reading.map((question) => question.part))).toEqual(
      new Set(["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6", "Part 7"]),
    );
    expect(reading.every((question) => question.examFamily === CAMBRIDGE_B2_FIRST)).toBe(true);
    expect(reading.every((question) => question.sourceUrl === CAMBRIDGE_B2_FIRST_SOURCE_URL)).toBe(true);
  });

  it("contains Listening Parts with original speech scripts", () => {
    expect(listening.length).toBeGreaterThanOrEqual(8);
    expect(new Set(listening.map((question) => question.part))).toEqual(
      new Set(["Part 1", "Part 2", "Part 3", "Part 4"]),
    );
    expect(listening.every((question) => Boolean(question.audioScript))).toBe(true);
    expect(listening.every((question) => question.questionType)).toBe(true);
  });

  it("keeps stable ids, four options, valid answers and source labels", () => {
    const ids = CAMBRIDGE_B2_FIRST_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    CAMBRIDGE_B2_FIRST_QUESTIONS.forEach((question) => {
      expect(question.id).toMatch(/^CB2F-(RUE|LIS)-\d{3}$/);
      expect(question.options).toHaveLength(4);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(4);
      expect(question.source).toContain("原創仿真題");
    });
  });
});
