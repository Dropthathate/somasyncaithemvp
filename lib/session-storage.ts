import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, SessionSummary } from "@/types/session";

const SESSIONS_KEY = "somasync_sessions";
const SESSION_PREFIX = "somasync_session_";

/**
 * Get all session summaries (lightweight list for history view)
 */
export async function getSessionSummaries(): Promise<SessionSummary[]> {
  try {
    const summariesJson = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!summariesJson) return [];
    return JSON.parse(summariesJson);
  } catch (error) {
    console.error("Error loading session summaries:", error);
    return [];
  }
}

/**
 * Get full session data by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const sessionJson = await AsyncStorage.getItem(`${SESSION_PREFIX}${sessionId}`);
    if (!sessionJson) return null;
    const session = JSON.parse(sessionJson);
    // Convert date strings back to Date objects
    session.startTime = new Date(session.startTime);
    if (session.endTime) session.endTime = new Date(session.endTime);
    session.findings = session.findings.map((f: any) => ({
      ...f,
      createdAt: new Date(f.createdAt),
    }));
    return session;
  } catch (error) {
    console.error("Error loading session:", error);
    return null;
  }
}

/**
 * Save or update a session
 */
export async function saveSession(session: Session): Promise<void> {
  try {
    // Save full session data
    await AsyncStorage.setItem(`${SESSION_PREFIX}${session.id}`, JSON.stringify(session));

    // Update summaries list
    const summaries = await getSessionSummaries();
    const existingIndex = summaries.findIndex((s) => s.id === session.id);
    
    const summary: SessionSummary = {
      id: session.id,
      clientName: session.clientName,
      sessionType: session.sessionType,
      date: session.startTime,
      duration: session.duration,
      findingsCount: session.findings.length,
    };

    if (existingIndex >= 0) {
      summaries[existingIndex] = summary;
    } else {
      summaries.unshift(summary); // Add to beginning
    }

    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(summaries));
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    // Delete full session data
    await AsyncStorage.removeItem(`${SESSION_PREFIX}${sessionId}`);

    // Update summaries list
    const summaries = await getSessionSummaries();
    const filtered = summaries.filter((s) => s.id !== sessionId);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

/**
 * Search sessions by client name
 */
export async function searchSessions(query: string): Promise<SessionSummary[]> {
  const summaries = await getSessionSummaries();
  const lowerQuery = query.toLowerCase();
  return summaries.filter((s) => s.clientName.toLowerCase().includes(lowerQuery));
}
