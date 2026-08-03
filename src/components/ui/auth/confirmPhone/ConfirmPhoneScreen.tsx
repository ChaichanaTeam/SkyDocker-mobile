import {
  applyOtpInput,
  createEmptyOtpCode,
  getNextOtpIndex,
  getPreviousOtpIndex,
  isOtpCodeComplete,
} from "@/components/ui/auth/confirmPhone/otpCode";
import { styles } from "@/components/ui/auth/confirmPhone/styles/ConfirmPhoneScreen.styles";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type ConfirmPhoneScreenProps = {
  nextRoute?: string;
};

export const ConfirmPhoneScreen = ({
  nextRoute = "/(tabs)",
}: ConfirmPhoneScreenProps) => {
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

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (isComplete) {
      router.replace(nextRoute as any);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm contacts</Text>
          <Text style={styles.subtitle}>
            enter the code thats was sent on your phone
          </Text>
        </View>

        <View style={styles.codeRow}>
          {code.map((character, index) => (
            <TextInput
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
              testID={`confirm-phone-code-input-${index}`}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.centerBackButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <Text style={styles.centerBackText}>Re-send code</Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
            <Text style={styles.bottomBackText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              !isComplete && styles.nextButtonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={!isComplete}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
