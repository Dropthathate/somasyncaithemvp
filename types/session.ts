export type SessionType = "initial" | "followup" | "maintenance";

export type SessionStatus = "active" | "completed";

export interface Finding {
  id: string;
  timestamp: number; // milliseconds from session start
  text: string;
  createdAt: Date;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface Session {
  id: string;
  clientName: string;
  sessionType: SessionType;
  status: SessionStatus;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  findings: Finding[];
  soapNote: SOAPNote;
  audioFileUri?: string;
  notes?: string;
}

export interface SessionSummary {
  id: string;
  clientName: string;
  sessionType: SessionType;
  date: Date;
  duration: number;
  findingsCount: number;
}
