import { socialButtonStyles as styles } from "@/components/shared/auth/SocialButton/socialButtonStyles";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

type SocialButtonProps = {
  label: string;
  Icon: React.FC<SvgProps>;
  onPress?: () => void;
  iconWidth?: number;
  iconHeight?: number;
  color?: string;
};

export const SocialButton = ({
  label,
  Icon,
  onPress,
  iconHeight = 20,
  iconWidth = 20,
  color,
}: SocialButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
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
