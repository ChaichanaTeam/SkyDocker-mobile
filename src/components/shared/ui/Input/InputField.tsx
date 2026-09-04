import {
  sizeStyles,
  styles,
} from "@/components/shared/ui/Input/InputField.styles";
import { InputFieldProps } from "@/components/shared/ui/Input/InputField.types";
import { forwardRef } from "react";
import { TextInput } from "react-native";

export const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      style,
      value,
      size = "large",
      onChangeText,
      placeholder,
      onKeyPress,
      onFocus,
      onBlur,
      maxLength,
      selectTextOnFocus,
      placeholderTextColor,
      editable = true,
      keyboardType = "default",
      autoComplete,
      autoCapitalize,
      textContentType,
      autoCorrect,
      secureTextEntry,
      testID,
    },
    ref,
  ) => {
    return (
      <TextInput
        ref={ref}
        style={[
          styles.base,
          sizeStyles[size],
          !editable && styles.disabled,
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderTextColor}
        maxLength={maxLength}
        selectTextOnFocus={selectTextOnFocus}
        editable={editable}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        textContentType={textContentType}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        testID={testID}
      />
    );
  },
);

InputField.displayName = "InputField";
