import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const fullUrl = `${protocol}://${host}/drawing/index.html`;
  
  return NextResponse.redirect(fullUrl);
}
