import { NextResponse } from 'next/server';
import { checkinUser } from '@/app/actions/checkinUser';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await checkinUser(body.qrCode, body.checkedInBy || '');

    if (result.status === 'invalid') {
      return NextResponse.json(result, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
