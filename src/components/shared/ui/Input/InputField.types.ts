import {
  NativeSyntheticEvent,
  StyleProp,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
} from "react-native";

export type InputSize = "large" | "small";

export type KeyboardTypeOption =
  | "numeric"
  | "email-address"
  | "phone-pad"
  | "default";

export type InputFieldProps = {
  style?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  value: string;
  size?: InputSize;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  placeholderTextColor?: string;
  selectTextOnFocus?: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOption;
  autoComplete?: TextInputProps["autoComplete"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  textContentType?: TextInputProps["textContentType"];
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  testID?: string;
};
