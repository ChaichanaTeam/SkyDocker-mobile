import { PASSWORD_REQUIREMENTS } from "@/validators/password.schema";
import { authStyles as styles } from "@/components/shared/styles/authStyles";
import { Text, View } from "react-native";

type Props = {
  password: string;
};

export const PasswordRequirementList = ({ password }: Props) => {
  const showState = password.length > 0;

  return (
    <View style={styles.requirementsList}>
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
