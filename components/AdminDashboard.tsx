'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight, Briefcase, Check, ExternalLink, FileText, GalleryVerticalEnd,
  Image as ImageIcon, LayoutDashboard, Loader2, LogOut, Plus, Save, Trash2,
  Upload, X,
} from 'lucide-react';
import { supabase, type ContactImage, type HeroImage, type SiteContent, type Work } from '@/lib/supabase';
import type { GalleryItem } from '@/hooks/useGallery';

type Tab = 'overview' | 'copy' | 'works' | 'gallery' | 'images';
type Notice = { kind: 'success' | 'error'; text: string } | null;
type PromiseResult = PromiseLike<{ error: { message: string } | null }>;

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'copy', label: 'Page copy', icon: FileText },
  { id: 'works', label: 'Selected work', icon: Briefcase },
  { id: 'gallery', label: 'Obscura gallery', icon: GalleryVerticalEnd },
  { id: 'images', label: 'Site imagery', icon: ImageIcon },
];

const contentLabels: Record<string, string> = {
  location: 'Location', tagline: 'Artist tagline', availability: 'Availability', practice: 'Practice line',
  location_full: 'Full location', description: 'Description', eyebrow: 'Section eyebrow', title: 'Title',
  title_em: 'Italic title', title_emphasis: 'Italic title', description2: 'Description',
  email: 'Contact email', social_links: 'Social media links',
};

function AdminField({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline
        ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
        : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />}
      {hint && <small>{hint}</small>}
    </label>
  );
}

type SocialLink = { label: string; url: string };

function parseSocialLinks(value: string): SocialLink[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry): SocialLink[] => {
      if (!entry || typeof entry !== 'object') return [];
      const link = entry as Record<string, unknown>;
      return typeof link.label === 'string' && typeof link.url === 'string'
        ? [{ label: link.label, url: link.url }]
        : [];
    });
  } catch {
    return [];
  }
}

function SocialLinksEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const links = parseSocialLinks(value);
  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    onChange(JSON.stringify(links.map((link, linkIndex) => linkIndex === index ? { ...link, ...patch } : link)));
  };

  return (
    <div className="admin-social-editor">
      {links.map((link, index) => (
        <div className="admin-social-row" key={index}>
          <AdminField label="Platform label" value={link.label} onChange={(label) => updateLink(index, { label })} />
          <AdminField label="Profile URL" value={link.url} hint="Use a full https:// link." onChange={(url) => updateLink(index, { url })} />
          <button className="admin-icon-button danger" type="button" onClick={() => onChange(JSON.stringify(links.filter((_, linkIndex) => linkIndex !== index)))} aria-label={`Remove ${link.label || 'social link'}`}><Trash2 size={14} /></button>
        </div>
      ))}
      <button className="admin-button secondary" type="button" onClick={() => onChange(JSON.stringify([...links, { label: '', url: '' }]))}><Plus size={14} /> Add social link</button>
      {!links.length && <small className="admin-social-empty">No social links added yet.</small>}
    </div>
  );
}

function UploadPicker({ 
  accept,
  disabled,
  onFile,
}: {
  accept: string;
  disabled?: boolean;
  onFile: (file: File) => void;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = '';
  };
  return (
    <label className={`admin-upload ${disabled ? 'is-disabled' : ''}`}>
      <Upload size={14} />
      <span>{disabled ? 'Uploading…' : 'Upload file'}</span>
      <input type="file" accept={accept} disabled={disabled} onChange={handleChange} />
    </label>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export default function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [works, setWorks] = useState<Work[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [contactImages, setContactImages] = useState<ContactImage[]>([]);
  const [draftWorks, setDraftWorks] = useState<Set<string>>(new Set());
  const [draftGallery, setDraftGallery] = useState<Set<string>>(new Set());
  const [draftHero, setDraftHero] = useState<Set<string>>(new Set());
  const [draftContact, setDraftContact] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const pendingNewRecordId = useRef<string | null>(null);

  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [workResult, galleryResult, contentResult, heroResult, contactResult] = await Promise.all([
        supabase.from('works').select('*').order('order_index', { ascending: true }),
        supabase.from('gallery_items').select('*').order('order_index', { ascending: true }),
        supabase.from('site_content').select('*').order('section').order('key'),
        supabase.from('hero_images').select('*').order('created_at', { ascending: true }),
        supabase.from('contact_images').select('*').order('created_at', { ascending: true }),
      ]);
      const failure = workResult.error || galleryResult.error || contentResult.error || heroResult.error || contactResult.error;
      if (failure) {
        setNotice({ kind: 'error', text: failure.message });
      } else {
        setWorks((workResult.data || []) as Work[]);
        setGallery((galleryResult.data || []) as GalleryItem[]);
        setContent((contentResult.data || []) as SiteContent[]);
        setHeroImages((heroResult.data || []) as HeroImage[]);
        setContactImages((contactResult.data || []) as ContactImage[]);
      }
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    const id = pendingNewRecordId.current;
    if (!id) return;

    const record = Array.from(document.querySelectorAll<HTMLElement>('[data-admin-record-id]'))
      .find((element) => element.dataset.adminRecordId === id);
    if (!record) return;

    record.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    });
    record.querySelector<HTMLElement>('input:not([type="file"]):not([disabled]), textarea:not([disabled]), select:not([disabled])')
      ?.focus({ preventScroll: true });
    pendingNewRecordId.current = null;
  }, [works, gallery, heroImages, contactImages, tab]);

  const perform = async (successMessage: string, action: () => PromiseResult): Promise<boolean> => {
    setSaving(true);
    setNotice(null);
    try {
      const result = await action();
      if (result.error) throw new Error(result.error.message);
      setNotice({ kind: 'success', text: successMessage });
      await loadData(false);
      return true;
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorMessage(error) });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file: File, folder: string, onUploaded: (url: string) => void) => {
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
    if (!file.type.startsWith('image/') && !isVideo) {
      setNotice({ kind: 'error', text: 'Choose an image or video file.' });
      return;
    }
    if (file.size > maxSize) {
      setNotice({ kind: 'error', text: `File is too large. Maximum size: ${isVideo ? '100 MB' : '20 MB'}.` });
      return;
    }

    setUploading(true);
    setNotice(null);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
      const objectPath = `admin/${folder}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from('content').upload(objectPath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('content').getPublicUrl(objectPath);
      onUploaded(data.publicUrl);
      setNotice({ kind: 'success', text: 'Upload complete. Save the entry to publish this URL.' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorMessage(error) });
    } finally {
      setUploading(false);
    }
  };

  const updateWork = (id: string, patch: Partial<Work>) => setWorks((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateGallery = (id: string, patch: Partial<GalleryItem>) => setGallery((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateSiteContent = (id: string, value: string) => setContent((rows) => rows.map((row) => row.id === id ? { ...row, value } : row));
  const updateHero = (id: string, patch: Partial<HeroImage>) => setHeroImages((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateContact = (id: string, patch: Partial<ContactImage>) => setContactImages((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));

  const makeWork = () => {
    const id = crypto.randomUUID();
    pendingNewRecordId.current = id;
    const order = works.reduce((max, item) => Math.max(max, item.order_index || 0), 0) + 1;
    setWorks((rows) => [...rows, { id, title: 'New project', role: 'Creative direction', year: String(new Date().getFullYear()), image_url: '', size: 'tall', order_index: order, summary: '', story: '', supporting_images: [] }]);
    setDraftWorks((ids) => new Set(ids).add(id));
  };

  const saveWork = (item: Work) => {
    if (!item.title.trim() || !item.image_url.trim()) {
      setNotice({ kind: 'error', text: 'A project needs both a title and an image URL.' });
      return;
    }
    const { id, ...values } = item;
    void perform('Project saved.', () => draftWorks.has(id)
      ? supabase.from('works').insert({ id, ...values })
      : supabase.from('works').update(values).eq('id', id)).then((saved) => {
        if (saved) setDraftWorks((ids) => { const next = new Set(ids); next.delete(id); return next; });
      });
  };

  const deleteWork = (item: Work) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    if (draftWorks.has(item.id)) {
      setWorks((rows) => rows.filter((row) => row.id !== item.id));
      setDraftWorks((ids) => { const next = new Set(ids); next.delete(item.id); return next; });
      return;
    }
    void perform('Project deleted.', () => supabase.from('works').delete().eq('id', item.id));
  };

  const makeGalleryItem = () => {
    const id = crypto.randomUUID();
    pendingNewRecordId.current = id;
    const order = gallery.reduce((max, item) => Math.max(max, item.order_index || 0), 0) + 1;
    setGallery((rows) => [...rows, {
      id, title: 'New study', image_url: '', video_url: null, media_type: 'image', category: 'model',
      aspect_ratio: 'portrait', bg_text: 'OBSCURA', order_index: order, is_featured: false, is_active: true,
    }]);
    setDraftGallery((ids) => new Set(ids).add(id));
  };

  const saveGalleryItem = (item: GalleryItem) => {
    if (!item.image_url.trim()) {
      setNotice({ kind: 'error', text: 'Every gallery item needs a poster or image URL.' });
      return;
    }
    if (item.media_type === 'video' && !item.video_url?.trim()) {
      setNotice({ kind: 'error', text: 'Add a video URL before saving this item as a video.' });
      return;
    }
    const { id, ...values } = item;
    void perform('Gallery item saved.', () => draftGallery.has(id)
      ? supabase.from('gallery_items').insert({ id, ...values })
      : supabase.from('gallery_items').update(values).eq('id', id)).then((saved) => {
        if (saved) setDraftGallery((ids) => { const next = new Set(ids); next.delete(id); return next; });
      });
  };

  const deleteGalleryItem = (item: GalleryItem) => {
    if (!window.confirm(`Delete “${item.title || 'this gallery item'}”? This cannot be undone.`)) return;
    if (draftGallery.has(item.id)) {
      setGallery((rows) => rows.filter((row) => row.id !== item.id));
      setDraftGallery((ids) => { const next = new Set(ids); next.delete(item.id); return next; });
      return;
    }
    void perform('Gallery item deleted.', () => supabase.from('gallery_items').delete().eq('id', item.id));
  };

  const addHero = () => {
    const id = crypto.randomUUID();
    pendingNewRecordId.current = id;
    setHeroImages((rows) => [...rows, { id, image_url: '', alt_text: '', is_active: false }]);
    setDraftHero((ids) => new Set(ids).add(id));
  };

  const saveHero = (item: HeroImage) => {
    if (!item.image_url.trim() || !item.alt_text.trim()) {
      setNotice({ kind: 'error', text: 'Hero images need a URL and descriptive alt text.' });
      return;
    }
    const values = { image_url: item.image_url, alt_text: item.alt_text, is_active: item.is_active };
    void perform('Hero image saved.', () => draftHero.has(item.id)
      ? supabase.from('hero_images').insert({ id: item.id, ...values })
      : supabase.from('hero_images').update(values).eq('id', item.id)).then((saved) => {
        if (saved) setDraftHero((ids) => { const next = new Set(ids); next.delete(item.id); return next; });
      });
  };

  const addContact = () => {
    const id = crypto.randomUUID();
    pendingNewRecordId.current = id;
    setContactImages((rows) => [...rows, { id, image_url: '', caption: '', is_active: false }]);
    setDraftContact((ids) => new Set(ids).add(id));
  };

  const saveContact = (item: ContactImage) => {
    if (!item.image_url.trim() || !item.caption.trim()) {
      setNotice({ kind: 'error', text: 'Contact images need a URL and caption.' });
      return;
    }
    const values = { image_url: item.image_url, caption: item.caption, is_active: item.is_active };
    void perform('Contact image saved.', () => draftContact.has(item.id)
      ? supabase.from('contact_images').insert({ id: item.id, ...values })
      : supabase.from('contact_images').update(values).eq('id', item.id)).then((saved) => {
        if (saved) setDraftContact((ids) => { const next = new Set(ids); next.delete(item.id); return next; });
      });
  };

  const setActiveImage = async (kind: 'hero_images' | 'contact_images', id: string) => {
    await perform('Active image updated.', async () => {
      const deactivate = await supabase.from(kind).update({ is_active: false }).neq('id', id);
      if (deactivate.error) return deactivate;
      return supabase.from(kind).update({ is_active: true }).eq('id', id);
    });
  };

  const deleteImage = (kind: 'hero' | 'contact', id: string) => {
    if (!window.confirm('Delete this image entry? This cannot be undone.')) return;
    if (kind === 'hero' && draftHero.has(id)) {
      setHeroImages((rows) => rows.filter((row) => row.id !== id));
      setDraftHero((ids) => { const next = new Set(ids); next.delete(id); return next; });
      return;
    }
    if (kind === 'contact' && draftContact.has(id)) {
      setContactImages((rows) => rows.filter((row) => row.id !== id));
      setDraftContact((ids) => { const next = new Set(ids); next.delete(id); return next; });
      return;
    }
    void perform('Image entry deleted.', () => supabase.from(kind === 'hero' ? 'hero_images' : 'contact_images').delete().eq('id', id));
  };

  const contentGroups = useMemo(() => {
    const groups: Record<string, SiteContent[]> = {};
    content.forEach((item) => { (groups[item.section] ||= []).push(item); });
    return groups;
  }, [content]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  };

  const pageTitle = tabs.find((item) => item.id === tab)?.label || 'Overview';

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/" aria-label="Yuki home">Y<span>.</span><small>STUDIO CMS</small></a>
        <div className="admin-sidebar-label">Workspace</div>
        <nav className="admin-navigation" aria-label="Admin sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`admin-nav-item ${tab === id ? 'is-active' : ''}`} type="button" onClick={() => setTab(id)}>
              <Icon size={16} strokeWidth={1.6} /><span>{label}</span>{tab === id && <i />}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={14} /> View website</a>
          <button type="button" onClick={signOut}><LogOut size={14} /> Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-breadcrumb">YUKI STUDIO <i>/</i> ADMIN</span><h1>{pageTitle}</h1></div>
          <div className="admin-user"><span className="admin-avatar">{email.slice(0, 1).toUpperCase()}</span><span>{email}</span></div>
        </header>

        {notice && <div className={`admin-notice ${notice.kind}`} role="status"><span>{notice.text}</span><button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={14} /></button></div>}

        {loading ? (
          <div className="admin-loading"><Loader2 size={20} className="admin-spinner" /> Loading your content…</div>
        ) : (
          <div className="admin-content">
            {tab === 'overview' && (
              <>
                <div className="admin-welcome"><div><span className="admin-eyebrow">GOOD TO SEE YOU</span><h2>Your studio,<br /><em>your story.</em></h2><p>Everything here is connected to the live Yuki website.</p></div><div className="admin-welcome-mark">Y<span>.</span></div></div>
                <div className="admin-stat-grid">
                  <StatCard label="Selected work" value={works.length} detail="Portfolio projects" icon={<Briefcase size={17} />} onClick={() => setTab('works')} />
                  <StatCard label="Obscura frames" value={gallery.length} detail={`${gallery.filter((item) => item.is_active).length} visible on site`} icon={<GalleryVerticalEnd size={17} />} onClick={() => setTab('gallery')} />
                  <StatCard label="Copy fields" value={content.length} detail="Across the site" icon={<FileText size={17} />} onClick={() => setTab('copy')} />
                  <StatCard label="Image sets" value={heroImages.length + contactImages.length} detail="Hero & contact" icon={<ImageIcon size={17} />} onClick={() => setTab('images')} />
                </div>
                <div className="admin-overview-bottom"><div className="admin-panel"><span className="admin-eyebrow">QUICK EDIT</span><h3>What would you like to change?</h3><div className="admin-quick-links"><button onClick={() => setTab('copy')} type="button">Edit page copy <ArrowUpRight size={14} /></button><button onClick={() => setTab('works')} type="button">Update selected work <ArrowUpRight size={14} /></button><button onClick={() => setTab('gallery')} type="button">Curate Obscura <ArrowUpRight size={14} /></button></div></div><div className="admin-panel admin-storage-note"><span className="admin-eyebrow">CONTENT STORAGE</span><h3>Media, kept in one place.</h3><p>Upload images and silent video clips directly to your Supabase content bucket. New URLs are saved with each entry.</p></div></div>
              </>
            )}

            {tab === 'copy' && (
              <section className="admin-section">
                <div className="admin-section-heading"><div><span className="admin-eyebrow">LIVE SITE TEXT</span><h2>Words make<br /><em>the feeling.</em></h2></div><p>Change copy without touching code. Limited formatting supports <code>&lt;em&gt;</code> and <code>&lt;br&gt;</code>.</p></div>
                {Object.entries(contentGroups).map(([section, rows]) => (
                  <div className="admin-content-group" key={section}>
                    <div className="admin-group-heading"><div><span className="admin-eyebrow">SECTION</span><h3>{section.replace(/_/g, ' ')}</h3></div><button className="admin-button primary" type="button" disabled={saving} onClick={() => void perform(`${section} copy saved.`, () => supabase.from('site_content').upsert(rows.map(({ section: group, key, value }) => ({ section: group, key, value })), { onConflict: 'section,key' }))}><Save size={14} /> Save section</button></div>
                    <div className="admin-copy-grid">
                      {rows.map((item) => section === 'contact' && item.key === 'social_links'
                        ? <div className="admin-social-field" key={item.id}><span className="admin-eyebrow">SOCIAL PROFILES</span><SocialLinksEditor value={item.value} onChange={(value) => updateSiteContent(item.id, value)} /></div>
                        : <AdminField key={item.id} label={contentLabels[item.key] || item.key.replace(/_/g, ' ')} value={item.value} multiline={item.key.includes('description')} hint={item.key.includes('description') ? 'Safe formatting: <em>italic text</em> and <br> line breaks.' : undefined} onChange={(value) => updateSiteContent(item.id, value)} />)}
                    </div>
                  </div>
                ))}
                {!content.length && <EmptyState text="No site copy found. Run the base Supabase schema to seed site_content." />}
              </section>
            )}

            {tab === 'works' && (
              <section className="admin-section">
                <div className="admin-section-heading"><div><span className="admin-eyebrow">PORTFOLIO / SELECTED WORK</span><h2>Work in<br /><em>good company.</em></h2></div><button className="admin-button primary" type="button" onClick={makeWork}><Plus size={15} /> Add project</button></div>
                <div className="admin-record-list">
                  {works.map((item) => <article className="admin-record" key={item.id} data-admin-record-id={item.id}>
                    <div className="admin-record-preview">{item.image_url ? <img src={item.image_url} alt="" /> : <ImageIcon size={24} />}<span>{String(item.order_index).padStart(2, '0')}</span></div>
                    <div className="admin-record-form">
                      <div className="admin-record-heading"><div><span className="admin-eyebrow">{draftWorks.has(item.id) ? 'NEW PROJECT' : `PROJECT / ${String(item.order_index).padStart(2, '0')}`}</span><h3>{item.title || 'Untitled project'}</h3></div><button className="admin-icon-button danger" type="button" onClick={() => deleteWork(item)} aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></div>
                      <div className="admin-form-grid">
                        <AdminField label="Title" value={item.title} onChange={(value) => updateWork(item.id, { title: value })} />
                        <AdminField label="Role" value={item.role} onChange={(value) => updateWork(item.id, { role: value })} />
                        <AdminField label="Year" value={item.year} onChange={(value) => updateWork(item.id, { year: value })} />
                        <AdminField label="Order" type="number" value={item.order_index} onChange={(value) => updateWork(item.id, { order_index: Number(value) })} />
                        <label className="admin-field"><span>Image size</span><select value={item.size} onChange={(event) => updateWork(item.id, { size: event.target.value as Work['size'] })}><option value="tall">Portrait / tall</option><option value="short">Landscape / short</option></select></label>
                        <div className="admin-field"><span>Upload image</span><UploadPicker accept="image/*" disabled={uploading} onFile={(file) => void uploadFile(file, 'portfolio', (url) => updateWork(item.id, { image_url: url }))} /></div>
                        <AdminField label="Image URL" value={item.image_url} onChange={(value) => updateWork(item.id, { image_url: value })} />
                        <AdminField label="Project summary" value={item.summary || ''} multiline onChange={(value) => updateWork(item.id, { summary: value })} />
                        <AdminField label="Project story" value={item.story || ''} multiline hint="A short note about the collaboration, process, or idea behind this work." onChange={(value) => updateWork(item.id, { story: value })} />
                        <div className="admin-field"><span>Upload supporting image</span><UploadPicker accept="image/*" disabled={uploading} onFile={(file) => void uploadFile(file, 'project-stories', (url) => updateWork(item.id, { supporting_images: [...(item.supporting_images || []), url] }))} /></div>
                        <AdminField label="Supporting image URLs" value={(item.supporting_images || []).join('\n')} multiline hint="One image URL per line. Remove a line to remove that supporting image." onChange={(value) => updateWork(item.id, { supporting_images: value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean) })} />
                      </div>
                      <div className="admin-record-actions"><span>{draftWorks.has(item.id) ? 'Save to publish this project.' : 'Changes are saved to the live site.'}</span><button className="admin-button primary" type="button" disabled={saving} onClick={() => saveWork(item)}><Save size={14} /> Save project</button></div>
                    </div>
                  </article>)}
                  {!works.length && <EmptyState text="No selected work yet. Add a project to get started." />}
                </div>
              </section>
            )}

            {tab === 'gallery' && (
              <section className="admin-section">
                <div className="admin-section-heading"><div><span className="admin-eyebrow">OBSCURA / FRAME INDEX</span><h2>Curate the<br /><em>archive.</em></h2></div><button className="admin-button primary" type="button" onClick={makeGalleryItem}><Plus size={15} /> Add frame</button></div>
                <div className="admin-gallery-list">
                  {gallery.map((item) => <article className={`admin-gallery-record ${item.is_active ? '' : 'is-hidden'}`} key={item.id} data-admin-record-id={item.id}>
                    <div className="admin-gallery-preview">{item.image_url ? <img src={item.image_url} alt="" /> : <ImageIcon size={24} />}<span>{String(item.order_index).padStart(2, '0')}</span></div>
                    <div className="admin-gallery-form">
                      <div className="admin-record-heading"><div><span className="admin-eyebrow">{item.is_active ? 'VISIBLE IN OBSCURA' : 'HIDDEN FROM OBSCURA'}</span><h3>{item.title || 'Untitled frame'}</h3></div><button className="admin-icon-button danger" type="button" onClick={() => deleteGalleryItem(item)} aria-label={`Delete ${item.title || 'gallery item'}`}><Trash2 size={15} /></button></div>
                      <div className="admin-form-grid">
                        <AdminField label="Title" value={item.title || ''} onChange={(value) => updateGallery(item.id, { title: value })} />
                        <AdminField label="Order" type="number" value={item.order_index} onChange={(value) => updateGallery(item.id, { order_index: Number(value) })} />
                        <AdminField label="Image / poster URL" value={item.image_url} onChange={(value) => updateGallery(item.id, { image_url: value })} />
                        <div className="admin-field"><span>Upload image / poster</span><UploadPicker accept="image/*" disabled={uploading} onFile={(file) => void uploadFile(file, 'gallery', (url) => updateGallery(item.id, { image_url: url }))} /></div>
                        <label className="admin-field"><span>Media type</span><select value={item.media_type} onChange={(event) => updateGallery(item.id, { media_type: event.target.value as GalleryItem['media_type'] })}><option value="image">Still image</option><option value="video">Silent video</option></select></label>
                        <AdminField label="Video URL" value={item.video_url || ''} onChange={(value) => updateGallery(item.id, { video_url: value || null })} />
                        <div className="admin-field"><span>Upload video</span><UploadPicker accept="video/mp4,video/webm" disabled={uploading} onFile={(file) => void uploadFile(file, 'gallery', (url) => updateGallery(item.id, { video_url: url, media_type: 'video' }))} /></div>
                        <label className="admin-field"><span>Category</span><select value={item.category} onChange={(event) => updateGallery(item.id, { category: event.target.value as GalleryItem['category'] })}><option value="dancer">Dancer</option><option value="model">Model</option><option value="producer">Producer</option><option value="fashion">Fashion</option></select></label>
                        <label className="admin-field"><span>Aspect ratio</span><select value={item.aspect_ratio} onChange={(event) => updateGallery(item.id, { aspect_ratio: event.target.value as GalleryItem['aspect_ratio'] })}><option value="portrait">Portrait</option><option value="landscape">Landscape</option><option value="square">Square</option></select></label>
                        <AdminField label="Backdrop word" value={item.bg_text} onChange={(value) => updateGallery(item.id, { bg_text: value })} />
                      </div>
                      <div className="admin-checkbox-row"><label><input type="checkbox" checked={item.is_active} onChange={(event) => updateGallery(item.id, { is_active: event.target.checked })} /> Visible on the website</label><label><input type="checkbox" checked={item.is_featured} onChange={(event) => updateGallery(item.id, { is_featured: event.target.checked })} /> Featured</label></div>
                      <div className="admin-record-actions"><span>Images use a poster; video files play silently in the gallery.</span><button className="admin-button primary" type="button" disabled={saving} onClick={() => saveGalleryItem(item)}><Save size={14} /> Save frame</button></div>
                    </div>
                  </article>)}
                  {!gallery.length && <EmptyState text="No gallery frames found. Run supabase-gallery-schema.sql, then add your first frame." />}
                </div>
              </section>
            )}

            {tab === 'images' && (
              <section className="admin-section">
                <div className="admin-section-heading"><div><span className="admin-eyebrow">IMAGE LIBRARY</span><h2>Set the<br /><em>scene.</em></h2></div><p>Choose which image leads the homepage and which portrait closes the page.</p></div>
                <ImageCollection title="Hero images" description="The full-bleed opening portrait." items={heroImages} drafts={draftHero} saving={saving} uploading={uploading} onAdd={addHero} onUpdate={updateHero} onSave={saveHero} onActivate={(id) => void setActiveImage('hero_images', id)} onDelete={(id) => deleteImage('hero', id)} onUpload={(file, done) => void uploadFile(file, 'hero', done)} />
                <ImageCollection title="Contact portraits" description="The image paired with the final contact section." items={contactImages} drafts={draftContact} saving={saving} uploading={uploading} onAdd={addContact} onUpdate={updateContact} onSave={saveContact} onActivate={(id) => void setActiveImage('contact_images', id)} onDelete={(id) => deleteImage('contact', id)} onUpload={(file, done) => void uploadFile(file, 'contact', done)} />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, detail, icon, onClick }: { label: string; value: number; detail: string; icon: ReactNode; onClick: () => void }) {
  return <button className="admin-stat-card" type="button" onClick={onClick}><span className="admin-stat-icon">{icon}</span><span className="admin-stat-label">{label}</span><strong>{String(value).padStart(2, '0')}</strong><small>{detail}</small></button>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="admin-empty"><ImageIcon size={20} /><p>{text}</p></div>;
}

function ImageCollection<T extends HeroImage | ContactImage>({
  title,
  description,
  items,
  drafts,
  saving,
  uploading,
  onAdd,
  onUpdate,
  onSave,
  onActivate,
  onDelete,
  onUpload,
}: {
  title: string;
  description: string;
  items: T[];
  drafts: Set<string>;
  saving: boolean;
  uploading: boolean;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<T>) => void;
  onSave: (item: T) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (file: File, done: (url: string) => void) => void;
}) {
  const isHero = title === 'Hero images';
  return (
    <div className="admin-image-collection">
      <div className="admin-group-heading"><div><span className="admin-eyebrow">{items.length} IMAGE ENTRIES</span><h3>{title}</h3><p>{description}</p></div><button className="admin-button secondary" type="button" onClick={onAdd}><Plus size={14} /> Add image</button></div>
      <div className="admin-image-list">
        {items.map((item) => {
          const imageUrl = item.image_url;
          const active = item.is_active;
          const isDraft = drafts.has(item.id);
          return <article className={`admin-image-record ${active ? 'is-active' : ''}`} key={item.id} data-admin-record-id={item.id}>
            <div className="admin-image-preview">{imageUrl ? <img src={imageUrl} alt="" /> : <ImageIcon size={22} />}<span>{active ? 'LIVE' : isDraft ? 'NEW' : 'INACTIVE'}</span></div>
            <div className="admin-image-fields">
              <div className="admin-form-grid">
                <AdminField label="Image URL" value={imageUrl} onChange={(value) => onUpdate(item.id, { image_url: value } as Partial<T>)} />
                {isHero
                  ? <AdminField label="Alt text" value={(item as HeroImage).alt_text} onChange={(value) => onUpdate(item.id, { alt_text: value } as unknown as Partial<T>)} />
                  : <AdminField label="Caption" value={(item as ContactImage).caption} onChange={(value) => onUpdate(item.id, { caption: value } as unknown as Partial<T>)} />}
                <div className="admin-field"><span>Upload replacement</span><UploadPicker accept="image/*" disabled={uploading} onFile={(file) => onUpload(file, (url) => onUpdate(item.id, { image_url: url } as Partial<T>))} /></div>
              </div>
              <div className="admin-record-actions"><span>{active ? 'Currently shown on the live website.' : 'Save this image, then set it live when ready.'}</span><div className="admin-action-group"><button className="admin-icon-button danger" type="button" onClick={() => onDelete(item.id)} aria-label="Delete image"><Trash2 size={14} /></button><button className="admin-button secondary" type="button" disabled={saving || isDraft} onClick={() => onActivate(item.id)}>{active ? <><Check size={13} /> Live</> : 'Set live'}</button><button className="admin-button primary" type="button" disabled={saving} onClick={() => onSave(item)}><Save size={14} /> Save</button></div></div>
            </div>
          </article>;
        })}
        {!items.length && <EmptyState text="No image entries yet. Add one or upload a new image." />}
      </div>
    </div>
  );
}
