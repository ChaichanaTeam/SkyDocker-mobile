export const createEmptyOtpCode = (length: number) =>
  Array.from({ length }, () => "");

export const normalizeOtpInput = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").split("");

export const applyOtpInput = (
  currentCode: string[],
  startIndex: number,
  value: string
) => {
  const nextCode = [...currentCode];
  const characters = normalizeOtpInput(value);

  characters.forEach((character, offset) => {
    const targetIndex = startIndex + offset;

    if (targetIndex < nextCode.length) {
      nextCode[targetIndex] = character;
    }
  });

  return nextCode;
};

export const getPreviousOtpIndex = (index: number) => Math.max(index - 1, 0);

export const getNextOtpIndex = (
  startIndex: number,
  value: string,
  codeLength: number
) => {
  const inputLength = Math.max(normalizeOtpInput(value).length, 1);

  return Math.min(startIndex + inputLength, codeLength - 1);
};

export const isOtpCodeComplete = (code: string[]) =>
  code.every((character) => character.length === 1);
