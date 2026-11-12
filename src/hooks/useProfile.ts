import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getMyProfile } from "@app/api/services/pilots.service";

export const useProfile = () => useAsyncResource(getMyProfile);
