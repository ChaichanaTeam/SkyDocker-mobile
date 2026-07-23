export type PasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "Password must be 8 characters long", test: (p) => p.length >= 8 },
  {
    label: "Password must have at least 1 symbol",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
  {
    label: "Password must have at least 1 number",
    test: (p) => /[0-9]/.test(p),
  },
  {
    label: "Password must have at least 1 uppercase",
    test: (p) => /[A-Z]/.test(p),
  },
];

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) =>
    requirement.test(password),
  );
}
