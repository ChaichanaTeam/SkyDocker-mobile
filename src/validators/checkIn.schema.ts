import {
  CHECK_IN_VALIDATION_MESSAGE,
  FLYING_PRIVILEGES,
} from "@validators/constants/checkIn";

import type { FlyingPrivilege } from "@app/api/types/checkIn";
import type { CheckInDraftValues } from "@features/tracking";
import type { ValidatedCheckInDraft } from "@validators/types/checkIn";

const parsePositiveInteger = (value: string): number | null => {
  const normalizedValue = value.trim();

  if (!/^[1-9]\d*$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
};

const parsePositiveNumber = (value: string): number | null => {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : null;
};

const isFlyingPrivilege = (value: string): value is FlyingPrivilege =>
  FLYING_PRIVILEGES.includes(value as FlyingPrivilege);

export const validateCheckInDraft = (
  values: CheckInDraftValues,
): ValidatedCheckInDraft => {
  const mission = values.mission.trim();
  const drone = values.drone.trim();
  const weight = parsePositiveNumber(values.weight);
  const height = parsePositiveInteger(values.height);
  const range = parsePositiveInteger(values.range);
  const durationMinutes = parsePositiveInteger(values.duration);
  const category = values.category.trim().toLowerCase();

  if (
    mission.length === 0 ||
    drone.length === 0 ||
    weight === null ||
    height === null ||
    range === null ||
    durationMinutes === null ||
    !isFlyingPrivilege(category)
  ) {
    throw new Error(CHECK_IN_VALIDATION_MESSAGE);
  }

  return {
    category,
    durationMinutes,
    height,
    range,
    values: {
      ...values,
      category,
      drone,
      duration: values.duration.trim(),
      height: values.height.trim(),
      mission,
      range: values.range.trim(),
      weight: values.weight.trim(),
    },
  };
};
