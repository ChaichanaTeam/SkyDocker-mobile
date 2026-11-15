import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CheckInDraftValues } from "@features/tracking/types/checkIn";

import { DEFAULT_CHECK_IN_FORM_VALUES } from "../constants/checkInForm";
import type {
  CheckInDropdownFieldKey,
  CheckInDropdownOption,
  CheckInFormFieldKey,
} from "../types/types";
import type { UseCheckInFormParams, UseCheckInFormResult } from "../types/useCheckInForm";

export const useCheckInForm = ({
  onSubmit,
  onChange,
  drones,
  privileges,
}: UseCheckInFormParams): UseCheckInFormResult => {
  const [activeDropdown, setActiveDropdown] =
    useState<CheckInDropdownFieldKey | null>(null);
  const [formValues, setFormValues] = useState<CheckInDraftValues>(
    DEFAULT_CHECK_IN_FORM_VALUES,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const submitLock = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    if (formValues.drone || drones.length === 0) return;
    if (drones.length === 1) {
      const drone = drones[0];
      onChange();
      setFormValues(current => ({ ...current, drone: String(drone.id), mission: "",
        weight: String(drone.weightG),
        category: privileges.length === 1 ? privileges[0] : "" }));
    }
  }, [drones, formValues.drone, onChange, privileges]);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const isSubmitDisabled = useMemo(
    () =>
      !formValues.drone || (!formValues.mission &&
        (!formValues.category || !formValues.height || !formValues.range || !formValues.duration)),
    [formValues],
  );

  const updateField = useCallback(
    (fieldKey: CheckInFormFieldKey) =>
      (value: string): void => {
        onChange();
        setSubmitError(null);
        setFormValues((currentValues) => ({
          ...currentValues,
          [fieldKey]: value,
        }));
      },
    [onChange],
  );

  const toggleDropdown = useCallback(
    (fieldKey: CheckInDropdownFieldKey): void => {
      setActiveDropdown((currentFieldKey) =>
        currentFieldKey === fieldKey ? null : fieldKey,
      );
    },
    [],
  );

  const selectDropdownOption = useCallback(
    (fieldKey: CheckInDropdownFieldKey) =>
      (option: CheckInDropdownOption): void => {
        onChange();
        setSubmitError(null);
        setFormValues((current) => {
          if (fieldKey !== "drone") return { ...current, [fieldKey]: option.value };
          if (option.value === "custom") return { ...DEFAULT_CHECK_IN_FORM_VALUES, drone: "custom" };
          const drone = drones.find(item => String(item.id) === option.value);
          if (!drone) return { ...current, drone: option.value, height: "", range: "" };
          return { ...DEFAULT_CHECK_IN_FORM_VALUES, drone: option.value, weight: String(drone.weightG),
            category: privileges.length === 1 ? privileges[0] : "" };
        });
        setActiveDropdown(null);
      },
    [drones, onChange, privileges],
  );

  const resetTransientState = useCallback((): void => {
    setActiveDropdown(null);
    setSubmitError(null);
  }, []);

  const submitForm = useCallback(async (): Promise<void> => {
    if (!mounted.current || isSubmitDisabled || submitLock.current) {
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formValues, (drone) => {
        setFormValues(current => current.drone === 'custom' && current.weight === formValues.weight
          ? { ...current, drone: String(drone.id), weight: String(drone.weightG) }
          : current);
      });
      if (!mounted.current) return;
      setActiveDropdown(null);
    } catch (error: unknown) {
      if (!mounted.current) return;
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not create check-in. Please try again.",
      );
    } finally {
      submitLock.current = false;
      if (mounted.current) setIsSubmitting(false);
    }
  }, [formValues, isSubmitDisabled, onSubmit]);

  return {
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
  };
};
