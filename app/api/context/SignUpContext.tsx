import { requestOtp, signup, verifyOtp } from "@app/api/services/auth.service";
import type { SignUpContextValue } from "@app/api/context/types/SignUpContext.types";
import { isApiError } from "@app/api/types/apiError";
import type { ApiError } from "@app/api/types/apiError";
import type { RegistrationDraft, RegistrationStep } from "@app/api/types/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const SignUpContext = createContext<SignUpContextValue | undefined>(undefined);

const toApiError = (e: unknown): ApiError =>
  isApiError(e)
    ? e
    : {
        kind: "invalid-response",
        status: 0,
        message: "Unknown error",
      };

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<RegistrationStep>("email");
  const [draft, setDraft] = useState<RegistrationDraft>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistrationSubmittingRef = useRef(false);
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

  const confirmOtp = useCallback(
    async (otp: string) => {
      if (!draft.verify_token) {
        const tokenError: ApiError = {
          kind: "configuration",
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
        setStep("password");
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

  const submitRegistration = useCallback(
    async (password: string) => {
      if (!draft.registration_token) {
        const tokenError: ApiError = {
          kind: "configuration",
          status: 0,
          message: "Registration token is missing",
        };
        setError(tokenError);
        throw tokenError;
      }

      if (isRegistrationSubmittingRef.current) return;

      isRegistrationSubmittingRef.current = true;
      setIsSubmitting(true);
      setError(null);
      try {
        await signup(password, draft.registration_token);
      } catch (e) {
        const apiError = toApiError(e);
        setError(apiError);
        throw apiError;
      } finally {
        isRegistrationSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [draft.registration_token],
  );

  const value = useMemo<SignUpContextValue>(
    () => ({
      step,
      draft,
      isSubmitting,
      error,
      setEmail,
      submitRegistration,
      confirmOtp,
      resendOtp,
    }),
    [
      step,
      draft,
      isSubmitting,
      error,
      setEmail,
      submitRegistration,
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
