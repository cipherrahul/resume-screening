'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?error=' + error.message);
  }

  // Get user role to redirect properly
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect('/login');
  }

  // Combine metadata and DB check for robustness
  const role = user.user_metadata?.role;

  if (role === 'admin') return redirect('/admin/dashboard');
  if (role === 'recruiter') return redirect('/recruiter/dashboard');
  if (role === 'applicant') return redirect('/applicant/dashboard');

  // Final fallback to DB if metadata is somehow missing
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') return redirect('/admin/dashboard');
  if (profile?.role === 'recruiter') return redirect('/recruiter/dashboard');
  return redirect('/applicant/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const role = formData.get('role') as string;

  // Security: Only allow public signup for applicants
  if (role === 'recruiter' || role === 'admin') {
    return redirect('/login?error=Registration is closed for this role. Contact administrator.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role || 'applicant',
      },
    },
  });

  if (error) {
    return redirect('/login?error=' + error.message);
  }

  return redirect('/login?message=Check your email to confirm your account.');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/login');
}
