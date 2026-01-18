import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();

  const handleAbout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "About SomaSync",
      "SomaSync AI v1.0\n\nAI-powered clinical documentation assistant for massage therapists and manual clinicians.\n\nDeveloped for hands-free SOAP note generation during treatment sessions.",
      [{ text: "OK" }]
    );
  };

  const handleHelp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Help & Support",
      "For assistance:\n\n1. Start a new session from the Home screen\n2. Enter client information\n3. Begin recording during your session\n4. Mark findings as you work\n5. Review and edit the AI-generated SOAP note\n6. Export or save to history\n\nFor technical support, please contact your administrator.",
      [{ text: "OK" }]
    );
  };

  const handlePrivacy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Privacy & Data",
      "Your data is stored locally on this device. Audio recordings and session notes are not uploaded to the cloud unless you explicitly enable cloud backup.\n\nAll data is encrypted and follows HIPAA best practices for healthcare data protection.",
      [{ text: "OK" }]
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <Text className="text-3xl font-bold text-foreground">Settings</Text>

          {/* Settings Sections */}
          <View className="gap-4">
            {/* Audio Settings */}
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">Audio</Text>
              <View className="gap-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-foreground">Microphone Quality</Text>
                  <Text className="text-sm text-muted">High</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-foreground">Auto-save Recordings</Text>
                  <Text className="text-sm text-muted">Enabled</Text>
                </View>
              </View>
            </View>

            {/* Data & Privacy */}
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">Data & Privacy</Text>
              <View className="gap-3">
                <TouchableOpacity
                  onPress={handlePrivacy}
                  activeOpacity={0.7}
                  className="flex-row justify-between items-center"
                >
                  <Text className="text-base text-foreground">Privacy Policy</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-foreground">Data Retention</Text>
                  <Text className="text-sm text-muted">365 days</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-foreground">Cloud Backup</Text>
                  <Text className="text-sm text-muted">Disabled</Text>
                </View>
              </View>
            </View>

            {/* Export Settings */}
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">Export</Text>
              <View className="gap-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-foreground">Default Format</Text>
                  <Text className="text-sm text-muted">PDF</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-foreground">Include Audio</Text>
                  <Text className="text-sm text-muted">No</Text>
                </View>
              </View>
            </View>

            {/* About & Help */}
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">About</Text>
              <View className="gap-3">
                <TouchableOpacity
                  onPress={handleHelp}
                  activeOpacity={0.7}
                  className="flex-row justify-between items-center"
                >
                  <Text className="text-base text-foreground">Help & Support</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAbout}
                  activeOpacity={0.7}
                  className="flex-row justify-between items-center"
                >
                  <Text className="text-base text-foreground">About SomaSync</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-foreground">Version</Text>
                  <Text className="text-sm text-muted">1.0.0 (MVP)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
