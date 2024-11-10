import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

export function generateToken(byteCount = 20): string {
  const bytes = new Uint8Array(byteCount);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export function hashToken(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}
