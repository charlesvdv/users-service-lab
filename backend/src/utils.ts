import { env } from "process";

export function GetJwtKey() {
    return env.JWT_SECRET || "secret";
}
