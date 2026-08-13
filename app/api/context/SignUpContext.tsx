import { requestOtp, signup, verifyOtp } from "@app/api/services/auth.service";
import { ApiError, isApiError } from "@app/api/types/apiError";
import {
  RegisterPayload,
  RegistrationDraft,
  RegistrationStep,
} from "@app/api/types/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface SignUpContextValue {
  step: RegistrationStep;
  draft: RegistrationDraft;
  isSubmitting: boolean;
  error: ApiError | null;
  setEmail: (email: string) => Promise<void>;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  submitProfile: (firstName: string, lastName: string) => Promise<void>;
  confirmOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
}

const SignUpContext = createContext<SignUpContextValue | undefined>(undefined);

const toApiError = (e: unknown): ApiError =>
  isApiError(e) ? e : { status: 0, message: "Unknown error" };

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<RegistrationStep>("email");
  const [draft, setDraft] = useState<RegistrationDraft>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const setEmail = useCallback(async (email: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { token } = await requestOtp(email);
      setDraft((prev) => ({ ...prev, email, verify_token: token }));
      setStep("otp");
    } catch (e) {
      const apiError = toApiError(e);
      setError(apiError);
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const setPhone = useCallback((phone: string) => {
    setDraft((prev) => ({ ...prev, phone_number: phone }));
    setError(null);
    setStep("password");
  }, []);

  const setPassword = useCallback((password: string) => {
    setDraft((prev) => ({ ...prev, password }));
    setError(null);
    setStep("name");
  }, []);

  const confirmOtp = useCallback(
    async (otp: string) => {
      if (!draft.verify_token) {
        const tokenError: ApiError = {
          status: 0,
          message: "Verify token is missing",
        };
        setError(tokenError);
        throw tokenError;
      }
      setIsSubmitting(true);
      setError(null);
      try {
        const res = await verifyOtp(otp, draft.verify_token);
        setDraft((prev) => ({
          ...prev,
          otp,
          registration_token: res.token,
        }));
        setStep("phone");
      } catch (e) {
        const apiError = toApiError(e);
        setError(apiError);
        throw apiError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [draft.verify_token],
  );

  const resendOtp = useCallback(async () => {
    if (!draft.email) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const { token } = await requestOtp(draft.email);
      setDraft((prev) => ({ ...prev, verify_token: token }));
    } catch (e) {
      const apiError = toApiError(e);
      setError(apiError);
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  }, [draft.email]);

  const submitProfile = useCallback(
    async (firstName: string, lastName: string) => {
      if (!draft.phone_number || !draft.password) {
        const incompleteError: ApiError = {
          status: 0,
          message: "Not all data has been filled in.",
        };
        setError(incompleteError);
        throw incompleteError;
      }

      if (!draft.registration_token) {
        const tokenError: ApiError = {
          status: 0,
          message: "Registration token is missing",
        };
        setError(tokenError);
        throw tokenError;
      }

      const payload: RegisterPayload = {
        phone_number: draft.phone_number,
        password: draft.password,
        first_name: firstName,
        last_name: lastName,
      };

      setIsSubmitting(true);
      setError(null);
      try {
        await signup(payload, draft.registration_token);
        setDraft((prev) => ({
          ...prev,
          first_name: firstName,
          last_name: lastName,
        }));
      } catch (e) {
        const apiError = toApiError(e);
        setError(apiError);
        throw apiError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [draft.phone_number, draft.password, draft.registration_token],
  );

  const value = useMemo<SignUpContextValue>(
    () => ({
      step,
      draft,
      isSubmitting,
      error,
      setEmail,
      setPhone,
      setPassword,
      submitProfile,
      confirmOtp,
      resendOtp,
    }),
    [
      step,
      draft,
      isSubmitting,
      error,
      setEmail,
      setPhone,
      setPassword,
      submitProfile,
      confirmOtp,
      resendOtp,
    ],
  );

  return (
    <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>
  );
};

export const useSignUp = (): SignUpContextValue => {
  const ctx = useContext(SignUpContext);
  if (!ctx) {
    throw new Error("useSignUp must be used within <SignUpProvider>");
  }
  return ctx;
};
