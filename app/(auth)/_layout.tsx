import { SignUpProvider } from "@app/api/context/SignUpContext";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <SignUpProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SignUpProvider>
  );
}
