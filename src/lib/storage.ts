import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const PIN_KEY = "auth_pin";

const isWeb = Platform.OS === "web";

const setItem = async (key: string, value: string) => {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const getItem = async (key: string) => {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const removeItem = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

export const saveToken = async (token: string) => {
  await setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await getItem(TOKEN_KEY);
};

export const clearToken = async () => {
  await removeItem(TOKEN_KEY);
};

export const savePin = async (pin: string) => {
  await setItem(PIN_KEY, pin);
};

export const getPin = async () => {
  return await getItem(PIN_KEY);
};

export const clearPin = async () => {
  await removeItem(PIN_KEY);
};
