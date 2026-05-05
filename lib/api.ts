import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import {
  adminClient,
  organizationClient,
  emailOTPClient,
} from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const secureStorage = {
  getItem: (key: string) => SecureStore.getItem(key),
  setItem: (key: string, value: string) => SecureStore.setItem(key, value),
  deleteItem: (key: string) => SecureStore.deleteItem(key),
};

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme: "publeader",
      storagePrefix: "publeader",
      storage: secureStorage,
    }),
    adminClient(),
    organizationClient(),
    emailOTPClient(),
  ],
});
