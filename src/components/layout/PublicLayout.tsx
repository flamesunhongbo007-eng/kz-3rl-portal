import { ReactNode } from 'react';
import { HeroHeader } from './TopBar';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(175deg, #0A101E 0%, #070C16 55%, #080D18 100%)' }}>
      <HeroHeader />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
