import { Text, View, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { SessionType, Finding, Session } from "@/types/session";
import { formatDuration } from "@/lib/soap-generator";

export default function ActiveSessionScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  
  const clientName = params.clientName as string;
  const sessionType = params.sessionType as SessionType;
  const initialNotes = params.notes as string | undefined;

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [transcriptionPreview, setTranscriptionPreview] = useState("");
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulsing animation for recording indicator
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    startRecording();
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Microphone access is required to record sessions.");
        router.back();
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      
      recordingRef.current = recording;
      setIsRecording(true);
      startTimeRef.current = new Date();

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Simulate transcription preview (for MVP)
      setTimeout(() => {
        setTranscriptionPreview("Listening... Say 'mark' to flag findings.");
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Recording Error", "Failed to start recording. Please try again.");
      router.back();
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const handleMarkFinding = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const finding: Finding = {
      id: `finding_${Date.now()}`,
      timestamp: duration * 1000, // Convert to milliseconds
      text: `Finding marked at ${formatDuration(duration)}`,
      createdAt: new Date(),
    };

    setFindings((prev) => [...prev, finding]);
    setTranscriptionPreview(`✓ Finding marked (${findings.length + 1})`);

    // Reset preview after 2 seconds
    setTimeout(() => {
      setTranscriptionPreview("Listening... Say 'mark' to flag findings.");
    }, 2000);
  };

  const handleEndSession = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.alert(
      "End Session",
      "Are you sure you want to end this session? A SOAP note will be generated for review.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            await stopRecording();
            
            // Create session ID
            const sessionId = `session_${Date.now()}`;
            
            // Navigate to review with session data
            router.replace({
              pathname: "/session/review" as any,
              params: {
                sessionId,
                clientName,
                sessionType,
                duration: duration.toString(),
                findingsCount: findings.length.toString(),
                notes: initialNotes || "",
                isNew: "true",
              },
            });
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Recording Indicator */}
          <View className="items-center gap-3">
            <Animated.View
              style={[
                pulseStyle,
                {
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#EF4444",
                },
              ]}
            />
            <Text className="text-lg font-semibold text-foreground">Recording</Text>
          </View>

          {/* Session Info */}
          <View className="bg-surface rounded-xl p-4 border border-border gap-2">
            <Text className="text-base font-semibold text-foreground">{clientName}</Text>
            <Text className="text-sm text-muted capitalize">
              {sessionType.replace("_", " ")} Session
            </Text>
          </View>

          {/* Timer */}
          <View className="items-center">
            <Text className="text-5xl font-bold text-foreground">{formatDuration(duration)}</Text>
          </View>

          {/* Transcription Preview */}
          <View className="bg-surface rounded-xl p-4 border border-border min-h-[100px]">
            <Text className="text-sm text-muted mb-2">Live Transcription:</Text>
            <Text className="text-base text-foreground">{transcriptionPreview}</Text>
          </View>

          {/* Voice Command Hints */}
          <View className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <Text className="text-sm font-semibold text-primary mb-2">Voice Commands:</Text>
            <Text className="text-sm text-foreground">
              Say "mark" followed by your finding, or tap the button below.
            </Text>
          </View>

          {/* Findings Counter */}
          <View className="flex-row items-center justify-center gap-2">
            <IconSymbol name="doc.text.fill" size={20} color={colors.muted} />
            <Text className="text-base text-muted">
              {findings.length} finding{findings.length !== 1 ? "s" : ""} marked
            </Text>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleMarkFinding}
              activeOpacity={0.9}
              className="bg-primary rounded-2xl py-4 items-center flex-row justify-center gap-2"
            >
              <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
              <Text className="text-lg font-bold text-white">Mark Finding</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEndSession}
              activeOpacity={0.7}
              className="bg-surface rounded-2xl py-4 items-center border border-border"
            >
              <Text className="text-base font-semibold text-foreground">End Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
