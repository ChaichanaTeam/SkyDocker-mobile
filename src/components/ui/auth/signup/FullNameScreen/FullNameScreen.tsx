import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import { useSignUp } from "@app/api/context/SignUpContext";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export const FullNameScreen = () => {
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  const { submitProfile, isSubmitting, error } = useSignUp();

  const handleBack = () => {
    router.back();
  };

  const handleNext = async () => {
    if (!name.trim() || !secondName.trim() || isSubmitting) return;

    try {
      await submitProfile(name.trim(), secondName.trim());
      router.push("/(auth)/signin");
    } catch {}
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextField style={styles.title} variant="title">
        And to finish this up
      </TextField>
      <TextField style={styles.subtitle} variant="subtitle">
        Please enter your name to finish registration
      </TextField>

      <View style={styles.inputWrapper}>
        <View style={styles.container}>
          <TextField style={styles.label} variant="label">
            Name
          </TextField>
          <InputField
            style={[styles.passwordInput]}
            value={name}
            onChangeText={setName}
            placeholder="Anatoly"
            placeholderTextColor={colors.backgroundWhite80}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={[styles.inputWrapper, { marginTop: 50 }]}>
        <View style={styles.container}>
          <TextField style={styles.label} variant="label">
            Second name
          </TextField>
          <InputField
            style={[styles.passwordInput]}
            value={secondName}
            onChangeText={setSecondName}
            placeholder="Fisher"
            placeholderTextColor={colors.backgroundWhite80}
            autoCapitalize="words"
          />
        </View>
      </View>

      {error && (
        <TextField style={styles.errorText} variant="error">
          {error.message}
        </TextField>
      )}

      <View style={styles.bottomRow}>
        <Button
          text="Back"
          onPress={handleBack}
          size="small"
          variant="text"
          activeOpacity={0.7}
        />

        <Button
          text="Next"
          onPress={handleNext}
          disabled={!name.trim() || !secondName.trim()}
          loading={isSubmitting}
          size="small"
          variant="secondary"
          activeOpacity={0.8}
        />
      </View>
    </ScrollView>
  );
};
