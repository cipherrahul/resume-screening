'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createRecruiterAction(formData: FormData) {
  const adminClient = await createAdminClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const company = formData.get('company') as string;

  if (!email || !password || !fullName) {
    return { success: false, error: 'All fields are required' };
  }

  // 1. Create User in Auth
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: 'recruiter',
      company_name: company
    }
  });

  if (authError) {
    console.error('Auth creation error:', authError);
    return { success: false, error: authError.message };
  }

  // 2. Ensure user_roles entry (though middleware/trigger should handle it, we do it explicitly for safety)
  const { error: roleError } = await adminClient
    .from('user_roles')
    .insert({
      user_id: authData.user.id,
      role: 'recruiter'
    });

  if (roleError) {
    console.error('Role assignment error:', roleError);
    // Note: We don't necessarily fail here if the user was created, 
    // but the recruiter might not have access until role is fixed.
  }

  revalidatePath('/admin/recruiters');
  return { success: true };
}

export async function deleteRecruiterAction(userId: string) {
  const adminClient = await createAdminClient();
  
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/recruiters');
  return { success: true };
}
