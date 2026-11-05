import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin — Yuki Studio',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/admin/login');
  if (user.app_metadata?.role !== 'admin') return redirect('/admin/login?error=not-admin');

  return <AdminDashboard email={user.email || 'Studio admin'} />;
}
