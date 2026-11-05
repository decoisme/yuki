'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Loader2, LockKeyhole } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [notAdmin, setNotAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNotAdmin(new URLSearchParams(window.location.search).get('error') === 'not-admin');
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (mounted && data.user?.app_metadata?.role === 'admin') router.replace('/admin');
    });
    return () => { mounted = false; };
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setBusy(false);
      return;
    }
    if (data.user?.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('This account is not authorized to manage the site.');
      setBusy(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  };

  return (
    <main className="admin-login-page">
      <a className="admin-login-mark" href="/" aria-label="Return to Yuki website">Y<span>.</span></a>
      <div className="admin-login-card">
        <span className="admin-login-icon"><LockKeyhole size={17} strokeWidth={1.5} /></span>
        <span className="admin-eyebrow">YUKI STUDIO / PRIVATE ACCESS</span>
        <h1>Welcome<br /><em>back.</em></h1>
        <p>Sign in with your authorized studio account.</p>
        {notAdmin && <div className="admin-login-error">This account does not have studio administrator access.</div>}
        {error && <div className="admin-login-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="admin-field"><span>Email address</span><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="admin-field"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="admin-login-submit" type="submit" disabled={busy}>{busy ? <Loader2 className="admin-spinner" size={15} /> : <>Enter studio <ArrowUpRight size={15} /></>}</button>
        </form>
      </div>
      <span className="admin-login-footer">INDEPENDENT BY NATURE · COLLABORATIVE BY DESIGN</span>
    </main>
  );
}
