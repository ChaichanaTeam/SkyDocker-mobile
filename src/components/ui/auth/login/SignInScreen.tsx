import { SocialButton } from "@/components/shared/auth/SocialButton";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { PasswordRequirementList } from "@/components/ui/auth/signup/PasswordScreen/features/PasswordRequirementsList";
import { isPasswordValid } from "@/validators/password.schema";
import { signIn } from "@app/api/services/auth.service";
import { isApiError } from "@app/api/types/apiError";
import { colors } from "@/theme";
import {
  getEmailValidationError,
  normalizeEmail,
} from "@/validators/email.schema";
import { icons } from "@assets/icons";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";

export const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const submitting = useRef(false);
  const passwordValid = isPasswordValid(password);
  const EyeIcon = icons.Eye;
  const EyeOffIcon = icons.EyeOff;

  const handleSignIn = async () => {
    if (submitting.current) return;
    setHasSubmitted(true);
    setFormError(null);
    const validationError = getEmailValidationError(email);
    setEmailError(validationError);
    if (!passwordValid) {
      setFormError("Enter a password that meets all requirements");
    }
    if (validationError || !passwordValid) return;

    submitting.current = true;
    setIsSigningIn(true);
    try {
      await signIn({ email: normalizeEmail(email), password });
      router.replace("/(tabs)");
    } catch (error) {
      setFormError(isApiError(error) ? error.message : "Unable to sign in right now");
    } finally {
      submitting.current = false;
      setIsSigningIn(false);
    }
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

      <View style={[styles.inputWrapper, { maxWidth: "100%" }]}>
        <View style={[styles.container, { width: "100%" }, emailError && styles.containerInvalid]}>
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

      <View style={[styles.inputWrapper, { marginTop: 20, maxWidth: "100%" }]}>
        <View style={[styles.container, { width: "100%" },
          (hasSubmitted || password.length > 0) &&
            (passwordValid ? styles.containerValid : styles.containerInvalid),
        ]}>
          <TextField style={styles.label} variant="label">Password</TextField>
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}>
            <InputField
              style={[styles.passwordInput, { flex: 1, paddingLeft: 0, paddingRight: 0 }]}
              value={password}
              onChangeText={(value) => { setPassword(value); setFormError(null); }}
              placeholder="Password"
              placeholderTextColor={colors.backgroundWhite80}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button variant="text" activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPassword ? <EyeIcon width={20} height={20} color={colors.backgroundWhite80} /> :
                <EyeOffIcon width={20} height={20} color={colors.backgroundWhite80} />}
            </Button>
          </View>
        </View>
      </View>

      <Link href="/(auth)/forgot-password" asChild>
        <Button
          style={styles.forgotPasswordLink}
          variant="text"
          activeOpacity={0.7}
        >
          <TextField style={styles.forgotPasswordText}>Forgot the password</TextField>
        </Button>
      </Link>
      {password.length > 0 && !passwordValid && (
        <PasswordRequirementList password={password} style={{ maxWidth: "100%" }} />
      )}
      {formError && <TextField style={styles.errorText} variant="error">{formError}</TextField>}

      <Button
        variant="primary"
        size="large"
        style={{ marginTop: 24, maxWidth: "100%" }}
        onPress={handleSignIn}
        loading={isSigningIn}
        disabled={isSigningIn}
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

      <View style={[styles.dividerRow, { maxWidth: "100%" }]}>
        <View style={styles.dividerLine} />
        <TextField style={styles.dividerText}>OR</TextField>
        <View style={styles.dividerLine} />
      </View>

      <View style={[styles.socialList, { maxWidth: "100%" }]}>
        <SocialButton
          style={{ width: "100%" }}
          label="Continue with Google"
          Icon={icons.Google}
          iconWidth={19}
          iconHeight={20}
          color={colors.backgroundWhite}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
};
