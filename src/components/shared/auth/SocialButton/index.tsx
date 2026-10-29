import { socialButtonStyles as styles } from "@/components/shared/auth/SocialButton/socialButtonStyles";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

type SocialButtonProps = {
  label: string;
  Icon: React.FC<SvgProps>;
  onPress?: () => void;
  iconWidth?: number;
  iconHeight?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export const SocialButton = ({
  label,
  Icon,
  onPress,
  iconHeight = 20,
  iconWidth = 20,
  color,
  style,
}: SocialButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Icon width={iconWidth} height={iconHeight} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};
