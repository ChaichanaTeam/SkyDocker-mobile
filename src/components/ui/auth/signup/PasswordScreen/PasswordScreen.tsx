import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { PasswordRequirementList } from "@/components/ui/auth/signup/PasswordScreen/features/PasswordRequirementsList";
import { colors } from "@/theme";
import {
  getEmailValidationError,
  normalizeEmail,
} from "@/validators/email.schema";
import { isPasswordValid } from "@/validators/password.schema";
import { signIn } from "@app/api/services/auth.service";
import { isApiError } from "@app/api/types/apiError";
import { useSignUp } from "@app/api/context/SignUpContext";
import { icons } from "@assets/icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export type PasswordScreenMode = "single" | "multiple";
export type PasswordScreenVariant = "default" | "forgot-password";

type PasswordScreenProps = {
  email?: string;
  mode?: PasswordScreenMode;
  variant?: PasswordScreenVariant;
};

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

  const shouldShowPasswordValidation =
    isMultipleMode ? password.length > 0 : hasSubmitted || password.length > 0;

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
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.subtitle}>{content.subtitle}</Text>

      <View style={styles.inputWrapper}>
        <View style={[styles.container, passwordBorderStyle]}>
          <Text style={styles.label}>{content.passwordLabel}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <TextInput
              style={[styles.passwordInput, { flex: 1, paddingHorizontal: 0 }]}
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
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {!isMultipleMode && (
        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity
            style={styles.forgotPasswordLink}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Forgot the password</Text>
          </TouchableOpacity>
        </Link>
      )}

      {!isMultipleMode && password.length > 0 && !passwordValid && (
        <PasswordRequirementList password={password} />
      )}

      {formError && <Text style={styles.errorText}>{formError}</Text>}

      {isMultipleMode && (
        <>
          <View style={[styles.inputWrapper, { marginTop: 20 }]}>
            <View style={[styles.container, confirmBorderStyle]}>
              <Text style={styles.label}>{content.confirmPasswordLabel}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                }}
              >
                <TextInput
                  style={[
                    styles.passwordInput,
                    { flex: 1, paddingHorizontal: 0 },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={content.confirmPasswordPlaceholder}
                  placeholderTextColor={colors.backgroundWhite80}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
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
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <PasswordRequirementList password={password} />
        </>
      )}

      <View style={styles.bottomRow}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
          disabled={
            isMultipleMode
              ? !passwordValid || !passwordsMatch
              : isSubmitting || !passwordValid
          }
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.backgroundWhite} />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
