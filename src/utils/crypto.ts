import crypto from "crypto";

const ALGO = "aes-256-gcm";

export function encryptAesGcm(
  plain: string,
  key: Buffer,
  aad?: string
): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  if (aad) cipher.setAAD(Buffer.from(aad, "utf8"));

  const ciphertext = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  // iv(12) + tag(16) + ciphertext
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

export function decryptAesGcm(
  payloadB64: string,
  key: Buffer,
  aad?: string
): string {
  const payload = Buffer.from(payloadB64, "base64");
  if (payload.length < 12 + 16) throw new Error("Invalid payload length");

  const iv = payload.subarray(0, 12);
  const tag = payload.subarray(12, 28);
  const ciphertext = payload.subarray(28);

  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  if (aad) decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(tag);

  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}
