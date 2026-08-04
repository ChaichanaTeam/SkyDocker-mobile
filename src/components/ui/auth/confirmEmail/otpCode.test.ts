import {
  applyOtpInput,
  createEmptyOtpCode,
  getNextOtpIndex,
  getPreviousOtpIndex,
  isOtpCodeComplete,
} from "./otpCode";

describe("otpCode", () => {
  it("creates an empty code with the requested length", () => {
    expect(createEmptyOtpCode(6)).toEqual(["", "", "", "", "", ""]);
  });

  it("fills typed characters from the selected index", () => {
    const code = createEmptyOtpCode(6);

    expect(applyOtpInput(code, 0, "6a1f4d")).toEqual([
      "6",
      "a",
      "1",
      "f",
      "4",
      "d",
    ]);
  });

  it("ignores non-alphanumeric characters", () => {
    const code = createEmptyOtpCode(6);

    expect(applyOtpInput(code, 2, "1- f")).toEqual([
      "",
      "",
      "1",
      "f",
      "",
      "",
    ]);
  });

  it("clears the selected box when its input is emptied", () => {
    expect(applyOtpInput(["6", "a", "1", "", "", ""], 1, "")).toEqual([
      "6",
      "",
      "1",
      "",
      "",
      "",
    ]);
  });

  it("moves to the previous input when backspacing an empty box", () => {
    expect(getPreviousOtpIndex(3)).toBe(2);
    expect(getPreviousOtpIndex(0)).toBe(0);
  });

  it("moves to the next empty input after typed input", () => {
    expect(getNextOtpIndex(0, "6", 6)).toBe(1);
    expect(getNextOtpIndex(0, "6a1f4d", 6)).toBe(5);
  });

  it("keeps the selected input for empty or invalid-only values", () => {
    expect(getNextOtpIndex(2, "", 6)).toBe(2);
    expect(getNextOtpIndex(2, "- ", 6)).toBe(2);
  });

  it("reports completion only when every box has a character", () => {
    expect(isOtpCodeComplete(["6", "a", "1", "f", "4", "d"])).toBe(true);
    expect(isOtpCodeComplete(["6", "a", "", "f", "4", "d"])).toBe(false);
  });
});
