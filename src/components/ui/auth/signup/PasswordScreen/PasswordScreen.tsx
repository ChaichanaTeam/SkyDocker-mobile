import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { PasswordRequirementList } from "@/components/ui/auth/signup/PasswordScreen/features/PasswordRequirementsList";
import type { PasswordScreenProps } from "@/components/ui/auth/signup/PasswordScreen/types";
import { colors } from "@/theme";
import {
  getEmailValidationError,
  normalizeEmail,
} from "@/validators/email.schema";
import { isPasswordValid } from "@/validators/password.schema";
import { useSignUp } from "@app/api/context/SignUpContext";
import { signIn } from "@app/api/services/auth.service";
import { isApiError } from "@app/api/types/apiError";
import { icons } from "@assets/icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export const PasswordScreen = ({
  email = "",
  mode = "multiple",
  variant = "default",
}: PasswordScreenProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const isMultipleMode = mode === "multiple";
  const isForgotPassword = variant === "forgot-password";
  const { setPassword: savePassword } = useSignUp();
  const normalizedEmail = normalizeEmail(email);
  const emailError = getEmailValidationError(normalizedEmail);

  const content = isForgotPassword
    ? {
        title: "Create new password",
        subtitle: "Prove us that only you have permission to use drones. Again",
        passwordLabel: "New password",
        passwordPlaceholder: "Example: Your favorite fruit",
        confirmPasswordLabel: "Confirm Password",
        confirmPasswordPlaceholder: "Sample",
      }
    : {
        title: "Enter Password",
        subtitle: "Prove us that only you have permission to use drones.",
        passwordLabel: "Password",
        passwordPlaceholder: "Password",
        confirmPasswordLabel: "Confirm Password",
        confirmPasswordPlaceholder: "Confirm password",
      };

  const passwordValid = isPasswordValid(password);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  const shouldShowPasswordValidation = isMultipleMode
    ? password.length > 0
    : hasSubmitted || password.length > 0;

  const passwordBorderStyle = !shouldShowPasswordValidation
    ? null
    : passwordValid
      ? styles.containerValid
      : styles.containerInvalid;

  const confirmBorderStyle =
    confirmPassword.length === 0
      ? null
      : passwordsMatch
        ? styles.containerValid
        : styles.containerInvalid;

  const handleBack = () => {
    router.back();
  };

  const handleNext = async () => {
    setHasSubmitted(true);
    setFormError(null);

    if (isForgotPassword) {
      router.replace("/(auth)/signin");
      return;
    }

    if (!isMultipleMode) {
      if (emailError) {
        setFormError(emailError);
        return;
      }

      if (!passwordValid || isSubmitting) {
        if (!passwordValid) {
          setFormError("Enter a password that meets all requirements");
        }
        return;
      }

      setIsSubmitting(true);
      try {
        await signIn({ email: normalizedEmail, password });
        router.replace("/(tabs)");
      } catch (error) {
        setFormError(
          isApiError(error) ? error.message : "Unable to sign in right now",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    savePassword(password);
    router.push("/(auth)/fullnamscreen");
  };

  const EyeIcon = icons.Eye;
  const EyeOffIcon = icons.EyeOff;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextField style={styles.title} variant="title">
        {content.title}
      </TextField>
      <TextField style={styles.subtitle} variant="subtitle">
        {content.subtitle}
      </TextField>

      <View style={styles.inputWrapper}>
        <View style={[styles.container, passwordBorderStyle]}>
          <TextField style={styles.label} variant="label">
            {content.passwordLabel}
          </TextField>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <InputField
              style={[
                styles.passwordInput,
                { flex: 1, paddingLeft: 0, paddingRight: 0 },
              ]}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (formError) {
                  setFormError(null);
                }
              }}
              placeholder={content.passwordPlaceholder}
              placeholderTextColor={colors.backgroundWhite80}
              secureTextEntry={!showPassword}
            />
            <Button
              variant="text"
              activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <EyeIcon
                  width={20}
                  height={20}
                  color={colors.backgroundWhite80}
                />
              ) : (
                <EyeOffIcon
                  width={20}
                  height={20}
                  color={colors.backgroundWhite80}
                />
              )}
            </Button>
          </View>
        </View>
      </View>

      {!isMultipleMode && (
        <Link href="/(auth)/forgot-password" asChild>
          <Button
            style={styles.forgotPasswordLink}
            variant="text"
            activeOpacity={0.7}
          >
            <TextField style={styles.forgotPasswordText}>
              Forgot the password
            </TextField>
          </Button>
        </Link>
      )}

      {!isMultipleMode && password.length > 0 && !passwordValid && (
        <PasswordRequirementList password={password} />
      )}

      {formError && (
        <TextField style={styles.errorText} variant="error">
          {formError}
        </TextField>
      )}

      {isMultipleMode && (
        <>
          <View style={[styles.inputWrapper, { marginTop: 20 }]}>
            <View style={[styles.container, confirmBorderStyle]}>
              <TextField style={styles.label} variant="label">
                {content.confirmPasswordLabel}
              </TextField>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                }}
              >
                <InputField
                  style={[
                    styles.passwordInput,
                    { flex: 1, paddingLeft: 0, paddingRight: 0 },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={content.confirmPasswordPlaceholder}
                  placeholderTextColor={colors.backgroundWhite80}
                  secureTextEntry={!showConfirmPassword}
                />
                <Button
                  variant="text"
                  activeOpacity={0.7}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showConfirmPassword ? (
                    <EyeIcon
                      width={20}
                      height={20}
                      color={colors.backgroundWhite80}
                    />
                  ) : (
                    <EyeOffIcon
                      width={20}
                      height={20}
                      color={colors.backgroundWhite80}
                    />
                  )}
                </Button>
              </View>
            </View>
          </View>

          <PasswordRequirementList password={password} />
        </>
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
          loading={isSubmitting}
          activeOpacity={0.8}
          disabled={
            isMultipleMode ? !passwordValid || !passwordsMatch : !passwordValid
          }
          onPress={handleNext}
          size="small"
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};
