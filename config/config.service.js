import dotenv from "dotenv";
import { resolve } from "node:path";

const NODE_ENV = process.env.NODE_ENV;

let envPath = {
  development: ".env.development",
  production: ".env.production",
};

dotenv.config({ path: resolve(`config/${envPath[NODE_ENV]}`) });

export const port_config = +process.env.PORT;
export const salt_rounds_config = +process.env.SALT_ROUNDS;
export const db_uri_config = process.env.DB_URI;
export const secret_key_config = process.env.SECRET_KEY;
export const refresh_key_config = process.env.REFRESH_KEY;
export const prefix_auth_key_config = process.env.PREFIX_AUTH_KEY;
