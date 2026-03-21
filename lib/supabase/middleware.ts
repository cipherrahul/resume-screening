import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // If user is not logged in and trying to access protected routes
  if (!user && !['/login', '/signup', '/auth/callback', '/'].includes(url.pathname)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in, handle role-based redirection from root or login
  if (user && (url.pathname === '/' || url.pathname === '/login')) {
    // Check metadata first (fastest)
    const role = user.user_metadata?.role;
    
    if (role === 'admin') {
      url.pathname = '/admin/dashboard';
    } else if (role === 'recruiter') {
      url.pathname = '/recruiter/dashboard';
    } else if (role === 'applicant') {
      url.pathname = '/applicant/dashboard';
    } else {
      // Fallback to database
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        url.pathname = '/admin/dashboard';
      } else if (profile?.role === 'recruiter') {
        url.pathname = '/recruiter/dashboard';
      } else {
        url.pathname = '/applicant/dashboard';
      }
    }
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user) {
    const role = user.user_metadata?.role;
    
    // Admin isolation: restrict to /admin
    if (role === 'admin' && (url.pathname.startsWith('/recruiter') || url.pathname.startsWith('/applicant'))) {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Recruiter isolation: restrict to /recruiter
    if (role === 'recruiter' && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/applicant'))) {
      url.pathname = '/recruiter/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Applicant isolation: restrict to /applicant
    if (role === 'applicant' && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/recruiter'))) {
      url.pathname = '/applicant/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
