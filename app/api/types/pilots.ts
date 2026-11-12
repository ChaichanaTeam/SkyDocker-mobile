export type VerificationDocumentType =
  | "privilege_a1"
  | "privilege_a2"
  | "privilege_a3"
  | "privilege_sts01"
  | "privilege_sts02"
  | "operator_number";

export type FlyingPrivilege = Exclude<
  VerificationDocumentType,
  "operator_number"
>;

export type PilotProfile = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  pilot_number: string | null;
  show_to_public: boolean;
};

export type UpdateProfilePayload = Partial<{
  phone_number: string;
  show_to_public: boolean;
}>;

export type PilotDocument = {
  document_type: string;
  size: number;
  uploaded_at: string;
  url: string;
};

export type VerificationPreviewPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  pilot_number?: string;
  keep_documents: boolean;
  document_types: VerificationDocumentType[];
};

export interface VerificationPreviewResponse {
  verification_token: string;
  expires_in: number;
}

export interface VerificationRequest {
  id: number;
  pilot_id: number;
  status: string;
  first_name: string;
  last_name: string;
}

export type PickedFile = { uri: string; name: string; mimeType: string };

export type VerificationItem = {
  type: VerificationDocumentType;
  file: PickedFile;
};

export type ApiErrorDetail = {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
};
