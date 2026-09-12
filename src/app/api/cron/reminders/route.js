import { NextResponse } from 'next/server';
import { processReminders } from '@/lib/notifications';

export async function GET(request) {
  const auth = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  const vercelCron = request.headers.get('x-vercel-cron');

  const authorized =
    (secret && auth === `Bearer ${secret}`) ||
    (!!vercelCron && !secret) ||
    (secret && request.headers.get('x-cron-secret') === secret);

  if (!authorized) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processReminders();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
