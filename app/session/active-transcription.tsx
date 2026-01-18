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
import { SessionType, Finding } from "@/types/session";
import { formatDuration } from "@/lib/soap-generator";
import { parseVoiceCommand, extractAnatomicalTerms, formatVoiceCommand } from "@/lib/transcription-service";
import { trpc } from "@/lib/trpc";

export default function ActiveSessionTranscriptionScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();

  const clientName = params.clientName as string;
  const sessionType = params.sessionType as SessionType;
  const initialNotes = params.notes as string | undefined;

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptionMutation = trpc.transcription.transcribeAudio.useMutation();

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
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Microphone access is required to record sessions.");
        router.back();
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);
      startTimeRef.current = new Date();

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      setLiveTranscript("Listening... Transcription will appear here.");
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

  const handleTranscribeAudio = async () => {
    if (!audioUrl) {
      Alert.alert("Error", "No audio file available for transcription.");
      return;
    }

    setIsTranscribing(true);
    try {
      const result = await transcriptionMutation.mutateAsync({
        audioUrl,
        language: "en",
        prompt: "Clinical assessment notes for massage therapy session",
      });

      if (result.success) {
        const transcribedText = result.text || "";
        setLiveTranscript(transcribedText);

        // Parse voice commands from transcription
        const lines = transcribedText.split("\n").filter((line) => line.trim());
        const newFindings: Finding[] = [];

        lines.forEach((line) => {
          const parsed = parseVoiceCommand(line);
          if (parsed.isCommand) {
            const anatomicalTerms = extractAnatomicalTerms(parsed.text);
            const finding: Finding = {
              id: `finding_${Date.now()}_${Math.random()}`,
              timestamp: duration * 1000,
              text: formatVoiceCommand(parsed),
              createdAt: new Date(),
            };
            newFindings.push(finding);
            setLastCommand(formatVoiceCommand(parsed));
          }
        });

        if (newFindings.length > 0) {
          setFindings((prev) => [...prev, ...newFindings]);
        }
      }
    } catch (error) {
      console.error("Transcription error:", error);
      Alert.alert(
        "Transcription Error",
        error instanceof Error ? error.message : "Failed to transcribe audio"
      );
    } finally {
      setIsTranscribing(false);
    }
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

            const sessionId = `session_${Date.now()}`;

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

          {/* Live Transcription Display */}
          <View className="bg-surface rounded-xl p-4 border border-border min-h-[120px]">
            <Text className="text-sm text-muted mb-2 font-semibold">Live Transcription:</Text>
            <Text className="text-base text-foreground leading-relaxed">{liveTranscript}</Text>
          </View>

          {/* Last Command Display */}
          {lastCommand && (
            <View className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <Text className="text-sm font-semibold text-primary mb-1">Last Finding:</Text>
              <Text className="text-base text-foreground">{lastCommand}</Text>
            </View>
          )}

          {/* Findings Counter */}
          <View className="flex-row items-center justify-center gap-2">
            <IconSymbol name="doc.text.fill" size={20} color={colors.muted} />
            <Text className="text-base text-muted">
              {findings.length} finding{findings.length !== 1 ? "s" : ""} extracted
            </Text>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleTranscribeAudio}
              disabled={isTranscribing || !audioUrl}
              activeOpacity={0.9}
              className={`${isTranscribing ? "opacity-50" : ""} bg-primary rounded-2xl py-4 items-center flex-row justify-center gap-2`}
            >
              <IconSymbol name="waveform" size={24} color="#FFFFFF" />
              <Text className="text-lg font-bold text-white">
                {isTranscribing ? "Transcribing..." : "Transcribe Audio"}
              </Text>
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
