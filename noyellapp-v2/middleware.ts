import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = ['/en/home', '/en/library', '/en/ai', '/en/settings'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (PROTECTED.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/en/login', request.url));
    }
    return NextResponse.next({ request });
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user && PROTECTED.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/en/login', request.url));
    }

    if (user && (path === '/en/login' || path === '/en/verify')) {
      return NextResponse.redirect(new URL('/en/home', request.url));
    }

    if (user && PROTECTED.some(p => path.startsWith(p))) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('has_access').eq('id', user.id).single();
      if (profileError || !profile?.has_access) {
        return NextResponse.redirect(new URL('/en/no-access', request.url));
      }
    }

    return supabaseResponse;
  } catch {
    if (PROTECTED.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/en/login', request.url));
    }
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
