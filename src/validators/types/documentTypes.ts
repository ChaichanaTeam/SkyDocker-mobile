import { VerificationDocumentType } from "@app/api/types/pilots";

export const DOCUMENT_TYPE_TITLES: Record<VerificationDocumentType, string> = {
  privilege_a1: "Pilot license A1",
  privilege_a2: "Pilot license A2",
  privilege_a3: "Pilot license A3",
  privilege_sts01: "Pilot license sts01",
  privilege_sts02: "Pilot license sts02",
  operator_number: "Operator number document",
};

export const PRIVILEGE_TYPES: VerificationDocumentType[] = [
  "privilege_a1",
  "privilege_a2",
  "privilege_a3",
  "privilege_sts01",
  "privilege_sts02",
];

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
