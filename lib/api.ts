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

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme: "driveads",
      storagePrefix: "driveads",
      storage: SecureStore,
    }),
    adminClient(),
    organizationClient(),
    emailOTPClient(),
  ],
});
