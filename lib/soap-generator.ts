import { Finding, SOAPNote, SessionType } from "@/types/session";

/**
 * Generate a SOAP note from session findings
 * This is a template-based approach for MVP
 * Post-MVP will use LLM for more sophisticated generation
 */
export function generateSOAPNote(
  findings: Finding[],
  sessionType: SessionType,
  clientName: string
): SOAPNote {
  // Sort findings by timestamp
  const sortedFindings = [...findings].sort((a, b) => a.timestamp - b.timestamp);

  // Categorize findings based on keywords
  const subjective: string[] = [];
  const objective: string[] = [];
  const assessment: string[] = [];
  const plan: string[] = [];

  sortedFindings.forEach((finding) => {
    const text = finding.text.toLowerCase();
    
    // Subjective: pain, discomfort, client reports
    if (text.includes("pain") || text.includes("discomfort") || text.includes("reports") || text.includes("feels")) {
      subjective.push(finding.text);
    }
    // Objective: anatomical findings, ROM, palpation
    else if (
      text.includes("tension") ||
      text.includes("restriction") ||
      text.includes("trigger point") ||
      text.includes("rom") ||
      text.includes("degrees") ||
      text.includes("palpation") ||
      text.includes("muscle") ||
      text.includes("joint")
    ) {
      objective.push(finding.text);
    }
    // Assessment: analysis, likely causes
    else if (text.includes("likely") || text.includes("suggests") || text.includes("indicates") || text.includes("pattern")) {
      assessment.push(finding.text);
    }
    // Plan: treatment, recommendations, referral
    else if (
      text.includes("plan") ||
      text.includes("recommend") ||
      text.includes("referral") ||
      text.includes("follow-up") ||
      text.includes("treatment")
    ) {
      plan.push(finding.text);
    }
    // Default to objective if no clear category
    else {
      objective.push(finding.text);
    }
  });

  // Build SOAP note sections
  const subjectiveText = subjective.length > 0
    ? `Client: ${clientName}\nSession Type: ${formatSessionType(sessionType)}\n\n` +
      subjective.map((f, i) => `${i + 1}. ${f}`).join("\n")
    : `Client: ${clientName}\nSession Type: ${formatSessionType(sessionType)}\n\nNo subjective findings recorded.`;

  const objectiveText = objective.length > 0
    ? "Objective Findings:\n\n" + objective.map((f, i) => `${i + 1}. ${f}`).join("\n")
    : "No objective findings recorded.";

  const assessmentText = assessment.length > 0
    ? "Clinical Assessment:\n\n" + assessment.map((f, i) => `${i + 1}. ${f}`).join("\n")
    : generateDefaultAssessment(objective, sessionType);

  const planText = plan.length > 0
    ? "Treatment Plan:\n\n" + plan.map((f, i) => `${i + 1}. ${f}`).join("\n")
    : generateDefaultPlan(sessionType);

  return {
    subjective: subjectiveText,
    objective: objectiveText,
    assessment: assessmentText,
    plan: planText,
  };
}

function formatSessionType(type: SessionType): string {
  switch (type) {
    case "initial":
      return "Initial Assessment";
    case "followup":
      return "Follow-up Session";
    case "maintenance":
      return "Maintenance Session";
  }
}

function generateDefaultAssessment(objectiveFindings: string[], sessionType: SessionType): string {
  if (objectiveFindings.length === 0) {
    return "Assessment pending - no objective findings recorded.";
  }

  let assessment = "Clinical Assessment:\n\n";
  
  if (sessionType === "initial") {
    assessment += "Initial assessment reveals areas of concern that require attention. ";
  } else if (sessionType === "followup") {
    assessment += "Follow-up assessment shows progress from previous session. ";
  } else {
    assessment += "Maintenance session assessment indicates ongoing management needs. ";
  }

  assessment += "Findings suggest musculoskeletal imbalances that may benefit from targeted manual therapy techniques.";
  
  return assessment;
}

function generateDefaultPlan(sessionType: SessionType): string {
  let plan = "Treatment Plan:\n\n";
  
  if (sessionType === "initial") {
    plan += "1. Continue with manual therapy techniques addressing identified areas\n";
    plan += "2. Client education on self-care and home exercises\n";
    plan += "3. Recommend follow-up session in 1-2 weeks";
  } else if (sessionType === "followup") {
    plan += "1. Continue current treatment approach\n";
    plan += "2. Monitor progress and adjust techniques as needed\n";
    plan += "3. Schedule next follow-up as appropriate";
  } else {
    plan += "1. Maintain current treatment schedule\n";
    plan += "2. Continue preventive care and self-management strategies\n";
    plan += "3. Schedule maintenance session as needed";
  }
  
  return plan;
}

/**
 * Format duration in seconds to readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Format date for display
 */
export function formatSessionDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format time for display
 */
export function formatSessionTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
