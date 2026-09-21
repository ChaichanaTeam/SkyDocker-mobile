import { useEffect } from "react";
import { View } from "react-native";

import { Button } from "@/components/shared/ui/Button/Button";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";

import { CheckInDropdown } from "./CheckInDropdown";
import { CheckInTextField } from "./CheckInTextField";
import {
  CHECK_IN_CATEGORY_DROPDOWN,
  CHECK_IN_DROPDOWNS,
  CHECK_IN_FIELDS,
} from "./constants/checkInForm";
import { useCheckInForm } from "./hooks/useCheckInForm";
import { styles } from "./styles/CheckInSheet.styles";

import type { CheckInFormProps } from "./types/types";

export const CheckInForm = ({
  appearance,
  isCompactLayout,
  isVisible,
  onSubmit,
}: CheckInFormProps) => {
  const {
    activeDropdown,
    formValues,
    isSubmitDisabled,
    isSubmitting,
    resetTransientState,
    selectDropdownOption,
    submitError,
    submitForm,
    toggleDropdown,
    updateField,
  } = useCheckInForm({ onSubmit });
  const titleColor =
    appearance === "light" ? colors.checkInLightText : colors.text2;

  useEffect(() => {
    if (!isVisible) {
      resetTransientState();
    }
  }, [isVisible, resetTransientState]);

  return (
    <View
      style={[
        styles.sheetContent,
        isCompactLayout ? styles.sheetContentCompact : null,
      ]}
    >
      <TextField
        color={titleColor}
        style={[
          styles.title,
          isCompactLayout ? styles.titleCompact : null,
        ]}
        variant="title"
      >
        Create new check in
      </TextField>

      <View
        style={[
          styles.dropdownStack,
          isCompactLayout ? styles.dropdownStackCompact : null,
        ]}
      >
        {CHECK_IN_DROPDOWNS.map((field) => (
          <CheckInDropdown
            field={field}
            appearance={appearance}
            isCompact={isCompactLayout}
            isOpen={activeDropdown === field.key}
            key={field.key}
            onPress={() => toggleDropdown(field.key)}
            onSelect={selectDropdownOption(field.key)}
            value={formValues[field.key]}
          />
        ))}
      </View>

      <View
        style={[
          styles.fieldGrid,
          isCompactLayout ? styles.fieldGridCompact : null,
        ]}
      >
        {CHECK_IN_FIELDS.map((field) => (
          <View
            key={field.key}
            style={[
              styles.fieldCell,
              activeDropdown === field.key ? styles.fieldCellOpen : null,
            ]}
          >
            {field.key === "category" ? (
              <CheckInDropdown
                field={CHECK_IN_CATEGORY_DROPDOWN}
                appearance={appearance}
                isCompact={isCompactLayout}
                isOpen={activeDropdown === field.key}
                onPress={() => toggleDropdown("category")}
                onSelect={selectDropdownOption("category")}
                value={formValues.category}
              />
            ) : (
              <CheckInTextField
                appearance={appearance}
                field={field}
                isCompact={isCompactLayout}
                onChangeText={updateField(field.key)}
                value={formValues[field.key]}
              />
            )}
          </View>
        ))}
        <View style={styles.fieldCell} />
      </View>

      {submitError ? (
        <TextField style={styles.formError}>
          {submitError}
        </TextField>
      ) : null}

      <View
        style={[
          styles.buttonSpacer,
          isCompactLayout ? styles.buttonSpacerCompact : null,
        ]}
      />
      <Button
        disabled={isSubmitDisabled}
        loading={isSubmitting}
        onPress={submitForm}
        size="large"
        style={[
          styles.createListButton,
          isCompactLayout ? styles.createListButtonCompact : null,
        ]}
        variant="secondary"
      >
        <TextField color={colors.text2}>
          Create new list
        </TextField>
      </Button>
    </View>
  );
};
