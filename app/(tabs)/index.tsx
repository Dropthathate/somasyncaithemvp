import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { getSessionSummaries } from "@/lib/session-storage";
import { formatSessionDate, formatDuration } from "@/lib/soap-generator";
import { SessionSummary } from "@/types/session";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentSessions();
  }, []);

  const loadRecentSessions = async () => {
    try {
      const summaries = await getSessionSummaries();
      setRecentSessions(summaries.slice(0, 5)); // Show only 5 most recent
    } catch (error) {
      console.error("Error loading recent sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/session/setup");
  };

  const handleViewSession = (sessionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/session/review?id=${sessionId}`);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">SomaSync</Text>
            <Text className="text-base text-muted">
              AI-powered clinical documentation for massage therapists
            </Text>
          </View>

          {/* Start New Session Button */}
          <TouchableOpacity
            onPress={handleStartSession}
            activeOpacity={0.9}
            className="bg-primary rounded-2xl p-6 items-center gap-3 shadow-sm"
          >
            <IconSymbol name="plus.circle.fill" size={48} color="#FFFFFF" />
            <Text className="text-xl font-bold text-white">Start New Session</Text>
          </TouchableOpacity>

          {/* Recent Sessions */}
          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-foreground">Recent Sessions</Text>
              {recentSessions.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(tabs)/history" as any);
                  }}
                  activeOpacity={0.6}
                >
                  <Text className="text-sm text-primary font-semibold">View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {loading ? (
              <View className="bg-surface rounded-xl p-6 items-center">
                <Text className="text-muted">Loading sessions...</Text>
              </View>
            ) : recentSessions.length === 0 ? (
              <View className="bg-surface rounded-xl p-6 items-center gap-2">
                <IconSymbol name="doc.text.fill" size={32} color={colors.muted} />
                <Text className="text-muted text-center">
                  No sessions yet. Start your first session to begin documenting.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {recentSessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    onPress={() => handleViewSession(session.id)}
                    activeOpacity={0.7}
                    className="bg-surface rounded-xl p-4 border border-border"
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 gap-1">
                        <Text className="text-lg font-semibold text-foreground">
                          {session.clientName}
                        </Text>
                        <Text className="text-sm text-muted">
                          {formatSessionDate(new Date(session.date))} • {formatDuration(session.duration)}
                        </Text>
                        <Text className="text-xs text-muted">
                          {session.findingsCount} finding{session.findingsCount !== 1 ? "s" : ""}
                        </Text>
                      </View>
                      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
