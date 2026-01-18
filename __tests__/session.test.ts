import { describe, it, expect, beforeEach } from "vitest";
import { generateSOAPNote, formatDuration, formatSessionDate } from "../lib/soap-generator";
import { Finding, SessionType } from "../types/session";

describe("SOAP Note Generator", () => {
  it("should generate a basic SOAP note structure", () => {
    const findings: Finding[] = [];
    const soapNote = generateSOAPNote(findings, "initial", "Test Client");

    expect(soapNote).toHaveProperty("subjective");
    expect(soapNote).toHaveProperty("objective");
    expect(soapNote).toHaveProperty("assessment");
    expect(soapNote).toHaveProperty("plan");
    expect(soapNote.subjective).toContain("Test Client");
    expect(soapNote.subjective).toContain("Initial Assessment");
  });

  it("should categorize findings correctly", () => {
    const findings: Finding[] = [
      {
        id: "1",
        timestamp: 1000,
        text: "Client reports pain in left shoulder",
        createdAt: new Date(),
      },
      {
        id: "2",
        timestamp: 2000,
        text: "Left levator scapulae tension noted on palpation",
        createdAt: new Date(),
      },
      {
        id: "3",
        timestamp: 3000,
        text: "ROM restriction to 90 degrees",
        createdAt: new Date(),
      },
    ];

    const soapNote = generateSOAPNote(findings, "followup", "Test Client");

    // Subjective should contain pain report
    expect(soapNote.subjective).toContain("pain");

    // Objective should contain tension and ROM findings
    expect(soapNote.objective).toContain("tension");
    expect(soapNote.objective).toContain("ROM");
  });

  it("should handle different session types", () => {
    const findings: Finding[] = [];

    const initialNote = generateSOAPNote(findings, "initial", "Client A");
    expect(initialNote.subjective).toContain("Initial Assessment");

    const followupNote = generateSOAPNote(findings, "followup", "Client B");
    expect(followupNote.subjective).toContain("Follow-up");

    const maintenanceNote = generateSOAPNote(findings, "maintenance", "Client C");
    expect(maintenanceNote.subjective).toContain("Maintenance");
  });
});

describe("Duration Formatter", () => {
  it("should format seconds correctly", () => {
    expect(formatDuration(30)).toBe("30s");
    expect(formatDuration(45)).toBe("45s");
  });

  it("should format minutes and seconds correctly", () => {
    expect(formatDuration(60)).toBe("1m 0s");
    expect(formatDuration(90)).toBe("1m 30s");
    expect(formatDuration(125)).toBe("2m 5s");
  });

  it("should format hours and minutes correctly", () => {
    expect(formatDuration(3600)).toBe("1h 0m");
    expect(formatDuration(3660)).toBe("1h 1m");
    expect(formatDuration(7200)).toBe("2h 0m");
  });
});

describe("Date Formatter", () => {
  it("should format dates correctly", () => {
    const date = new Date("2024-01-15T10:30:00");
    const formatted = formatSessionDate(date);
    expect(formatted).toMatch(/Jan 15, 2024/);
  });
});
