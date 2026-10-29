import { PASSWORD_REQUIREMENTS } from "@/validators/password.schema";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { StyleProp, Text, View, ViewStyle } from "react-native";

type Props = {
  password: string;
  style?: StyleProp<ViewStyle>;
};

export const PasswordRequirementList = ({ password, style }: Props) => {
  const showState = password.length > 0;

  return (
    <View style={[styles.requirementsList, style]}>
      {PASSWORD_REQUIREMENTS.map((requirement) => {
        const passed = requirement.test(password);

        return (
          <View key={requirement.label} style={styles.requirementRow}>
            <View
              style={[
                styles.bullet,
                showState &&
                  (passed ? styles.bulletValid : styles.bulletInvalid),
              ]}
            />
            <Text
              style={[
                styles.requirementText,
                showState &&
                  (passed
                    ? styles.requirementValid
                    : styles.requirementInvalid),
              ]}
            >
              {requirement.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
