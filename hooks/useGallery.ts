import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  video_url: string | null;
  media_type: 'image' | 'video';
  category: 'dancer' | 'model' | 'producer' | 'fashion';
  aspect_ratio: 'portrait' | 'landscape' | 'square';
  bg_text: string;
  order_index: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}

// Fallback data
const fallbackGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Movement Study 01',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2400&q=90',
    video_url: null,
    media_type: 'image',
    category: 'dancer',
    aspect_ratio: 'portrait',
    bg_text: 'MOVEMENT',
    order_index: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: '2',
    title: 'Editorial Portrait',
    image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=90',
    video_url: null,
    media_type: 'image',
    category: 'model',
    aspect_ratio: 'landscape',
    bg_text: 'EDITORIAL',
    order_index: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: '3',
    title: 'Fashion Campaign',
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=2400&q=90',
    video_url: null,
    media_type: 'image',
    category: 'fashion',
    aspect_ratio: 'square',
    bg_text: 'ARCHIVE',
    order_index: 3,
    is_featured: false,
    is_active: true,
  },
  {
    id: '4',
    title: 'Studio Session',
    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=90',
    video_url: null,
    media_type: 'image',
    category: 'producer',
    aspect_ratio: 'portrait',
    bg_text: 'FASHION',
    order_index: 4,
    is_featured: false,
    is_active: true,
  },
];

export function useGallery(featuredOnly: boolean = false) {
  const [items, setItems] = useState<GalleryItem[]>(fallbackGalleryItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        let query = supabase
          .from('gallery_items')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (featuredOnly) {
          query = query.eq('is_featured', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn('Using fallback gallery data:', err);
        setError(err as Error);
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, [featuredOnly]);

  return { items, loading, error };
}
