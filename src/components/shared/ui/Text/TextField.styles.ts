import { TextVariant } from "@/components/shared/ui/Text/TextField.types";
import { colors } from "@/theme";
import { TextStyle } from "react-native";

export const variantStyles: Record<TextVariant, TextStyle> = {
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 32,
    color: colors.backgroundWhite,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.backgroundWhite80,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: colors.backgroundWhite,
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.backgroundWhite,
  },
  hint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.backgroundWhite80,
  },
  error: { fontFamily: "Inter_400Regular", fontSize: 13, color: "red" },
  link: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.pressableActive1,
  },
};
