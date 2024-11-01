import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/definitions';
import _ from 'lodash';
import { cookies } from 'next/headers';

//loaded from .env file
const secretKey = _.pick(process.env, ['SESSION_SECRET']);

const encodedKey = new TextEncoder().encode(`${secretKey.SESSION_SECRET}`);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session', error);
  }
}

// create session
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const encryptedSession = await encrypt({ userId, expiresAt });
  const sessionCookie = (await cookies()).set('session', encryptedSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  console.log('sessionCookie', sessionCookie);
  // return sessionCookie;
}
