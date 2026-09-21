import type { CreateDemoCheckInRequest } from "@app/api/types/checkIn";
import type { UserCoordinates } from "@features/tracking/types/types";
import type { ValidatedCheckInDraft } from "@validators/types/checkIn";

export const mapValidatedDraftToDemoCheckInRequest = (
  draft: ValidatedCheckInDraft,
  coordinate: UserCoordinates,
  submittedAt: Date,
): CreateDemoCheckInRequest => {
  const time = draft.durationMinutes * 60;

  return {
    lon: coordinate.longitude,
    lat: coordinate.latitude,
    flying_privilege: draft.category,
    description: null,
    height: draft.height,
    range: draft.range,
    time,
    starts_at: submittedAt.toISOString(),
    ends_at: new Date(submittedAt.getTime() + time * 1000).toISOString(),
  };
};
