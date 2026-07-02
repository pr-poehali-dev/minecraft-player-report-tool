import { useState } from 'react';
import Icon from '@/components/ui/icon';

const HERO_BG =
  'https://cdn.poehali.dev/projects/c933e68b-9249-4b08-90e2-22d31d44feb9/files/36d41d2a-dfc9-465c-8c32-f08867058dad.jpg';

type Status = 'new' | 'review' | 'closed';

interface Report {
  id: number;
  target: string;
  author: string;
  reason: string;
  date: string;
  status: Status;
  hasProof: boolean;
  emoji: string;
}

const NAV = [
  { id: 'home',    label: 'Главная',      emoji: '🏠', icon: 'Home' },
  { id: 'rules',   label: 'Правила',      emoji: '📜', icon: 'ScrollText' },
  { id: 'reports', label: 'Репорты',      emoji: '⚠️',  icon: 'FileWarning' },
  { id: 'new',     label: 'Новый репорт', emoji: '✍️',  icon: 'PlusSquare' },
  { id: 'my',      label: 'Мои репорты', emoji: '🎒', icon: 'User' },
  { id: 'stats',   label: 'Статистика',  emoji: '📊', icon: 'BarChart3' },
];

const REPORTS: Report[] = [
  { id: 1042, target: 'GrieferKing',  author: 'Steve_Miner', reason: 'Разрушение построек / гриферство', date: '02.07.2026', status: 'new',    hasProof: true,  emoji: '💣' },
  { id: 1041, target: 'ToxicPlayer99',author: 'AlexBuild',   reason: 'Оскорбления в чате',               date: '01.07.2026', status: 'review', hasProof: true,  emoji: '💬' },
  { id: 1040, target: 'HackerXD',     author: 'RedstoneGod', reason: 'Использование читов (fly/kill aura)',date: '30.06.2026', status: 'closed', hasProof: true,  emoji: '⚡' },
  { id: 1039, target: 'ThiefBoy',     author: 'Notch_Fan',   reason: 'Воровство из сундуков',            date: '29.06.2026', status: 'closed', hasProof: false, emoji: '🗝️' },
];

const STATUS_META: Record<Status, { label: string; color: string; icon: string; emoji: string }> = {
  new:    { label: 'НОВЫЙ',           color: 'hsl(var(--mc-redstone))', icon: 'Zap',          emoji: '🔴' },
  review: { label: 'НА РАССМОТРЕНИИ',color: 'hsl(var(--mc-gold))',     icon: 'Eye',          emoji: '🟡' },
  closed: { label: 'ЗАКРЫТ',          color: 'hsl(var(--mc-grass))',    icon: 'CheckCircle2', emoji: '🟢' },
};

const RULES = [
  { emoji: '💣', icon: 'Ban',            title: 'Гриферство запрещено', text: 'Разрушение чужих построек, ловушки и порча территории — бан без предупреждения.' },
  { emoji: '💬', icon: 'MessageSquareOff',title: 'Уважение в чате',     text: 'Оскорбления, спам, флуд и токсичность — мут или бан.' },
  { emoji: '⚡', icon: 'ShieldOff',       title: 'Никаких читов',       text: 'Fly, X-Ray, kill aura и любые модификации, дающие преимущество — бан.' },
  { emoji: '🗝️', icon: 'Lock',            title: 'Не воруй',            text: 'Кража из чужих сундуков и с приваченных территорий — бан.' },
];

/* ── Minecraft item sprites (SVG inline) ── */
const GrassBlock = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="0" y="0" width="16" height="16" fill="#866044"/>
    <rect x="0" y="0" width="16" height="5" fill="#5D9E3B"/>
    <rect x="0" y="0" width="1" height="16" fill="#7a5535"/>
    <rect x="15" y="0" width="1" height="16" fill="#7a5535"/>
    <rect x="0" y="15" width="16" height="1" fill="#7a5535"/>
    <rect x="2" y="1" width="3" height="2" fill="#6eba45"/>
    <rect x="8" y="2" width="4" height="2" fill="#6eba45"/>
    <rect x="5" y="0" width="2" height="1" fill="#79cc50"/>
  </svg>
);

const DiamondSword = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="12" y="0" width="2" height="2" fill="#55ffff"/>
    <rect x="10" y="2" width="2" height="2" fill="#55ffff"/>
    <rect x="8"  y="4" width="2" height="2" fill="#55ffff"/>
    <rect x="6"  y="6" width="2" height="2" fill="#00bcd4"/>
    <rect x="4"  y="8" width="2" height="2" fill="#00bcd4"/>
    <rect x="13" y="0" width="1" height="1" fill="#aaffff"/>
    <rect x="11" y="2" width="1" height="1" fill="#aaffff"/>
    <rect x="3"  y="8" width="4" height="2" fill="#795548"/>
    <rect x="2"  y="10" width="2" height="2" fill="#a1887f"/>
    <rect x="0"  y="12" width="2" height="2" fill="#795548"/>
    <rect x="2"  y="12" width="2" height="2" fill="#795548"/>
  </svg>
);

const Creeper = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="1" width="10" height="10" fill="#43a047"/>
    <rect x="3" y="1" width="10" height="10" fill="none" stroke="#2e7d32" strokeWidth="0.5"/>
    <rect x="5" y="3" width="2" height="2" fill="#1a1a1a"/>
    <rect x="9" y="3" width="2" height="2" fill="#1a1a1a"/>
    <rect x="6" y="6" width="4" height="1" fill="#1a1a1a"/>
    <rect x="5" y="7" width="2" height="2" fill="#1a1a1a"/>
    <rect x="9" y="7" width="2" height="2" fill="#1a1a1a"/>
    <rect x="4" y="11" width="3" height="4" fill="#43a047"/>
    <rect x="9" y="11" width="3" height="4" fill="#43a047"/>
  </svg>
);

const TNT = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="1" y="1" width="14" height="14" fill="#c62828"/>
    <rect x="1" y="4" width="14" height="3" fill="#f5f5f5"/>
    <rect x="1" y="9" width="14" height="3" fill="#f5f5f5"/>
    <rect x="1" y="1" width="14" height="1" fill="#b71c1c"/>
    <rect x="1" y="14" width="14" height="1" fill="#b71c1c"/>
    <rect x="4" y="5" width="1" height="1" fill="#555"/>
    <rect x="7" y="5" width="2" height="1" fill="#555"/>
    <rect x="11" y="5" width="1" height="1" fill="#555"/>
    <rect x="3" y="10" width="2" height="1" fill="#555"/>
    <rect x="9" y="10" width="4" height="1" fill="#555"/>
  </svg>
);

const Shield = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="1" width="10" height="11" fill="#5c6bc0"/>
    <rect x="4" y="12" width="8" height="2" fill="#5c6bc0"/>
    <rect x="5" y="14" width="6" height="1" fill="#5c6bc0"/>
    <rect x="6" y="15" width="4" height="1" fill="#5c6bc0"/>
    <rect x="3" y="1" width="10" height="1" fill="#7986cb"/>
    <rect x="3" y="1" width="1" height="11" fill="#7986cb"/>
    <rect x="5" y="3" width="6" height="7" fill="#e53935"/>
    <rect x="12" y="1" width="1" height="11" fill="#3949ab"/>
    <rect x="3" y="11" width="10" height="1" fill="#3949ab"/>
  </svg>
);

const Chest = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="1" y="5" width="14" height="10" fill="#8B5E3C"/>
    <rect x="1" y="5" width="14" height="1" fill="#6B421F"/>
    <rect x="1" y="14" width="14" height="1" fill="#6B421F"/>
    <rect x="1" y="1" width="14" height="5" fill="#A0733F"/>
    <rect x="1" y="1" width="14" height="1" fill="#C49A6C"/>
    <rect x="1" y="5" width="14" height="1" fill="#6B421F"/>
    <rect x="6" y="8" width="4" height="3" fill="#C49A6C"/>
    <rect x="7" y="9" width="2" height="1" fill="#8B5E3C"/>
  </svg>
);

export default function Index() {
  const [tab, setTab] = useState('home');
  const [files, setFiles] = useState<File[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div className="min-h-screen font-sans text-white" style={{ background: 'hsl(205 65% 22%)' }}>

      {/* ══════════════════════════════════════════
          SIDEBAR NAVIGATION — Minecraft inventory style
      ══════════════════════════════════════════ */}
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 mc-sidebar sticky top-0 h-screen overflow-y-auto">
          {/* Logo */}
          <div className="p-5 border-b-4 border-black/40">
            <div className="mc-logo-block flex items-center gap-3 p-3">
              <div className="relative">
                <GrassBlock size={40} />
                <div className="absolute -top-1 -right-1 text-lg">⛏️</div>
              </div>
              <div>
                <div className="font-pixel text-[11px] text-[hsl(var(--mc-gold))] pixel-shadow leading-tight">BRUSH</div>
                <div className="font-pixel text-[11px] text-[hsl(var(--mc-gold))] pixel-shadow leading-tight">SMP</div>
                <div className="font-mono text-base text-white/70 mt-0.5">репорты</div>
              </div>
            </div>
          </div>

          {/* Hotbar label */}
          <div className="px-4 pt-4 pb-1">
            <span className="font-pixel text-[9px] text-white/40 tracking-widest">— НАВИГАЦИЯ —</span>
          </div>

          {/* Nav items styled as inventory slots */}
          <nav className="px-3 flex flex-col gap-1.5 flex-1 pb-4">
            {NAV.map((n, i) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`mc-nav-item group flex items-center gap-3 px-3 py-2.5 w-full transition-all ${tab === n.id ? 'mc-nav-active' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`mc-slot w-10 h-10 flex items-center justify-center text-xl shrink-0 ${tab === n.id ? 'mc-slot-active' : ''}`}>
                  {n.emoji}
                </div>
                <div className="text-left">
                  <div className={`font-mono text-lg leading-none ${tab === n.id ? 'text-[hsl(var(--mc-gold))]' : 'text-white/90'}`}>
                    {n.label}
                  </div>
                  {tab === n.id && (
                    <div className="font-mono text-sm text-white/50 mt-0.5">выбрано</div>
                  )}
                </div>
                {tab === n.id && (
                  <div className="ml-auto w-1.5 h-8 bg-[hsl(var(--mc-gold))] mc-selected-bar" />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom decorative panel */}
          <div className="p-4 border-t-4 border-black/40">
            <div className="mc-block bg-[hsl(var(--mc-stone))] p-3 text-center">
              <div className="flex justify-center gap-3 mb-2">
                <DiamondSword size={24} />
                <Shield size={24} />
                <Chest size={24} />
              </div>
              <div className="font-mono text-base text-white/60">Brush SMP © 2026</div>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 mc-sidebar border-b-4 border-black/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setTab('home')} className="flex items-center gap-2">
              <GrassBlock size={32} />
              <span className="font-pixel text-[10px] text-[hsl(var(--mc-gold))] pixel-shadow">BRUSH SMP</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mc-slot w-10 h-10 flex items-center justify-center"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
          {mobileOpen && (
            <div className="px-3 pb-3 grid grid-cols-3 gap-2 animate-fade-in border-t-2 border-black/30 pt-3">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setTab(n.id); setMobileOpen(false); }}
                  className={`mc-slot flex flex-col items-center py-2 px-1 gap-1 ${tab === n.id ? 'mc-slot-active' : ''}`}
                >
                  <span className="text-2xl">{n.emoji}</span>
                  <span className="font-mono text-sm text-white/80 leading-tight text-center">{n.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ══════ MAIN CONTENT ══════ */}
        <main className="flex-1 min-w-0 pt-16 lg:pt-0">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {tab === 'home'    && <Home setTab={setTab} />}
            {tab === 'rules'   && <Rules />}
            {tab === 'reports' && <ReportsList />}
            {tab === 'new'     && <NewReport files={files} onFiles={onFiles} />}
            {tab === 'my'      && <MyReports />}
            {tab === 'stats'   && <Stats />}
          </div>
        </main>
      </div>
    </div>
  );

  /* ════════════════════════════════════
     HOME
  ════════════════════════════════════ */
  function Home({ setTab }: { setTab: (t: string) => void }) {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <section
          className="mc-panel overflow-hidden relative animate-pop-in"
          style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="bg-gradient-to-b from-black/60 to-black/30 px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 mc-block bg-black/50 px-4 py-2 mb-5 animate-float">
              <TNT size={20} />
              <span className="font-pixel text-[10px] text-white pixel-shadow">BRUSH SMP — СИСТЕМА РЕПОРТОВ</span>
              <TNT size={20} />
            </div>
            <h1 className="font-pixel text-xl sm:text-3xl leading-relaxed text-white pixel-shadow mb-4">
              ⚔️ РЕПОРТЫ НА ИГРОКОВ
            </h1>
            <p className="font-mono text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Заметил гриферство, читы или токсичность?<br/>
              Оставь жалобу с доказательствами — фото или видео!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setTab('new')} className="mc-btn-green px-6 py-3 font-mono text-xl flex items-center gap-2">
                ✍️ Подать репорт
              </button>
              <button onClick={() => setTab('rules')} className="mc-btn-gray px-6 py-3 font-mono text-xl flex items-center gap-2">
                📜 Правила
              </button>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { emoji: '📋', n: '1 042', l: 'Репортов',   c: 'hsl(var(--mc-gold))'     },
            { emoji: '🛡️',  n: '873',   l: 'Рассмотрено', c: 'hsl(var(--mc-grass))'    },
            { emoji: '⚖️',  n: '412',   l: 'Банов',      c: 'hsl(var(--mc-redstone))' },
          ].map((s, i) => (
            <div key={i} className="mc-panel mc-stone-tex p-4 text-center animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div className="text-3xl mb-1">{s.emoji}</div>
              <div className="font-pixel text-base text-white pixel-shadow" style={{ color: s.c }}>{s.n}</div>
              <div className="font-mono text-base text-white/60">{s.l}</div>
            </div>
          ))}
        </section>

        {/* Feature cards */}
        <section className="grid sm:grid-cols-3 gap-3">
          {[
            { emoji: '📸', sprite: <DiamondSword size={28}/>, t: 'Прикрепи пруфы',       d: 'Скриншоты и видео как улики' },
            { emoji: '⚡', sprite: <Shield size={28}/>,       t: 'Быстрый ответ',        d: 'Каждый репорт видит admin'  },
            { emoji: '🌿', sprite: <GrassBlock size={28}/>,   t: 'Честная игра',          d: 'Вместе делаем SMP лучше'    },
          ].map((f, i) => (
            <div key={i} className="mc-panel mc-dirt-tex p-4 animate-fade-in"
              style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}>
              <div className="mc-slot w-12 h-12 flex items-center justify-center mb-3">{f.sprite}</div>
              <h3 className="font-mono text-xl text-[hsl(var(--mc-gold))]">{f.t}</h3>
              <p className="font-mono text-base text-white/70">{f.d}</p>
            </div>
          ))}
        </section>

        {/* Latest reports preview */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TNT size={20} />
            <h2 className="font-pixel text-xs text-white/60 tracking-widest">ПОСЛЕДНИЕ РЕПОРТЫ</h2>
          </div>
          <div className="space-y-2">
            {REPORTS.slice(0, 2).map((r, i) => (
              <MiniReportCard key={r.id} r={r} delay={i * 0.05} />
            ))}
          </div>
          <button onClick={() => setTab('reports')}
            className="mc-btn-gray w-full mt-3 py-2 font-mono text-lg flex items-center justify-center gap-2">
            ⚠️ Все репорты →
          </button>
        </section>
      </div>
    );
  }

  /* ════════════════════════════════════
     RULES
  ════════════════════════════════════ */
  function Rules() {
    return (
      <div className="animate-fade-in">
        <SectionTitle emoji="📜" title="ПРАВИЛА СЕРВЕРА" sub="Нарушение любого пункта — повод для репорта" />

        {/* Enchanting table style header */}
        <div className="mc-panel mc-dirt-tex p-4 mb-4 flex items-center gap-4">
          <Shield size={48} />
          <div className="font-mono text-lg text-white/80">
            Правила обязательны для всех игроков Brush SMP.<br/>
            Незнание правил не освобождает от ответственности.
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {RULES.map((r, i) => (
            <div key={i} className="mc-panel mc-stone-tex p-4 flex gap-4 animate-pop-in"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <div className="mc-slot w-14 h-14 flex items-center justify-center text-3xl shrink-0">{r.emoji}</div>
              <div>
                <h3 className="font-mono text-xl text-[hsl(var(--mc-gold))] mb-1">{r.title}</h3>
                <p className="font-mono text-base text-white/80">{r.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Penalty table */}
        <div className="mc-panel mc-dirt-tex p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Chest size={24} />
            <span className="font-pixel text-[10px] text-[hsl(var(--mc-gold))] pixel-shadow">ТАБЛИЦА НАКАЗАНИЙ</span>
          </div>
          <div className="space-y-2">
            {[
              { v: '1-е нарушение', p: 'Предупреждение / мут 24ч',  e: '⚠️' },
              { v: '2-е нарушение', p: 'Временный бан 3–7 дней',     e: '🔨' },
              { v: '3-е нарушение', p: 'Перманентный бан',           e: '💀' },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 mc-block bg-black/20 px-3 py-2">
                <span className="text-xl">{row.e}</span>
                <span className="font-mono text-base text-white/70 w-36 shrink-0">{row.v}</span>
                <span className="font-mono text-base text-white">{row.p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════
     REPORTS LIST
  ════════════════════════════════════ */
  function ReportsList() {
    const [filter, setFilter] = useState<Status | 'all'>('all');
    const filtered = filter === 'all' ? REPORTS : REPORTS.filter(r => r.status === filter);

    return (
      <div className="animate-fade-in">
        <SectionTitle emoji="⚠️" title="ВСЕ РЕПОРТЫ" sub="Жалобы на нарушителей сервера" />

        {/* Filter bar — inventory tabs style */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {([['all','🗂️','Все'], ['new','🔴','Новые'], ['review','🟡','В работе'], ['closed','🟢','Закрытые']] as const).map(([val, emoji, label]) => (
            <button key={val} onClick={() => setFilter(val as Status | 'all')}
              className={`mc-tab flex items-center gap-1.5 px-3 py-1.5 font-mono text-base ${filter === val ? 'mc-tab-active' : ''}`}>
              {emoji} {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((r, i) => (
            <ReportCard key={r.id} r={r} delay={i * 0.06} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mc-panel mc-stone-tex p-10 text-center">
            <div className="text-5xl mb-3">🗂️</div>
            <div className="font-mono text-xl text-white/60">Репортов в этом статусе нет</div>
          </div>
        )}
      </div>
    );
  }

  function ReportCard({ r, delay }: { r: Report; delay: number }) {
    const s = STATUS_META[r.status];
    return (
      <div className="mc-panel mc-stone-tex p-4 animate-fade-in hover:brightness-110 transition-all"
        style={{ animationDelay: `${delay}s`, opacity: 0 }}>
        <div className="flex flex-wrap items-start gap-3">
          {/* Avatar slot */}
          <div className="mc-slot w-14 h-14 flex items-center justify-center text-3xl shrink-0">{r.emoji}</div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-pixel text-xs text-[hsl(var(--mc-redstone))] pixel-shadow">#{r.id}</span>
              <span className="font-mono text-lg text-white">на</span>
              <span className="font-mono text-xl text-[hsl(var(--mc-gold))] font-bold">{r.target}</span>
            </div>
            <div className="font-mono text-base text-white/80 mb-1">{r.reason}</div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm text-white/50">👤 {r.author}</span>
              <span className="font-mono text-sm text-white/50">📅 {r.date}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end shrink-0">
            <span className="mc-badge font-mono text-sm flex items-center gap-1" style={{ background: s.color }}>
              {s.emoji} {s.label}
            </span>
            {r.hasProof && (
              <span className="mc-badge bg-[hsl(var(--mc-diamond))] font-mono text-sm flex items-center gap-1">
                📎 Пруфы
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  function MiniReportCard({ r, delay }: { r: Report; delay: number }) {
    const s = STATUS_META[r.status];
    return (
      <div className="mc-panel bg-black/30 px-4 py-3 flex items-center gap-3 animate-fade-in"
        style={{ animationDelay: `${delay}s`, opacity: 0 }}>
        <span className="text-xl">{r.emoji}</span>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-base text-[hsl(var(--mc-gold))]">{r.target}</span>
          <span className="font-mono text-base text-white/60 ml-2 truncate">{r.reason}</span>
        </div>
        <span className="mc-badge font-mono text-sm" style={{ background: s.color }}>{s.emoji}</span>
      </div>
    );
  }

  /* ════════════════════════════════════
     NEW REPORT
  ════════════════════════════════════ */
  function NewReport({ files, onFiles }: { files: File[]; onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <SectionTitle emoji="✍️" title="НОВЫЙ РЕПОРТ" sub="Опиши нарушение и приложи доказательства" />

        {/* Crafting table style header */}
        <div className="mc-panel mc-dirt-tex p-4 mb-4 flex items-center gap-4">
          <TNT size={40} />
          <div className="font-mono text-base text-white/80">
            Заполни все поля как можно подробнее.<br/>
            Репорты с доказательствами рассматриваются в первую очередь.
          </div>
        </div>

        <form className="mc-panel mc-stone-tex p-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Field label="Ник нарушителя" emoji="🎯">
            <input className="mc-input" placeholder="Например: GrieferKing" />
          </Field>
          <Field label="Твой ник" emoji="👤">
            <input className="mc-input" placeholder="Твой ник на сервере" />
          </Field>
          <Field label="Тип нарушения" emoji="⚠️">
            <select className="mc-input">
              <option>💣 Гриферство</option>
              <option>⚡ Читы / хаки</option>
              <option>💬 Оскорбления</option>
              <option>🗝️ Воровство</option>
              <option>🔧 Другое</option>
            </select>
          </Field>
          <Field label="Описание произошедшего" emoji="📝">
            <textarea className="mc-input min-h-28 resize-none"
              placeholder="Опиши, что произошло, когда и где на сервере..." />
          </Field>

          <Field label="Доказательства" emoji="📎">
            <label className="block mc-panel bg-black/20 p-6 text-center hover:bg-black/30 transition group">
              <div className="flex justify-center gap-3 mb-3">
                <DiamondSword size={32} />
                <Chest size={32} />
                <Shield size={32} />
              </div>
              <div className="font-mono text-xl text-white group-hover:text-[hsl(var(--mc-gold))] transition">
                Перетащи или выбери файлы
              </div>
              <div className="font-mono text-sm text-white/50 mt-1">
                Скриншоты · Видео · .txt логи
              </div>
              <input type="file" multiple accept="image/*,video/*,.txt,.log" className="hidden" onChange={onFiles} />
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="mc-block bg-[hsl(var(--mc-grass))] px-3 py-2 flex items-center gap-2 font-mono text-base animate-pop-in">
                    <span>{f.type.startsWith('video') ? '🎬' : f.type.startsWith('image') ? '🖼️' : '📄'}</span>
                    <span className="truncate text-white">{f.name}</span>
                    <span className="ml-auto text-white/70 text-sm">{(f.size / 1024).toFixed(0)} КБ</span>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <button type="submit"
            className="mc-btn-green w-full py-4 font-mono text-2xl flex items-center justify-center gap-2">
            ⚔️ Отправить репорт
          </button>
        </form>
      </div>
    );
  }

  function Field({ label, emoji, children }: { label: string; emoji: string; children: React.ReactNode }) {
    return (
      <div>
        <label className="font-mono text-lg text-[hsl(var(--mc-gold))] flex items-center gap-2 mb-1.5">
          <span>{emoji}</span> {label}
        </label>
        {children}
      </div>
    );
  }

  /* ════════════════════════════════════
     MY REPORTS
  ════════════════════════════════════ */
  function MyReports() {
    const mine = REPORTS.slice(0, 2);
    return (
      <div className="animate-fade-in">
        <SectionTitle emoji="🎒" title="МОИ РЕПОРТЫ" sub="Жалобы, которые ты подал" />

        {/* Player card */}
        <div className="mc-panel mc-dirt-tex p-4 mb-5 flex items-center gap-4">
          <div className="mc-slot w-16 h-16 flex items-center justify-center text-4xl">🧑‍🦱</div>
          <div>
            <div className="font-mono text-2xl text-[hsl(var(--mc-gold))]">Steve_Miner</div>
            <div className="font-mono text-base text-white/60">Подано: {mine.length} · Подтверждено: 1</div>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-base">{i < 3 ? '❤️' : '🖤'}</span>
              ))}
              <span className="font-mono text-sm text-white/50 ml-2">репутация игрока</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {mine.map((r, i) => <ReportCard key={r.id} r={r} delay={i * 0.06} />)}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════
     STATS
  ════════════════════════════════════ */
  function Stats() {
    const bars = [
      { emoji: '💣', l: 'Гриферство',  v: 42, c: 'hsl(var(--mc-grass))'    },
      { emoji: '⚡', l: 'Читы',         v: 31, c: 'hsl(var(--mc-diamond))'  },
      { emoji: '💬', l: 'Оскорбления', v: 18, c: 'hsl(var(--mc-gold))'     },
      { emoji: '🗝️', l: 'Воровство',   v: 9,  c: 'hsl(var(--mc-redstone))' },
    ];

    return (
      <div className="animate-fade-in">
        <SectionTitle emoji="📊" title="СТАТИСТИКА" sub="Аналитика нарушений на сервере" />

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { emoji: '📋', n: '1 042', l: 'Репортов',   c: 'hsl(var(--mc-gold))'     },
            { emoji: '⚖️',  n: '412',   l: 'Банов',      c: 'hsl(var(--mc-redstone))' },
            { emoji: '⏱️',  n: '2.4ч', l: 'Откликается', c: 'hsl(var(--mc-diamond))'  },
          ].map((s, i) => (
            <div key={i} className="mc-panel mc-stone-tex p-4 text-center animate-pop-in"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <div className="text-3xl mb-1">{s.emoji}</div>
              <div className="font-pixel text-base pixel-shadow" style={{ color: s.c }}>{s.n}</div>
              <div className="font-mono text-sm text-white/60">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mc-panel mc-dirt-tex p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Chest size={24} />
            <span className="font-pixel text-[10px] text-[hsl(var(--mc-gold))] pixel-shadow">НАРУШЕНИЯ ПО ТИПАМ</span>
          </div>
          <div className="space-y-4">
            {bars.map((b, i) => (
              <div key={i}>
                <div className="flex justify-between font-mono text-base text-white mb-1">
                  <span>{b.emoji} {b.l}</span>
                  <span style={{ color: b.c }}>{b.v}%</span>
                </div>
                <div className="h-5 mc-block bg-black/30 overflow-hidden">
                  <div className="h-full animate-fade-in" style={{ width: `${b.v}%`, background: b.c, animationDelay: `${i * 0.15}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top violators */}
        <div className="mc-panel mc-stone-tex p-5">
          <div className="flex items-center gap-2 mb-3">
            <TNT size={24} />
            <span className="font-pixel text-[10px] text-[hsl(var(--mc-gold))] pixel-shadow">ТОП НАРУШИТЕЛЕЙ</span>
          </div>
          <div className="space-y-2">
            {[
              { rank: '🥇', name: 'GrieferKing',   count: 8, banned: true },
              { rank: '🥈', name: 'ToxicPlayer99', count: 5, banned: false },
              { rank: '🥉', name: 'HackerXD',      count: 3, banned: true },
            ].map((p, i) => (
              <div key={i} className="mc-block bg-black/20 px-3 py-2 flex items-center gap-3">
                <span className="text-xl">{p.rank}</span>
                <span className="font-mono text-base text-[hsl(var(--mc-gold))] flex-1">{p.name}</span>
                <span className="font-mono text-sm text-white/60">{p.count} репортов</span>
                {p.banned && <span className="mc-badge bg-[hsl(var(--mc-redstone))] text-xs">🔨 БАН</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════
     SHARED
  ════════════════════════════════════ */
  function SectionTitle({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
    return (
      <div className="flex items-center gap-4 mb-5">
        <div className="mc-slot w-14 h-14 flex items-center justify-center text-3xl animate-float shrink-0">
          {emoji}
        </div>
        <div>
          <h2 className="font-pixel text-sm sm:text-base text-[hsl(var(--mc-gold))] pixel-shadow">{title}</h2>
          <p className="font-mono text-base text-white/60">{sub}</p>
        </div>
      </div>
    );
  }

  function ReportCard({ r, delay }: { r: Report; delay: number }) {
    const s = STATUS_META[r.status];
    return (
      <div className="mc-panel mc-stone-tex p-4 animate-fade-in hover:brightness-110 transition-all"
        style={{ animationDelay: `${delay}s`, opacity: 0 }}>
        <div className="flex flex-wrap items-start gap-3">
          <div className="mc-slot w-14 h-14 flex items-center justify-center text-3xl shrink-0">{r.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-pixel text-xs text-[hsl(var(--mc-redstone))] pixel-shadow">#{r.id}</span>
              <span className="font-mono text-lg text-white">на</span>
              <span className="font-mono text-xl text-[hsl(var(--mc-gold))] font-bold">{r.target}</span>
            </div>
            <div className="font-mono text-base text-white/80 mb-1">{r.reason}</div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm text-white/50">👤 {r.author}</span>
              <span className="font-mono text-sm text-white/50">📅 {r.date}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <span className="mc-badge font-mono text-sm flex items-center gap-1" style={{ background: s.color }}>
              {s.emoji} {s.label}
            </span>
            {r.hasProof && (
              <span className="mc-badge bg-[hsl(var(--mc-diamond))] font-mono text-sm">📎 Пруфы</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
