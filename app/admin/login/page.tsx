import type { Metadata } from 'next';
import AdminLogin from '@/components/AdminLogin';

export const metadata: Metadata = {
  title: 'Admin Login — Yuki Studio',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
