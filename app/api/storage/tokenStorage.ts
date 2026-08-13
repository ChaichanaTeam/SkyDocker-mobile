import * as SecureStore from "expo-secure-store";

const KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
} as const;

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  await SecureStore.setItemAsync(KEYS.ACCESS, accessToken);
  await SecureStore.setItemAsync(KEYS.REFRESH, refreshToken);
};

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.REFRESH);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.ACCESS);
  await SecureStore.deleteItemAsync(KEYS.REFRESH);
}
