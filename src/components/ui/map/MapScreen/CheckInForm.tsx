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
  } = useCheckInForm({ onSubmit: checkIns.prepare, onChange: handleDraftChange, drones: checkIns.drones, privileges: checkIns.privileges });
  const runAction = async (action: () => Promise<unknown>) => {
    setActionError(null);
    try { await action(); }
    catch (caught) { setActionError(caught instanceof Error ? caught.message : 'Could not update check-in.'); }
  };
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
    ?? (checkIns.uncertain ? 'Check-in status needs to be refreshed before another action.' : null);
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
        {checkIns.active ? 'Active check-in' : 'Create new check-in'}
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
          isCompactLayout ? styles.dropdownStackCompact : null,
        ]}
      >
        {CHECK_IN_DROPDOWNS.filter(field => field.key !== 'mission' || formValues.drone !== 'custom').map((field) => (
          <CheckInDropdown
            field={{ ...field, options: field.key === 'drone'
              ? [...checkIns.drones.map(drone => ({ label: drone.label, value: String(drone.id) })), { label: 'Custom', value: 'custom' }]
              : [{ label: 'No mission — enter flight details', value: '' }, ...(formValues.drone === 'custom' ? [] : checkIns.missions.filter(mission => mission.droneId === Number(formValues.drone)).map(mission => ({ label: mission.label, value: String(mission.id) })))] }}
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
                field={field}
                isCompact={isCompactLayout}
                onChangeText={updateField(field.key)}
                editable={field.key !== 'weight' || formValues.drone === 'custom'}
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

      {checkIns.prepared ? (
        <View>
          <TextField style={styles.previewSummary}>
            Preview ready · confirm before {new Date(checkIns.prepared.expiresAt).toLocaleTimeString()}
          </TextField>
        </View>
      ) : null}
      {checkIns.uncertain ? <Button disabled={isMutationPending} onPress={() => void runAction(checkIns.refreshActive)} size="small" variant="text"><TextField>Refresh check-in status</TextField></Button> : null}

      <Button
        disabled={(!checkIns.prepared && isSubmitDisabled) || isMutationPending || checkIns.loading || !!checkIns.error || !checkIns.phone || checkIns.uncertain}
        loading={checkIns.prepared ? checkIns.mutation === 'create' : isSubmitting}
        onPress={checkIns.prepared ? () => void runAction(checkIns.confirm) : submitForm}
        size="large"
        style={[
          styles.createListButton,
          isCompactLayout ? styles.createListButtonCompact : null,
        ]}
        variant="secondary"
      >
        <TextField color={colors.text2}>
          {checkIns.prepared ? 'Confirm check-in' : 'Review flight'}
        </TextField>
      </Button>
      </>
      )}
    </View>
  );
};
