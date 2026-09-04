import { variantStyles } from "@/components/shared/ui/Text/TextField.styles";
import { CommonTextProps } from "@/components/shared/ui/Text/TextField.types";
import { Text } from "react-native";

export const TextField = ({
  children,
  variant = "body",
  color,
  style,
}: CommonTextProps) => {
  return (
    <Text style={[variantStyles[variant], color && { color }, style]}>
      {children}
    </Text>
  );
};
