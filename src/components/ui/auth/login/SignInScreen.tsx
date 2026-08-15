import { SocialButton } from "@/components/shared/auth/SocialButton";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { colors } from "@/theme";
import {
  getEmailValidationError,
  normalizeEmail,
} from "@/validators/email.schema";
import { icons } from "@assets/icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>You do have an account, right?</Text>

      <View style={styles.inputWrapper}>
        <View style={[styles.container, emailError && styles.containerInvalid]}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) {
                setEmailError(getEmailValidationError(value));
              }
            }}
            placeholder="name@example.com"
            placeholderTextColor={colors.backgroundWhite80}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      <Text style={styles.hint}>
        Enter the email linked to your account
      </Text>

      <TouchableOpacity
        style={styles.signInButton}
        activeOpacity={0.8}
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={{ color: colors.backgroundWhite80, fontSize: 14 }}>
              Dont have an account?{" "}
              <Text
                style={{ color: colors.backgroundWhite, fontWeight: "600" }}
              >
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
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
