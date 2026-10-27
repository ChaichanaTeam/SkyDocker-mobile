import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { KeyboardTypeOptions } from "react-native";
import type { MapType } from "react-native-maps";

import type { CheckInDraftValues } from "@features/tracking";
import type { GeoZoneFeature } from "@app/api/types/geoZone";

export type MapAppearance = "light" | "dark";
export type SessionMapType = Extract<MapType, "standard" | "satellite">;
export type ControlIconName = ComponentProps<typeof Ionicons>["name"];

export type MapControlButtonProps = {
  accessibilityLabel: string;
  iconName: ControlIconName;
  isActive?: boolean;
  onPress: () => void;
};

export type DroneInfo = {
  name: string;
  speedKmh?: number;
  weightG?: number;
  heightKm?: number;
  rangeKm?: number;
  missionsCount?: number;
  flightTime?: string;
  currentMission?: string;
};

export type DroneInfoSheetProps = {
  drone?: DroneInfo | null;
  isVisible: boolean;
  onClose: () => void;
  onCheckInPress: () => void;
  onWikiPress: () => void;
  onProfilePress: () => void;
};

export type CheckInDropdownFieldKey = "mission" | "drone" | "category";
export type CheckInFormFieldKey =
  | "category"
  | "duration"
  | "height"
  | "range"
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
  placeholder?: string;
};

export type CheckInFormProps = {
  appearance: MapAppearance;
  isCompactLayout: boolean;
  isVisible: boolean;
  isMutationPending?: boolean;
  onSubmit: (values: CheckInDraftValues) => Promise<void>;
};

export type CheckInTextFieldProps = {
  appearance: MapAppearance;
  field: CheckInFormField;
  isCompact: boolean;
  onChangeText: (value: string) => void;
  value: string;
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
  isMutationPending?: boolean;
  onClose: () => void;
  onSubmit: (values: CheckInDraftValues) => Promise<void>;
};

export type GeoZoneInfoSheetProps = {
  zone: GeoZoneFeature | null;
  onClose: () => void;
};
