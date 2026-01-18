import { Text, View, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { getSessionSummaries, searchSessions } from "@/lib/session-storage";
import { formatSessionDate, formatDuration } from "@/lib/soap-generator";
import { SessionSummary } from "@/types/session";

export default function HistoryScreen() {
  const router = useRouter();
  const colors = useColors();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSessions(sessions);
    } else {
      performSearch(searchQuery);
    }
  }, [searchQuery, sessions]);

  const loadSessions = async () => {
    try {
      const summaries = await getSessionSummaries();
      setSessions(summaries);
      setFilteredSessions(summaries);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      const results = await searchSessions(query);
      setFilteredSessions(results);
    } catch (error) {
      console.error("Error searching sessions:", error);
    }
  };

  const handleViewSession = (sessionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/session/review?id=${sessionId}` as any);
  };

  const renderSessionItem = ({ item }: { item: SessionSummary }) => (
    <TouchableOpacity
      onPress={() => handleViewSession(item.id)}
      style={{ opacity: 1 }}
      activeOpacity={0.7}
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 gap-1">
          <Text className="text-lg font-semibold text-foreground">{item.clientName}</Text>
          <Text className="text-sm text-muted">
            {formatSessionDate(new Date(item.date))} • {formatDuration(item.duration)}
          </Text>
          <Text className="text-xs text-muted capitalize">
            {item.sessionType.replace("_", " ")} • {item.findingsCount} finding
            {item.findingsCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-4">
        {/* Header */}
        <Text className="text-3xl font-bold text-foreground">Session History</Text>

        {/* Search Bar */}
        <View className="bg-surface rounded-xl px-4 py-3 flex-row items-center gap-3 border border-border">
          <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
          <TextInput
            placeholder="Search by client name..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-base text-foreground"
            returnKeyType="search"
          />
        </View>

        {/* Sessions List */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Loading sessions...</Text>
          </View>
        ) : filteredSessions.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-2">
            <IconSymbol name="doc.text.fill" size={48} color={colors.muted} />
            <Text className="text-muted text-center">
              {searchQuery ? "No sessions found matching your search." : "No sessions yet."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSessions}
            renderItem={renderSessionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
