import { View } from "react-native";

import { InputField } from "@/components/shared/ui/Input/InputField";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";

import { styles } from "./styles/CheckInTextField.styles";

import type { CheckInTextFieldProps } from "./types/types";

export const CheckInTextField = ({
  appearance,
  field,
  isCompact,
  onChangeText,
  value,
}: CheckInTextFieldProps) => {
  const isLight = appearance === "light";
  const placeholderTextColor = isLight
    ? colors.checkInLightText
    : colors.text1;

  return (
    <View
      style={[
        styles.outlinedField,
        isCompact ? styles.outlinedFieldCompact : null,
        isLight ? styles.outlinedFieldLight : styles.outlinedFieldDark,
      ]}
    >
      <TextField
        style={[
          styles.outlinedLabel,
          isLight ? styles.outlinedLabelLight : styles.outlinedLabelDark,
        ]}
        variant="label"
      >
        {field.label}
      </TextField>
      <View style={styles.inputValueRow}>
        <InputField
          autoCorrect={false}
          keyboardType={field.keyboardType}
          onChangeText={onChangeText}
          placeholder={field.placeholder}
          placeholderTextColor={placeholderTextColor}
          style={[
            styles.outlinedInput,
            isCompact ? styles.outlinedInputCompact : null,
            isLight ? styles.outlinedInputLight : styles.outlinedInputDark,
            field.suffix ? styles.outlinedInputWithSuffix : null,
          ]}
          value={value}
        />
        {field.suffix ? (
          <TextField
            style={[
              styles.inputSuffix,
              isLight ? styles.inputSuffixLight : styles.inputSuffixDark,
            ]}
          >
            {field.suffix}
          </TextField>
        ) : null}
      </View>
    </View>
  );
};
