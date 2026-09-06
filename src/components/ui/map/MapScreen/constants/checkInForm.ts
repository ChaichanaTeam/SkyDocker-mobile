import type { CheckInDraftValues } from "@features/tracking";

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
  start: "",
  weight: "",
};

export const CHECK_IN_FIELDS = [
  {
    key: "weight",
    keyboardType: "numeric",
    label: "Weight",
    placeholder: "<900",
    suffix: "g",
  },
  {
    key: "height",
    keyboardType: "numeric",
    label: "Height",
    placeholder: "100",
    suffix: "m AGL",
  },
  {
    key: "category",
    keyboardType: "default",
    label: "Category",
    placeholder: "A1",
    suffix: undefined,
  },
  {
    key: "range",
    keyboardType: "numeric",
    label: "Range",
    placeholder: "100",
    suffix: "m",
  },
  {
    key: "start",
    keyboardType: "default",
    label: "Start",
    placeholder: "Now",
    suffix: undefined,
  },
  {
    key: "duration",
    keyboardType: "numeric",
    label: "Duration",
    placeholder: "30",
    suffix: "min",
  },
] as const satisfies readonly CheckInFormField[];

export const CHECK_IN_DROPDOWNS = [
  {
    key: "mission",
    label: "Mission",
    options: [{ label: "Mission list", value: "Mission list" }],
  },
  {
    key: "drone",
    label: "Drone",
    options: [{ label: "SkyDocker drone", value: "SkyDocker drone" }],
  },
] as const satisfies readonly CheckInDropdownField[];
