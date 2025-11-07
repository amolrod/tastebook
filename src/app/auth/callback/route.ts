import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  if (!hasSupabaseEnv) {
    return NextResponse.redirect(new URL('/login?error=supabase', request.url));
  }

  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL('/app', request.url));
}
