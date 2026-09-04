import { Button } from "@/components/shared/ui/Button/Button";
import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import {
  applyOtpInput,
  createEmptyOtpCode,
  getNextOtpIndex,
  getPreviousOtpIndex,
  isOtpCodeComplete,
} from "@/components/ui/auth/confirmEmail/otpCode";
import { styles } from "@/components/ui/auth/confirmEmail/styles/ConfirmEmailScreen.styles";
import { useSignUp } from "@app/api/context/SignUpContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type ConfirmEmailScreenProps = {
  nextRoute?: string;
};

export const ConfirmEmailScreen = ({
  nextRoute = "/(tabs)",
}: ConfirmEmailScreenProps) => {
  const router = useRouter();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [code, setCode] = useState(() => createEmptyOtpCode(CODE_LENGTH));
  const codeRef = useRef(code);
  const isComplete = isOtpCodeComplete(code);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => clearTimeout(focusTimer);
  }, []);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const updateCode = (nextCode: string[]) => {
    codeRef.current = nextCode;
    setCode(nextCode);
  };

  const handleCodeChange = (index: number, value: string) => {
    const nextCode = applyOtpInput(codeRef.current, index, value);

    updateCode(nextCode);

    const nextIndex = getNextOtpIndex(index, value, CODE_LENGTH);

    if (nextIndex !== index) {
      focusInput(nextIndex);
    }
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key !== "Backspace") {
      return;
    }

    const previousIndex = getPreviousOtpIndex(index);
    const clearIndex = codeRef.current[index] === "" ? previousIndex : index;

    updateCode(applyOtpInput(codeRef.current, clearIndex, ""));

    if (previousIndex !== index) {
      focusInput(previousIndex);
    }
  };

  const { confirmOtp, resendOtp, isSubmitting, error } = useSignUp();

  const handleResend = async () => {
    try {
      await resendOtp();
    } catch {}
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = async () => {
    if (!isComplete) return;

    try {
      await confirmOtp(code.join(""));
      router.replace(nextRoute as any);
    } catch {}
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TextField style={styles.title} variant="title">
            Confirm email
          </TextField>

          <TextField style={styles.subtitle} variant="subtitle">
            enter the code thats was sent on your email
          </TextField>
        </View>

        <View style={styles.codeRow}>
          {code.map((character, index) => (
            <InputField
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              style={styles.codeInput}
              value={character}
              onChangeText={(value) => handleCodeChange(index, value)}
              onKeyPress={(event) => handleKeyPress(index, event)}
              maxLength={CODE_LENGTH}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              selectTextOnFocus={false}
              textContentType="oneTimeCode"
              testID={`confirm-email-code-input-${index}`}
            />
          ))}
        </View>

        {error && (
          <TextField style={styles.errorText} variant="error">
            {error.message}
          </TextField>
        )}

        <Button
          style={styles.centerBackButton}
          onPress={handleResend}
          disabled={isSubmitting}
          variant="text"
          size="small"
          activeOpacity={0.7}
        >
          <TextField style={styles.centerBackText} variant="link">
            Send again
          </TextField>
        </Button>

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
            disabled={!isComplete}
            loading={isSubmitting}
            size="small"
            variant="secondary"
            activeOpacity={0.8}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
