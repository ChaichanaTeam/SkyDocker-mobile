import { apiRequest } from "@app/api/client";
import { VERIFICATION_CONFIG } from "@app/api/endpoints-config";
import { parseVerificationPreview, parseVerificationRequest } from "@app/api/validators/response";
import {
  VerificationItem,
  VerificationPreviewPayload,
  VerificationPreviewResponse,
} from "@app/api/types/pilots";

const UPLOAD_TIMEOUT_MS = 60_000;

export const previewVerification = (
  payload: VerificationPreviewPayload,
): Promise<VerificationPreviewResponse> =>
  apiRequest(VERIFICATION_CONFIG.PREVIEW(), {
    method: "POST",
    body: payload,
  }, parseVerificationPreview);

export const submitVerification = async (
  verificationToken: string,
  items: VerificationItem[],
) => {
  const form = new FormData();

  items.forEach(({ type, file }) => {
    form.append("document_types", type);
    form.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob);
  });

  return apiRequest(VERIFICATION_CONFIG.CREATE(), {
    method: "POST",
    body: form,
    headers: { "X-Verification-Token": verificationToken },
    timeoutMs: UPLOAD_TIMEOUT_MS,
  }, parseVerificationRequest);
};
