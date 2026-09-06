import { useCallback, useMemo, useState } from "react";

import type { CheckInDraftValues } from "@features/tracking";

import { DEFAULT_CHECK_IN_FORM_VALUES } from "../constants/checkInForm";
import type {
  CheckInDropdownFieldKey,
  CheckInDropdownOption,
  CheckInFormFieldKey,
} from "../types/types";

type UseCheckInFormParams = {
  onSubmit: (values: CheckInDraftValues) => Promise<void>;
};

export type UseCheckInFormResult = {
  activeDropdown: CheckInDropdownFieldKey | null;
  formValues: CheckInDraftValues;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  resetTransientState: () => void;
  selectDropdownOption: (
    fieldKey: CheckInDropdownFieldKey,
  ) => (option: CheckInDropdownOption) => void;
  submitError: string | null;
  submitForm: () => Promise<void>;
  toggleDropdown: (fieldKey: CheckInDropdownFieldKey) => void;
  updateField: (fieldKey: CheckInFormFieldKey) => (value: string) => void;
};

export const useCheckInForm = ({
  onSubmit,
}: UseCheckInFormParams): UseCheckInFormResult => {
  const [activeDropdown, setActiveDropdown] =
    useState<CheckInDropdownFieldKey | null>(null);
  const [formValues, setFormValues] = useState<CheckInDraftValues>(
    DEFAULT_CHECK_IN_FORM_VALUES,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isSubmitDisabled = useMemo(
    () =>
      Object.values(formValues).some(
        (value) => value.trim().length === 0,
      ),
    [formValues],
  );

  const updateField = useCallback(
    (fieldKey: CheckInFormFieldKey) =>
      (value: string): void => {
        setFormValues((currentValues) => ({
          ...currentValues,
          [fieldKey]: value,
        }));
      },
    [],
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
        setFormValues((currentValues) => ({
          ...currentValues,
          [fieldKey]: option.value,
        }));
        setActiveDropdown(null);
      },
    [],
  );

  const resetTransientState = useCallback((): void => {
    setActiveDropdown(null);
    setSubmitError(null);
  }, []);

  const submitForm = useCallback(async (): Promise<void> => {
    if (isSubmitDisabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formValues);
      setFormValues(DEFAULT_CHECK_IN_FORM_VALUES);
      setActiveDropdown(null);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not create check-in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, isSubmitDisabled, isSubmitting, onSubmit]);

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
