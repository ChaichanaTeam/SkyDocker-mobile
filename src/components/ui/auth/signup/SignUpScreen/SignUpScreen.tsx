import { SocialButton } from "@/components/shared/auth/SocialButton";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import { useSignUp } from "@app/api/context/SignUpContext";
import { icons } from "@assets/icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
export const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const { setEmail: saveEmail, isSubmitting } = useSignUp();

  const handleSignUp = async () => {
    if (!email.trim()) return;
    try {
      await saveEmail(email.trim());
      router.push("/(auth)/confirm-email");
    } catch {}
  };
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextField style={styles.title} variant="title">
        Sign Up
      </TextField>
      <TextField style={styles.subtitle} variant="subtitle">
        Let get you started
      </TextField>

      <View style={styles.inputWrapper}>
        <View style={styles.container}>
          <TextField style={styles.label} variant="label">
            Email
          </TextField>

          <InputField
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor={colors.backgroundWhite80}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <TextField style={styles.hint} variant="hint">
        We will send a confirmation link to your email
      </TextField>

      <Button
        variant="primary"
        size="large"
        onPress={handleSignUp}
        disabled={!email.trim() || isSubmitting}
        text="Sign Up"
      />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <TextField style={styles.dividerText}>OR</TextField>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialList}>
        <SocialButton
          label="Continue with Google"
          Icon={icons.Google}
          iconWidth={19}
          iconHeight={20}
          color={colors.backgroundWhite}
          onPress={() => {}}
        />
        <SocialButton
          label="Continue with Facebook"
          Icon={icons.Facebook}
          iconWidth={20}
          iconHeight={20}
          color={colors.backgroundWhite}
          onPress={() => {}}
        />
        <SocialButton
          label="Continue with X"
          Icon={icons.X}
          iconWidth={20}
          iconHeight={18}
          color={colors.backgroundWhite}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
};
