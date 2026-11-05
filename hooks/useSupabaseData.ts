import { useEffect, useState } from 'react';
import { supabase, Work, HeroImage, ContactImage, SiteContent } from '@/lib/supabase';

// Fallback data untuk development tanpa Supabase
const fallbackWorks: Work[] = [
  { id: '01', title: 'Soft Structures', role: 'Movement direction', year: '2025', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1800&q=85', size: 'tall', order_index: 1 },
  { id: '02', title: 'Nocturne, 04', role: 'Campaign · Model', year: '2024', image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=85', size: 'short', order_index: 2 },
  { id: '03', title: 'A Study in Blue', role: 'Creative direction', year: '2024', image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85', size: 'short', order_index: 3 },
  { id: '04', title: 'Body / Object', role: 'Dancer · Performer', year: '2023', image_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1800&q=85', size: 'tall', order_index: 4 },
];


const fallbackContactImage: ContactImage = {
  id: '1',
  image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85',
  caption: 'Yuki, between takes · 2025',
  is_active: true,
};

const fallbackContent: Record<string, Record<string, string>> = {
  hero: {
    location: 'Jakarta, Indonesia',
    tagline: 'Independent artist',
    availability: 'Available for select projects',
    practice: 'A practice in presence',
  },
  intro: {
    location_full: 'Jakarta, ID · 6°12\' S',
    description: 'I work with <em>movement</em>, image, and feeling — shaping moments that stay with you.',
  },
  section2: {
    eyebrow: '02 / Selected work',
    title: 'In good',
    title_em: 'company.',
    description: 'A collection of collaborations<br />and quiet obsessions.',
  },
  contact: {
    eyebrow: '03 / The next thing',
    title: 'Have a good',
    title_em: 'feeling?',
    description: 'For projects, collaborations, and everything in between.',
    email: 'hello@yuki.studio',
    social_links: '[{"label":"Instagram","url":"https://instagram.com"},{"label":"Vimeo","url":"https://vimeo.com"}]',
  },
  footer: {
    location: 'Jakarta · Available in Indonesia',
  },
  menu: {
    location: 'Jakarta · Indonesia',
  },
};

export function useWorks() {
  const [works, setWorks] = useState<Work[]>(fallbackWorks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchWorks() {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setWorks(data);
        }
      } catch (err) {
        console.warn('Using fallback works data:', err);
        setError(err as Error);
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchWorks();
  }, []);

  return { works, loading, error };
}

export function useHeroImage() {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .eq('is_active', true)
          .single();

        if (error) throw error;
        if (data) {
          setHeroImage(data);
        }
      } catch (err) {
        console.warn('Could not load the active hero image:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroImage();
  }, []);

  return { heroImage, loading, error };
}

export function useContactImage() {
  const [contactImage, setContactImage] = useState<ContactImage>(fallbackContactImage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContactImage() {
      try {
        const { data, error } = await supabase
          .from('contact_images')
          .select('*')
          .eq('is_active', true)
          .single();

        if (error) throw error;
        if (data) {
          setContactImage(data);
        }
      } catch (err) {
        console.warn('Using fallback contact image:', err);
        setError(err as Error);
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchContactImage();
  }, []);

  return { contactImage, loading, error };
}

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, Record<string, string>>>(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          // Organize data by section and key
          const organized = data.reduce((acc, item) => {
            if (!acc[item.section]) {
              acc[item.section] = {};
            }
            acc[item.section][item.key] = item.value;
            return acc;
          }, {} as Record<string, Record<string, string>>);

          setContent(organized);
        }
      } catch (err) {
        console.warn('Using fallback content:', err);
        setError(err as Error);
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  return { content, loading, error };
}
