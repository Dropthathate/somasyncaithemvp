/**
 * Voice command patterns for clinical documentation
 * These patterns help extract structured findings from transcribed text
 */
export const VOICE_COMMAND_PATTERNS = {
  mark: /^mark:\s*(.+)$/i,
  note: /^note:\s*(.+)$/i,
  pain: /^pain:\s*(.+)$/i,
  referral: /^referral:\s*(.+)$/i,
  restriction: /^restriction:\s*(.+)$/i,
  triggerPoint: /^trigger\s*point:\s*(.+)$/i,
  length: /^length:\s*(.+)$/i,
  strength: /^strength:\s*(.+)$/i,
  rom: /^rom:\s*(.+)$/i,
};

export type VoiceCommandType = keyof typeof VOICE_COMMAND_PATTERNS;

/**
 * Parsed voice command from transcribed text
 */
export interface ParsedVoiceCommand {
  type: VoiceCommandType | null;
  text: string;
  isCommand: boolean;
}

/**
 * Parse transcribed text to extract voice commands
 * Examples:
 * - "mark: left levator scapulae tension" → type: "mark", text: "left levator scapulae tension"
 * - "rom: 90 degrees" → type: "rom", text: "90 degrees"
 * - "This is just regular speech" → type: null, isCommand: false
 */
export function parseVoiceCommand(text: string): ParsedVoiceCommand {
  const trimmed = text.trim();

  // Check each pattern
  for (const [type, pattern] of Object.entries(VOICE_COMMAND_PATTERNS)) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        type: type as VoiceCommandType,
        text: match[1].trim(),
        isCommand: true,
      };
    }
  }

  // No command pattern matched
  return {
    type: null,
    text: trimmed,
    isCommand: false,
  };
}

/**
 * Format a voice command for display in the UI
 */
export function formatVoiceCommand(command: ParsedVoiceCommand): string {
  if (!command.isCommand) {
    return command.text;
  }

  const typeLabel = command.type
    ? command.type.charAt(0).toUpperCase() + command.type.slice(1)
    : "Note";

  return `${typeLabel}: ${command.text}`;
}

/**
 * Extract anatomical terms from transcribed text
 * This helps identify body parts and structures mentioned
 */
export const ANATOMICAL_TERMS = [
  // Muscles
  "levator scapulae",
  "trapezius",
  "rhomboid",
  "pectoralis",
  "latissimus dorsi",
  "deltoid",
  "rotator cuff",
  "biceps",
  "triceps",
  "forearm",
  "wrist",
  "hand",
  "finger",
  "thumb",
  "palm",
  "erector spinae",
  "quadratus lumborum",
  "psoas",
  "glute",
  "hamstring",
  "quadriceps",
  "calf",
  "tibialis",
  "peroneal",
  "soleus",
  "gastrocnemius",
  "adductor",
  "abductor",
  "hip",
  "knee",
  "ankle",
  "foot",
  "toe",
  "heel",
  "plantar fascia",
  "achilles",
  "neck",
  "cervical",
  "thoracic",
  "lumbar",
  "sacral",
  "coccyx",
  "sternum",
  "ribs",
  "intercostal",
  "jaw",
  "temporalis",
  "masseter",
  "sternocleidomastoid",
  "scalene",

  // Joints
  "shoulder",
  "elbow",
  "wrist",
  "hip",
  "knee",
  "ankle",
  "spine",
  "vertebra",
  "disc",
  "sacroiliac",
  "temporomandibular",
  "tmj",
  "glenohumeral",
  "acromioclavicular",
  "sternoclavicular",

  // Conditions/Findings
  "tension",
  "tightness",
  "restriction",
  "trigger point",
  "knot",
  "spasm",
  "weakness",
  "pain",
  "tenderness",
  "swelling",
  "inflammation",
  "stiffness",
  "limited range",
  "rom",
  "degrees",
  "referral",
  "radiation",
];

/**
 * Extract anatomical terms from text
 */
export function extractAnatomicalTerms(text: string): string[] {
  const lowerText = text.toLowerCase();
  const found: string[] = [];

  for (const term of ANATOMICAL_TERMS) {
    if (lowerText.includes(term.toLowerCase())) {
      found.push(term);
    }
  }

  return Array.from(new Set(found)); // Remove duplicates
}

/**
 * Confidence score for transcription quality
 * Returns 0-1 where 1 is highest confidence
 */
export function calculateTranscriptionConfidence(
  text: string,
  hasCommand: boolean,
  anatomicalTermCount: number
): number {
  let confidence = 0.5; // Base confidence

  // Longer text is generally more reliable
  if (text.length > 20) confidence += 0.2;
  if (text.length > 50) confidence += 0.1;

  // Commands are more structured and reliable
  if (hasCommand) confidence += 0.2;

  // Anatomical terms indicate clinical context
  if (anatomicalTermCount > 0) confidence += 0.1 * Math.min(anatomicalTermCount, 3);

  return Math.min(confidence, 1.0);
}

/**
 * Session transcription state
 */
export interface TranscriptionState {
  isTranscribing: boolean;
  currentTranscript: string;
  fullTranscript: string;
  lastCommand: ParsedVoiceCommand | null;
  commandCount: number;
  error: string | null;
}

/**
 * Initialize transcription state
 */
export function initializeTranscriptionState(): TranscriptionState {
  return {
    isTranscribing: false,
    currentTranscript: "",
    fullTranscript: "",
    lastCommand: null,
    commandCount: 0,
    error: null,
  };
}
