export type PasswordScreenMode = "single" | "multiple";

export type PasswordScreenVariant = "default" | "forgot-password";

export type PasswordScreenProps = {
  email?: string;
  mode?: PasswordScreenMode;
  variant?: PasswordScreenVariant;
};
