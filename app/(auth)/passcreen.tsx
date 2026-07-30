import { PasswordScreen } from "@/components/ui/auth/signup/PasswordScreen/PasswordScreen";
import { useLocalSearchParams } from "expo-router";

export default function PassScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  const isSingleMode = mode === "single";

  return (
    <PasswordScreen
      mode={isSingleMode ? "single" : "multiple"}
      forgotPasswordHref={isSingleMode ? "#" : undefined}
    />
  );
}
