import type { CheckInDraftValues } from "@features/tracking/types/checkIn";

import type {
  CheckInDropdownField,
  CheckInFormField,
} from "../types/types";

export const DEFAULT_CHECK_IN_FORM_VALUES: CheckInDraftValues = {
  category: "",
  drone: "",
  duration: "",
  height: "",
  mission: "",
  range: "",
  weight: "",
};

export const CHECK_IN_FIELDS: readonly CheckInFormField[] = [
  {
    key: "weight",
    keyboardType: "numeric",
    label: "Weight",
    placeholder: "1000",
    suffix: "g",
  },
  {
    key: "height",
    keyboardType: "numeric",
    label: "Height",
    placeholder: "100m AGL",
  },
  {
    key: "category",
    keyboardType: "default",
    label: "Category",
    placeholder: "A1",
  },
  {
    key: "range",
    keyboardType: "numeric",
    label: "Range",
    placeholder: "100m",
  },
  {
    key: "duration",
    keyboardType: "numeric",
    label: "Duration",
    placeholder: "30 min",
  },
];

export const CHECK_IN_DROPDOWNS = [
  {
    key: "mission",
    label: "Mission",
    placeholder: "Mission",
    options: [],
  },
  {
    key: "drone",
    label: "Drone",
    placeholder: "Drone",
    options: [],
  },
] as const satisfies readonly CheckInDropdownField[];

export const CHECK_IN_CATEGORY_DROPDOWN = {
  key: "category",
  label: "Category",
  options: [],
  placeholder: "A1",
} as const satisfies CheckInDropdownField;
