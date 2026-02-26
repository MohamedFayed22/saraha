import { compareSync, hashSync } from "bcrypt";

export function Hash(plainText, salt_rounds) {
  return hashSync(plainText, salt_rounds);
}

export function Compare(plain_text, cipher_text) {
  return compareSync(plain_text, cipher_text);
}
