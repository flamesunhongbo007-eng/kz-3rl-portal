export function Footer() {
  return (
    <footer className="border-t border-teal/20 mt-24">
      <div className="max-w-[1380px] mx-auto px-10 py-10 flex items-center justify-between gap-8 flex-wrap">
        {/* 左 - 仅中国港湾 */}
        <div className="flex items-center gap-4">
          <img src="/logo-chec.png" alt="中国港湾" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
        </div>
        {/* 中 */}
        <div className="text-center text-xs text-ink-dim leading-relaxed">
          <strong className="text-teal font-bold">阿亚古孜—巴赫特宽轨铁路 · 总包联合体</strong><br />
          业主：哈萨克斯坦铁路公司 · 位于哈萨克斯坦阿拜州境内<br />
          正线 302.4 km · 1520 mm 宽轨 · 非电气化
        </div>
        {/* 右 */}
        <div className="text-right text-xs text-ink-dim leading-relaxed">
          <strong className="text-ink-mid">设计单位</strong><br />
          中国铁路设计集团 · 中铁第一勘察设计院<br />
          1520 mm 宽轨 · 非电气化 · 内燃牵引
        </div>
      </div>
      <div className="border-t border-teal/[0.08] py-4 text-center text-[10.5px] text-ink-dim tracking-wider opacity-70">
        © 2026 中港工程有限责任公司 · 内部使用 · 仅供项目相关人员
      </div>
    </footer>
  );
}
