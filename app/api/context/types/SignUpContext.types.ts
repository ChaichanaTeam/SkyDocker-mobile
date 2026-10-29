import type { ApiError } from "@app/api/types/apiError";
import type {
  RegistrationDraft,
  RegistrationStep,
} from "@app/api/types/auth";

export interface SignUpContextValue {
  step: RegistrationStep;
  draft: RegistrationDraft;
  isSubmitting: boolean;
  error: ApiError | null;
  setEmail: (email: string) => Promise<void>;
  submitRegistration: (password: string) => Promise<void>;
  confirmOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
}
