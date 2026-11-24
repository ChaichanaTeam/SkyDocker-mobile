import type {
  AvailableCheckInHeightParams,
  CheckInSheetHeightParams,
} from "../types/checkInSheetHeight";

export const getCheckInSheetHeight = ({
  availableHeight,
  chromeHeight,
  contentHeight,
}: CheckInSheetHeightParams): number =>
  Math.min(availableHeight, chromeHeight + contentHeight);

export const getAvailableCheckInHeight = ({
  keyboardHeight,
  topGap,
  topInset,
  windowHeight,
}: AvailableCheckInHeightParams): number =>
  Math.max(0, windowHeight - Math.max(topInset, keyboardHeight) - topGap);
