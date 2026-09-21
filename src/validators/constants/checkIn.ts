import type { FlyingPrivilege } from "@app/api/types/checkIn";

export const FLYING_PRIVILEGES = [
  "a1",
  "a2",
  "a3",
  "sts01",
  "sts02",
] as const satisfies readonly FlyingPrivilege[];

export const CHECK_IN_VALIDATION_MESSAGE =
  "Fill in mission, drone, positive weight, positive whole-number height, range, duration, and a supported category.";
