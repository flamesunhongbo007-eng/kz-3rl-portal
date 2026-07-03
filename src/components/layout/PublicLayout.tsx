import { ReactNode } from 'react';
import { HeroHeader } from './TopBar';
import { Footer } from './Footer';

// fullBleed: true → 内容全屏铺开、自己控制宽度（首页 Home 用）
// fullBleed: false（默认）→ 二级页面：留出顶部固定栏空间 + 左右内边距 + 居中约束宽度
export function PublicLayout({ children, fullBleed = false }: { children: ReactNode; fullBleed?: boolean }) {
  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(175deg, #0A101E 0%, #070C16 55%, #080D18 100%)' }}>
      <HeroHeader />
      {fullBleed ? (
        <main className="relative z-10">{children}</main>
      ) : (
        <main className="relative z-10 pt-20 pb-16 px-5 md:px-8 lg:px-10 max-w-[1440px] mx-auto">
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
}
