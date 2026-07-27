import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const PilotIdScreen = () => {
  const [pilotId, setPilotId] = useState("");
  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    router.push("/(auth)/phonenumscreen");
  };
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Enter Pilot ID</Text>
      <Text style={styles.subtitle}>
        To continue, prove us that you have permission
      </Text>

      <View style={styles.inputWrapper}>
        <View style={styles.container}>
          <Text style={styles.label}>Pilot ID</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={styles.passwordInput}
              value={pilotId}
              onChangeText={setPilotId}
              placeholder="POL-p-xxxxxxxxxxxx"
              placeholderTextColor="#FFFFFF80"
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
