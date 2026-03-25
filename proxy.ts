import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}


// Run on all routes to ensure full control
export const config = {
  matcher: '/:path*',
};
