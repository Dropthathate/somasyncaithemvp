import { describe, it, expect } from "vitest";
import {
  parseVoiceCommand,
  formatVoiceCommand,
  extractAnatomicalTerms,
  calculateTranscriptionConfidence,
  initializeTranscriptionState,
} from "../lib/transcription-service";

describe("Voice Command Parser", () => {
  it("should parse mark command", () => {
    const result = parseVoiceCommand("mark: left levator scapulae tension");
    expect(result.isCommand).toBe(true);
    expect(result.type).toBe("mark");
    expect(result.text).toBe("left levator scapulae tension");
  });

  it("should parse note command", () => {
    const result = parseVoiceCommand("note: client reports pain in shoulder");
    expect(result.isCommand).toBe(true);
    expect(result.type).toBe("note");
    expect(result.text).toBe("client reports pain in shoulder");
  });

  it("should parse pain command", () => {
    const result = parseVoiceCommand("pain: 7 out of 10");
    expect(result.isCommand).toBe(true);
    expect(result.type).toBe("pain");
    expect(result.text).toBe("7 out of 10");
  });

  it("should parse ROM command", () => {
    const result = parseVoiceCommand("rom: 90 degrees");
    expect(result.isCommand).toBe(true);
    expect(result.type).toBe("rom");
    expect(result.text).toBe("90 degrees");
  });

  it("should handle case-insensitive commands", () => {
    const result = parseVoiceCommand("MARK: test finding");
    expect(result.isCommand).toBe(true);
    expect(result.type).toBe("mark");
  });

  it("should identify non-commands", () => {
    const result = parseVoiceCommand("This is just regular speech");
    expect(result.isCommand).toBe(false);
    expect(result.type).toBeNull();
  });

  it("should handle extra whitespace", () => {
    const result = parseVoiceCommand("  mark:   left shoulder tension  ");
    expect(result.isCommand).toBe(true);
    expect(result.text).toBe("left shoulder tension");
  });
});

describe("Voice Command Formatter", () => {
  it("should format command with type label", () => {
    const command = {
      type: "mark" as const,
      text: "left levator scapulae tension",
      isCommand: true,
    };
    const formatted = formatVoiceCommand(command);
    expect(formatted).toBe("Mark: left levator scapulae tension");
  });

  it("should format non-command as plain text", () => {
    const command = {
      type: null,
      text: "regular speech",
      isCommand: false,
    };
    const formatted = formatVoiceCommand(command);
    expect(formatted).toBe("regular speech");
  });
});

describe("Anatomical Term Extraction", () => {
  it("should extract single anatomical term", () => {
    const terms = extractAnatomicalTerms("left levator scapulae tension");
    expect(terms).toContain("levator scapulae");
  });

  it("should extract multiple anatomical terms", () => {
    const terms = extractAnatomicalTerms("trapezius and rhomboid tension with trigger points");
    expect(terms).toContain("trapezius");
    expect(terms).toContain("rhomboid");
    expect(terms).toContain("trigger point");
  });

  it("should be case-insensitive", () => {
    const terms = extractAnatomicalTerms("LEFT SHOULDER PAIN");
    expect(terms).toContain("shoulder");
    expect(terms).toContain("pain");
  });

  it("should remove duplicates", () => {
    const terms = extractAnatomicalTerms("shoulder pain in shoulder");
    const shoulderCount = terms.filter((t) => t === "shoulder").length;
    expect(shoulderCount).toBe(1);
  });

  it("should return empty array for non-anatomical text", () => {
    const terms = extractAnatomicalTerms("the weather is nice today");
    expect(terms.length).toBe(0);
  });
});

describe("Transcription Confidence Scoring", () => {
  it("should give higher confidence for commands", () => {
    const withCommand = calculateTranscriptionConfidence("mark: finding", true, 1);
    const withoutCommand = calculateTranscriptionConfidence("mark: finding", false, 1);
    expect(withCommand).toBeGreaterThan(withoutCommand);
  });

  it("should give higher confidence for longer text", () => {
    const short = calculateTranscriptionConfidence("mark", false, 0);
    const long = calculateTranscriptionConfidence(
      "mark: left levator scapulae tension with trigger points noted",
      false,
      0
    );
    expect(long).toBeGreaterThan(short);
  });

  it("should give higher confidence for anatomical terms", () => {
    const withTerms = calculateTranscriptionConfidence("mark: shoulder pain", false, 2);
    const withoutTerms = calculateTranscriptionConfidence("mark: something", false, 0);
    expect(withTerms).toBeGreaterThan(withoutTerms);
  });

  it("should cap confidence at 1.0", () => {
    const confidence = calculateTranscriptionConfidence(
      "mark: very long text with multiple anatomical terms",
      true,
      5
    );
    expect(confidence).toBeLessThanOrEqual(1.0);
  });
});

describe("Transcription State Initialization", () => {
  it("should initialize with default values", () => {
    const state = initializeTranscriptionState();
    expect(state.isTranscribing).toBe(false);
    expect(state.currentTranscript).toBe("");
    expect(state.fullTranscript).toBe("");
    expect(state.lastCommand).toBeNull();
    expect(state.commandCount).toBe(0);
    expect(state.error).toBeNull();
  });
});
