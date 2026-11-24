import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/shared/ui/Button/Button";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { colors } from "@/theme";
import { CheckInDropdown } from "./CheckInDropdown";
import { ActiveCheckIn } from "./ActiveCheckIn";
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
  isMutationPending = false,
  checkIns,
}: CheckInFormProps) => {
  const [actionError, setActionError] = useState<string | null>(null);
  const { invalidatePreview } = checkIns;
  const handleDraftChange = useCallback(() => {
    setActionError(null);
    invalidatePreview();
  }, [invalidatePreview]);
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
  } = useCheckInForm({ onSubmit: checkIns.create, onChange: handleDraftChange, drones: checkIns.drones, privileges: checkIns.privileges });
  const titleColor =
    appearance === "light" ? colors.checkInLightText : colors.text2;
  const requiredDataError = !checkIns.loading && !checkIns.phone
    ? 'Add a phone number to your pilot profile before check-in.'
    : !checkIns.loading && checkIns.drones.length === 0 && formValues.drone !== 'custom'
      ? 'No drones are linked to your pilot profile.'
      : null;
  const formError = checkIns.error
    ?? requiredDataError
    ?? submitError
    ?? actionError
    ?? (checkIns.uncertain ? 'Check-in status will be checked before trying again.' : null);
  const activeError = checkIns.error ?? actionError;

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
        {checkIns.active ? 'Active check-in' : 'Create new check in'}
      </TextField>

      {checkIns.loading ? <TextField>Loading pilot data…</TextField> : null}
      {checkIns.active ? (
        <ActiveCheckIn
          active={checkIns.active}
          checkIns={checkIns}
          error={activeError}
          isMutationPending={isMutationPending}
          onActionError={setActionError}
        />
      ) : (
        <>
      <View
        style={[
          styles.dropdownStack,
          activeDropdown === "mission" || activeDropdown === "drone"
            ? styles.dropdownStackOpen
            : null,
          isCompactLayout ? styles.dropdownStackCompact : null,
        ]}
      >
        {CHECK_IN_DROPDOWNS.map((field) => (
          <CheckInDropdown
            field={{ ...field, options: field.key === 'drone'
              ? [...checkIns.drones.map(drone => ({ label: drone.label, value: String(drone.id) })), { label: 'Custom', value: 'custom' }]
              : [{ label: 'No mission — enter flight details', value: '' }, ...checkIns.missions.filter(mission => mission.droneId === Number(formValues.drone)).map(mission => ({ label: mission.label, value: String(mission.id) }))] }}
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
                field={{ ...CHECK_IN_CATEGORY_DROPDOWN, options: checkIns.privileges.map(privilege => ({ label: privilege.toUpperCase(), value: privilege })) }}
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
                editable={field.key !== "weight" || formValues.drone === "custom"}
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

      {formError ? (
        <TextField style={styles.formError}>
          {formError}
        </TextField>
      ) : null}

          <View style={styles.actionFooter}>
            <Button
              disabled={isSubmitDisabled || isMutationPending || isSubmitting || checkIns.loading || !!checkIns.error || !checkIns.phone}
              loading={isSubmitting}
              onPress={submitForm}
              size="large"
              style={[
                styles.createListButton,
                isCompactLayout ? styles.createListButtonCompact : null,
              ]}
              variant="secondary"
            >
              <TextField color={colors.backgroundWhite}>Create new list</TextField>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};
