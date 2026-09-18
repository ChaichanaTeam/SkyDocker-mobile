import { TouchableOpacity, View } from "react-native";

import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";

import { styles } from "./styles/CheckInDropdown.styles";

import type { CheckInDropdownProps } from "./types/types";

export const CheckInDropdown = ({
  appearance,
  field,
  isCompact,
  isOpen,
  onPress,
  onSelect,
  value,
}: CheckInDropdownProps) => {
  const surfaceColor =
    appearance === "light" ? colors.checkInLightSurface : colors.backgroundMain;
  const textColor =
    appearance === "light" ? colors.checkInLightText : colors.text2;
  const borderColor =
    appearance === "light" ? colors.checkInLightBorder : colors.text1;
  const placeholderColor =
    appearance === "light" ? colors.checkInLightText : colors.text1;

  return (
    <View
      style={[
        styles.dropdownRoot,
        isOpen ? styles.dropdownRootOpen : null,
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.76}
        onPress={onPress}
        style={[
          styles.outlinedDropdown,
          isCompact ? styles.outlinedDropdownCompact : null,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
      >
        <TextField
          color={colors.text1}
          style={[
            styles.outlinedLabel,
            { backgroundColor: surfaceColor },
          ]}
          variant="label"
        >
          {field.label}
        </TextField>
        <TextField
          color={value ? textColor : placeholderColor}
          style={styles.dropdownValue}
        >
          {value}
        </TextField>
      </TouchableOpacity>

      {isOpen ? (
        <View
          style={[
            styles.dropdownMenu,
            isCompact ? styles.dropdownMenuCompact : null,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          {field.options.map((option) => (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.76}
              key={option.value}
              onPress={() => onSelect(option)}
              style={styles.dropdownOption}
            >
              <TextField color={textColor} style={styles.dropdownOptionText}>
                {option.label}
              </TextField>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};
