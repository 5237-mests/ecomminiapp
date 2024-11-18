import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/definitions';
// import _ from 'lodash';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

//loaded from .env file
// const secretKey = _.pick(process.env, ['SESSION_SECRET']);
const secretKey = process.env.SESSION_SECRET as string;

const encodedKey = new TextEncoder().encode(secretKey);

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
    return { error: `Invalid session ${error}` };
  }
}

// create session
export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const encryptedSession = await encrypt({ userId, role, expiresAt });
  return (await cookies()).set('session', encryptedSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

//update session
export async function updateSession(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const parsed = await decrypt(session);

  if (!session || !parsed) return;

  parsed.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed as SessionPayload),
    httpOnly: true,
    secure: true,
    expires: parsed.expiresAt as Date,
    sameSite: 'lax',
    path: '/',
  });
}

// delete session
export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.delete('session');
  return sessionCookie;
}

// get session
export async function getSession() {
  const session = cookies().get('session')?.value;
  console.log('cookies', cookies());
  return decrypt(session);
}
