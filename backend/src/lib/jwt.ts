import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AccessTokenPayload = {
  sub: string;
  roles: string[];
};

/** Seul le jeton d'acces est un JWT (courte duree, non revocable individuellement
 * mais son impact est limite par sa duree de vie courte). Le jeton de
 * rafraichissement est un secret opaque stocke hashe en base (voir refreshTokens.ts). */
export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessTtl as any });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}
