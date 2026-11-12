import { apiRequest } from "@app/api/client";
import { VERIFICATION_CONFIG } from "@app/api/endpoints-config";
import {
  VerificationItem,
  VerificationPreviewPayload,
  VerificationPreviewResponse,
  VerificationRequest,
} from "@app/api/types/pilots";

const UPLOAD_TIMEOUT_MS = 60_000;

export const previewVerification = (
  payload: VerificationPreviewPayload,
): Promise<VerificationPreviewResponse> =>
  apiRequest<VerificationPreviewResponse>(VERIFICATION_CONFIG.PREVIEW(), {
    method: "POST",
    body: payload,
  });

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

  return apiRequest<VerificationRequest>(VERIFICATION_CONFIG.CREATE(), {
    method: "POST",
    body: form,
    headers: { "X-Verification-Token": verificationToken },
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });
};
