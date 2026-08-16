import { PasswordScreen } from "@/components/ui/auth/signup/PasswordScreen/PasswordScreen";
import { useLocalSearchParams } from "expo-router";

export default function PassScreen() {
  const { email, mode } = useLocalSearchParams<{
    email?: string;
    mode?: string;
  }>();

  const isSingleMode = mode === "single";

  return (
    <PasswordScreen
      email={isSingleMode ? email : undefined}
      mode={isSingleMode ? "single" : "multiple"}
    />
  );
}
