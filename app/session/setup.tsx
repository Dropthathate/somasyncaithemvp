import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { SessionType } from "@/types/session";

export default function SessionSetupScreen() {
  const router = useRouter();
  const colors = useColors();
  const [clientName, setClientName] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>("initial");
  const [notes, setNotes] = useState("");

  const handleBeginRecording = async () => {
    if (!clientName.trim()) {
      Alert.alert("Client Name Required", "Please enter a client name to continue.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to active session with params
    router.push({
      pathname: "/session/active" as any,
      params: {
        clientName: clientName.trim(),
        sessionType,
        notes: notes.trim(),
      },
    });
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const SessionTypeButton = ({ type, label }: { type: SessionType; label: string }) => {
    const isSelected = sessionType === type;
    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSessionType(type);
        }}
        activeOpacity={0.7}
        className={`flex-1 py-3 px-4 rounded-xl border-2 ${
          isSelected ? "bg-primary border-primary" : "bg-surface border-border"
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            isSelected ? "text-white" : "text-foreground"
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">New Session</Text>
            <Text className="text-base text-muted">
              Enter client information to begin recording
            </Text>
          </View>

          {/* Client Name Input */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-foreground">Client Name *</Text>
            <TextInput
              placeholder="Enter client name"
              placeholderTextColor={colors.muted}
              value={clientName}
              onChangeText={setClientName}
              className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
              autoFocus
              returnKeyType="next"
            />
          </View>

          {/* Session Type Selector */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-foreground">Session Type</Text>
            <View className="flex-row gap-2">
              <SessionTypeButton type="initial" label="Initial" />
              <SessionTypeButton type="followup" label="Follow-up" />
              <SessionTypeButton type="maintenance" label="Maintenance" />
            </View>
          </View>

          {/* Optional Notes */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-foreground">Notes (Optional)</Text>
            <TextInput
              placeholder="Any pre-session notes..."
              placeholderTextColor={colors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
              returnKeyType="done"
            />
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleBeginRecording}
              activeOpacity={0.9}
              className="bg-primary rounded-2xl py-4 items-center"
            >
              <Text className="text-lg font-bold text-white">Begin Recording</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.7}
              className="bg-surface rounded-2xl py-4 items-center border border-border"
            >
              <Text className="text-base font-semibold text-foreground">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
