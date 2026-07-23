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
import {
  applyOtpInput,
  createEmptyOtpCode,
  getNextOtpIndex,
  getPreviousOtpIndex,
  isOtpCodeComplete,
} from "./otpCode";
import { styles } from "./styles/ConfirmPhoneScreen.styles";

const CODE_LENGTH = 6;

export const ConfirmPhoneScreen = () => {
  const router = useRouter();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [code, setCode] = useState(() => createEmptyOtpCode(CODE_LENGTH));
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

  const handleCodeChange = (index: number, value: string) => {
    const nextCode = applyOtpInput(code, index, value);

    setCode(nextCode);

    if (value.length > 0) {
      focusInput(getNextOtpIndex(index, value, CODE_LENGTH));
    }
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === "Backspace" && code[index] === "") {
      focusInput(getPreviousOtpIndex(index));
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (isComplete) {
      router.replace("/(tabs)");
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
              selectTextOnFocus
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
            style={[styles.nextButton, !isComplete && styles.nextButtonDisabled]}
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
