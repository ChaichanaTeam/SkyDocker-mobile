import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";

import { styles } from "./styles/CheckInDropdown.styles";

import type { CheckInDropdownProps } from "./types/types";

export const CheckInDropdown = ({
  appearance,
  disabled = false,
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
  const labelColor =
    appearance === "light" ? colors.checkInFormAccent : colors.text1;
  const placeholderColor =
    appearance === "light" ? colors.checkInLightPlaceholder : colors.text1;
  const selectedOption = value
    ? field.options.find((option) => option.value === value)
    : undefined;
  const displayValue =
    selectedOption?.label ??
    (value.length > 0 ? value : field.placeholder ?? "");

  return (
    <View
      style={[
        styles.dropdownRoot,
        isOpen ? styles.dropdownRootOpen : null,
      ]}
    >
      <TextField color={textColor} style={styles.fieldLabel} variant="label">
        {field.label}
      </TextField>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.76}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.dropdownTrigger,
          isCompact ? styles.outlinedDropdownCompact : null,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
      >
        <TextField
          color={value ? textColor : placeholderColor}
          style={[
            styles.dropdownValue,
            field.key === "category" ? styles.dropdownCategoryValue : null,
          ]}
        >
          {displayValue}
        </TextField>
        {field.key === "mission" || field.key === "drone" ? (
          <Ionicons color={labelColor} name="chevron-down" size={18} />
        ) : null}
      </TouchableOpacity>

      {isOpen ? (
        <View
          style={[
            styles.dropdownMenu,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <ScrollView nestedScrollEnabled>
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
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};
