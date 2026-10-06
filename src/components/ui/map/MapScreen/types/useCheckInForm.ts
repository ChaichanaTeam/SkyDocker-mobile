import type { CheckInDraftValues } from "@features/tracking";

import type {
  CheckInDropdownFieldKey,
  CheckInDropdownOption,
  CheckInFormFieldKey,
} from "./types";

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
