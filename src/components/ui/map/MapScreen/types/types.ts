import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";
import type { KeyboardTypeOptions } from "react-native";
import type { MapType } from "react-native-maps";

import type { CheckInDraftValues } from "@features/tracking";

export type MapAppearance = "light" | "dark";
export type SessionMapType = Extract<MapType, "standard" | "satellite">;
export type ControlIconName = ComponentProps<typeof Ionicons>["name"];

export type MapBottomBarItemKey = "checkIn" | "map" | "profile";

export type MapControlButtonProps = {
  accessibilityLabel: string;
  iconName: ControlIconName;
  isActive?: boolean;
  onPress: () => void;
};

export type MapBottomBarItem = {
  accessibilityLabel: string;
  key: MapBottomBarItemKey;
};

export type MapBottomBarProps = {
  activeItem: MapBottomBarItemKey;
  bottomInset: number;
  onCheckInPress: () => void;
  onMapPress: () => void;
  onProfilePress: () => void;
};

export type CheckInDropdownFieldKey = "mission" | "drone";
export type CheckInFormFieldKey =
  | "category"
  | "duration"
  | "height"
  | "range"
  | "start"
  | "weight";

export type CheckInFormField = {
  key: CheckInFormFieldKey;
  keyboardType?: Extract<KeyboardTypeOptions, "default" | "numeric">;
  label: string;
  placeholder: string;
  suffix?: string;
};

export type CheckInDropdownOption = {
  label: string;
  value: string;
};

export type CheckInDropdownField = {
  key: CheckInDropdownFieldKey;
  label: string;
  options: readonly CheckInDropdownOption[];
};

export type CheckInFormProps = {
  appearance: MapAppearance;
  isCompactLayout: boolean;
  isVisible: boolean;
  onSubmit: (values: CheckInDraftValues) => Promise<void>;
};

export type CheckInDropdownProps = {
  appearance: MapAppearance;
  field: CheckInDropdownField;
  isCompact: boolean;
  isOpen: boolean;
  onPress: () => void;
  onSelect: (option: CheckInDropdownOption) => void;
  value: string;
};

export type CheckInSheetProps = {
  appearance: MapAppearance;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: CheckInDraftValues) => Promise<void>;
};
