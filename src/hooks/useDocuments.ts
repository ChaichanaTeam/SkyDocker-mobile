import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getMyDocuments } from "@app/api/services/pilots.service";

export const useDocuments = () => useAsyncResource(getMyDocuments);
