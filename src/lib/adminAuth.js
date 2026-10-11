import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function verifyAdmin() {
  const token = (await cookies()).get('icon_admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    throw new Error('Unauthorized');
  }
}
