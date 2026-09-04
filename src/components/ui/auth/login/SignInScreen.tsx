import { SocialButton } from "@/components/shared/auth/SocialButton";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import {
  getEmailValidationError,
  normalizeEmail,
} from "@/validators/email.schema";
import { icons } from "@assets/icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSignIn = () => {
    const validationError = getEmailValidationError(email);

    if (validationError) {
      setEmailError(validationError);
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    setEmailError(null);

    router.push({
      pathname: "/(auth)/passcreen",
      params: { mode: "single", email: normalizedEmail },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextField style={styles.title} variant="title">
        Sign In
      </TextField>
      <TextField style={styles.subtitle} variant="subtitle">
        You do have an account, right?
      </TextField>

      <View style={styles.inputWrapper}>
        <View style={[styles.container, emailError && styles.containerInvalid]}>
          <TextField style={styles.label} variant="label">
            Email
          </TextField>

          <InputField
            value={email}
            style={styles.emailInput}
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) {
                setEmailError(getEmailValidationError(value));
              }
            }}
            placeholder="name@example.com"
            placeholderTextColor={colors.backgroundWhite80}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {emailError && (
          <TextField style={styles.errorText} variant="error">
            {emailError}
          </TextField>
        )}
      </View>

      <TextField style={styles.hint} variant="hint">
        Enter the email linked to your account
      </TextField>

      <Button
        variant="primary"
        size="large"
        onPress={handleSignIn}
        text="Sign In"
      />

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Button
          variant="text"
          size="small"
          onPress={() => router.push("/(auth)/signup")}
        >
          <TextField
            variant="body"
            style={{ color: colors.backgroundWhite80, fontSize: 14 }}
          >
            Dont have an account?{" "}
            <TextField
              variant="link"
              style={{
                color: colors.backgroundWhite,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              Sign Up
            </TextField>
          </TextField>
        </Button>
      </View>

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
