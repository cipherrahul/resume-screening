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

  // 1. Explicitly allow public pages and API routes to bypass all authenticated redirect logic
  const isPublicPage = ['/login', '/signup', '/auth/callback'].includes(url.pathname);
  const isApiRoute = url.pathname.startsWith('/api');
  
  // Check for API key bypass (ONLY for /api/jobs)
  const apiKey = url.searchParams.get('api_key');
  const isValidApiKey = apiKey === 'RK_INSTITUTION_API_KEY_2026';
  const isJobsApi = url.pathname === '/api/jobs';

  if (isPublicPage || (isJobsApi && isValidApiKey)) {
    return supabaseResponse;
  }

  // Preserve public access to jobs API if no key is provided (as per route.ts comment)
  if (isJobsApi && !apiKey) {
    return supabaseResponse;
  }

  // 2. If user is NOT logged in and trying to access protected routes
  if (!user && url.pathname !== '/') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 3. If user is logged in, handle role-based redirection ONLY from root (optional, but keep for convenience)
  if (user && url.pathname === '/') {
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
