import type { TokenType } from "./types";
import { v4 as uuidv4 } from "uuid";

// Token prefix constants
const TOKEN_PREFIXES = {
  "one-time": "one-time",
  monthly: "monthly",
  yearly: "yearly",
};

// Validate a token and extract its type
export const validateToken = (
  token: string
): { isValid: boolean; tokenType: TokenType } => {
  if (!token) return { isValid: false, tokenType: "free" };

  if (token.startsWith(TOKEN_PREFIXES["one-time"])) {
    return { isValid: true, tokenType: "one-time" };
  }

  if (token.startsWith(TOKEN_PREFIXES.monthly)) {
    return { isValid: true, tokenType: "monthly" };
  }

  if (token.startsWith(TOKEN_PREFIXES.yearly)) {
    return { isValid: true, tokenType: "yearly" };
  }

  return { isValid: false, tokenType: "free" };
};

// Get token from localStorage (client-side only)
export const getTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("summaraize_token");
};

// Set token in localStorage (client-side only)
export const setTokenInStorage = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("summaraize_token", token);
};

// Remove token from localStorage (client-side only)
export const removeTokenFromStorage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("summaraize_token");
};

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";

  let userId = localStorage.getItem("summaraize_uid");
  if (!userId) {
    userId = uuidv4(); // 🔁 replace crypto.randomUUID()
    localStorage.setItem("summaraize_uid", userId);
  }
  return userId;
}
