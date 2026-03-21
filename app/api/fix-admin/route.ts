import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Identify the admin user
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });
  
  const adminUser = users.users.find(u => u.email === '19bcs1677@gmail.com');
  
  if (!adminUser) {
    return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
  }

  // 2. Update their metadata
  const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
    user_metadata: { ...adminUser.user_metadata, role: 'admin' }
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 3. Ensure profile is correct too
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
      id: adminUser.id, 
      role: 'admin', 
      full_name: adminUser.user_metadata.full_name || 'Rahul Admin' 
    });

  return NextResponse.json({ 
    message: 'Admin metadata fixed', 
    metadata: updatedUser.user.user_metadata,
    profileStatus: profileError ? 'failed' : 'ok'
  });
}
