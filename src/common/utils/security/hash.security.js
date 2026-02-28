import { compareSync, hashSync } from "bcrypt";
import {salt_rounds_config} from "../../../../config/config.service.js";

export function Hash(plainText, salt_rounds = salt_rounds_config) {
  return hashSync(plainText, Number(salt_rounds));
}

export function Compare(plain_text, cipher_text) {
  return compareSync(plain_text, cipher_text);
}
