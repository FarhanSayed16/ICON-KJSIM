import { NextResponse } from 'next/server';
import { EVENTS } from '@/lib/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const active = searchParams.get('active');

  let list = [...EVENTS];
  if (category && category !== 'all') {
    list = list.filter((e) => e.category === category);
  }
  if (active === 'true') {
    list = list.filter((e) => e.isActive);
  }

  return NextResponse.json({ success: true, data: list });
}
