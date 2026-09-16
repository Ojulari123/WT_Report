import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google';
import './globals.css';

/* Three faces with three jobs: serif for body and headings, sans for labels, nav and
   metadata, mono for section numbers, dates and figure references. They are exposed as CSS
   variables rather than classNames so globals.css owns every type decision. */
const plexSerif = IBM_Plex_Serif({
  variable: '--font-plex-serif',
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Four Work Terms in Computing | Adeoluwa Jason Ojulari',
  description:
    'The co-op work term portfolio of Adeoluwa Jason Ojulari, University of Guelph. Four placements from 2024 to 2026 at RAA I.T., JREN Energy, Badger Redwood and Value-N-Action Consulting, each reported at equal depth, with four recurring goals tracked across all of them.',
};

/* viewport-fit: cover lets the fixed header and footer read env(safe-area-inset-*) instead
   of resolving it to 0, which is what iOS does without this declared. */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSerif.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
