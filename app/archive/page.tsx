import type { Metadata } from 'next';
import FullArchive from '@/components/FullArchive';

export const metadata: Metadata = {
  title: 'Archive — Yuki',
  description: 'A living archive of Yuki’s movement, image, fashion, and creative work.',
};

export default function ArchivePage() {
  return <FullArchive />;
}
