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
}

const NAV = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'rules', label: 'Правила', icon: 'ScrollText' },
  { id: 'reports', label: 'Репорты', icon: 'FileWarning' },
  { id: 'new', label: 'Новый репорт', icon: 'PlusSquare' },
  { id: 'my', label: 'Мои репорты', icon: 'User' },
  { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
];

const REPORTS: Report[] = [
  { id: 1042, target: 'GrieferKing', author: 'Steve_Miner', reason: 'Разрушение построек / гриферство', date: '02.07.2026', status: 'new', hasProof: true },
  { id: 1041, target: 'ToxicPlayer99', author: 'AlexBuild', reason: 'Оскорбления в чате', date: '01.07.2026', status: 'review', hasProof: true },
  { id: 1040, target: 'HackerXD', author: 'RedstoneGod', reason: 'Использование читов (fly/kill aura)', date: '30.06.2026', status: 'closed', hasProof: true },
  { id: 1039, target: 'ThiefBoy', author: 'Notch_Fan', reason: 'Воровство из сундуков', date: '29.06.2026', status: 'closed', hasProof: false },
];

const STATUS_META: Record<Status, { label: string; color: string; icon: string }> = {
  new: { label: 'НОВЫЙ', color: 'hsl(var(--mc-redstone))', icon: 'Zap' },
  review: { label: 'НА РАССМОТРЕНИИ', color: 'hsl(var(--mc-gold))', icon: 'Eye' },
  closed: { label: 'ЗАКРЫТ', color: 'hsl(var(--mc-grass))', icon: 'CheckCircle2' },
};

const RULES = [
  { icon: 'Ban', title: 'Гриферство запрещено', text: 'Разрушение чужих построек, ловушки и порча территории караются баном.' },
  { icon: 'MessageSquareOff', title: 'Уважение в чате', text: 'Оскорбления, спам, флуд и токсичность — повод для мута или бана.' },
  { icon: 'ShieldOff', title: 'Никаких читов', text: 'Fly, X-Ray, kill aura и любые модификации, дающие преимущество, запрещены.' },
  { icon: 'Lock', title: 'Не воруй', text: 'Кража из чужих сундуков и с приваченных территорий недопустима.' },
];

export default function Index() {
  const [tab, setTab] = useState('home');
  const [files, setFiles] = useState<File[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div className="min-h-screen mc-sky-bg font-sans text-white">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 mc-dirt-tex border-b-4 border-[hsl(var(--mc-dirt-dark))]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <button onClick={() => setTab('home')} className="flex items-center gap-3">
            <div className="w-11 h-11 mc-block bg-[hsl(var(--mc-grass))] flex items-center justify-center">
              <Icon name="Pickaxe" size={22} className="text-white" />
            </div>
            <div className="text-left leading-none">
              <div className="font-pixel text-xs sm:text-sm text-[hsl(var(--mc-gold))] pixel-shadow">BRUSH SMP</div>
              <div className="font-mono text-lg text-white/80 -mt-0.5">Система репортов</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`mc-btn px-3 py-2 font-mono text-lg flex items-center gap-1.5 ${
                  tab === n.id ? 'bg-[hsl(var(--mc-grass))]' : 'bg-[hsl(var(--mc-stone))]'
                }`}
              >
                <Icon name={n.icon} size={16} />
                {n.label}
              </button>
            ))}
          </nav>

          <button className="lg:hidden mc-btn bg-[hsl(var(--mc-stone))] p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden mc-stone-tex border-t-4 border-[hsl(var(--mc-stone-dark))] px-4 py-3 grid grid-cols-2 gap-2 animate-fade-in">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => { setTab(n.id); setMenuOpen(false); }}
                className={`mc-btn px-2 py-2 font-mono text-base flex items-center gap-1.5 ${
                  tab === n.id ? 'bg-[hsl(var(--mc-grass))]' : 'bg-[hsl(var(--mc-stone))]'
                }`}
              >
                <Icon name={n.icon} size={16} />
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === 'home' && <Home setTab={setTab} />}
        {tab === 'rules' && <Rules />}
        {tab === 'reports' && <ReportsList />}
        {tab === 'new' && <NewReport files={files} onFiles={onFiles} />}
        {tab === 'my' && <MyReports />}
        {tab === 'stats' && <Stats />}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="mc-dirt-tex border-t-4 border-[hsl(var(--mc-dirt-dark))] mt-10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center font-mono text-lg text-white/70">
          <p className="pixel-shadow">⛏ BRUSH SMP — играй честно, репорти нечестных</p>
          <p className="text-white/50 mt-1">© 2026 · Все репорты рассматриваются администрацией</p>
        </div>
      </footer>
    </div>
  );

  // ===== HOME =====
  function Home({ setTab }: { setTab: (t: string) => void }) {
    return (
      <div className="space-y-8">
        <section
          className="mc-panel rounded-none overflow-hidden relative animate-pop-in"
          style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="bg-black/45 px-6 py-14 sm:py-20 text-center">
            <div className="inline-block mc-block bg-[hsl(var(--mc-grass))] px-4 py-2 mb-6 animate-float">
              <span className="font-pixel text-[10px] sm:text-xs text-white pixel-shadow">СЕРВЕР BRUSH SMP</span>
            </div>
            <h1 className="font-pixel text-lg sm:text-3xl leading-relaxed text-white pixel-shadow mb-5">
              РЕПОРТЫ НА ИГРОКОВ
            </h1>
            <p className="font-mono text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
              Заметил гриферство, читы или токсичность? Оставь жалобу с доказательствами — фото или видео — и админ разберётся.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setTab('new')} className="mc-btn bg-[hsl(var(--mc-grass))] px-6 py-3 font-mono text-xl flex items-center gap-2">
                <Icon name="PlusSquare" size={20} /> Подать репорт
              </button>
              <button onClick={() => setTab('rules')} className="mc-btn bg-[hsl(var(--mc-stone))] px-6 py-3 font-mono text-xl flex items-center gap-2">
                <Icon name="ScrollText" size={20} /> Правила
              </button>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: 'FileWarning', n: '1 042', l: 'Всего репортов', c: 'hsl(var(--mc-gold))' },
            { icon: 'ShieldCheck', n: '873', l: 'Рассмотрено', c: 'hsl(var(--mc-grass))' },
            { icon: 'Gavel', n: '412', l: 'Выдано наказаний', c: 'hsl(var(--mc-redstone))' },
          ].map((s, i) => (
            <div key={i} className="mc-panel mc-stone-tex p-5 flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div className="w-14 h-14 mc-block flex items-center justify-center shrink-0" style={{ background: s.c }}>
                <Icon name={s.icon} size={26} className="text-white" />
              </div>
              <div>
                <div className="font-pixel text-lg text-white pixel-shadow">{s.n}</div>
                <div className="font-mono text-lg text-white/70">{s.l}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: 'Camera', t: 'Прикрепи доказательства', d: 'Скриншоты, видео и файлы — всё как улики против нарушителя.' },
            { icon: 'Clock', t: 'Быстрое рассмотрение', d: 'Каждый репорт попадает напрямую к администрации сервера.' },
            { icon: 'ShieldCheck', t: 'Честная игра', d: 'Вместе делаем Brush SMP комфортным местом для всех.' },
          ].map((f, i) => (
            <div key={i} className="mc-panel mc-dirt-tex p-5 animate-fade-in" style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}>
              <div className="w-12 h-12 mc-block bg-[hsl(var(--mc-grass))] flex items-center justify-center mb-3">
                <Icon name={f.icon} size={22} className="text-white" />
              </div>
              <h3 className="font-mono text-2xl text-white mb-1">{f.t}</h3>
              <p className="font-mono text-lg text-white/70">{f.d}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  // ===== RULES =====
  function Rules() {
    return (
      <div className="animate-fade-in">
        <SectionTitle icon="ScrollText" title="ПРАВИЛА СЕРВЕРА" sub="Нарушение любого пункта — повод для репорта" />
        <div className="grid sm:grid-cols-2 gap-4">
          {RULES.map((r, i) => (
            <div key={i} className="mc-panel mc-stone-tex p-5 flex gap-4 animate-pop-in" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <div className="w-14 h-14 mc-block bg-[hsl(var(--mc-redstone))] flex items-center justify-center shrink-0">
                <Icon name={r.icon} size={26} className="text-white" />
              </div>
              <div>
                <h3 className="font-mono text-2xl text-[hsl(var(--mc-gold))]">{r.title}</h3>
                <p className="font-mono text-lg text-white/80">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== REPORTS LIST =====
  function ReportsList() {
    return (
      <div className="animate-fade-in">
        <SectionTitle icon="FileWarning" title="ВСЕ РЕПОРТЫ" sub="Список жалоб на нарушителей" />
        <div className="space-y-3">
          {REPORTS.map((r, i) => (
            <ReportCard key={r.id} r={r} delay={i * 0.06} />
          ))}
        </div>
      </div>
    );
  }

  function ReportCard({ r, delay }: { r: Report; delay: number }) {
    const s = STATUS_META[r.status];
    return (
      <div className="mc-panel mc-stone-tex p-4 animate-fade-in" style={{ animationDelay: `${delay}s`, opacity: 0 }}>
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 mc-block bg-[hsl(var(--mc-dirt))] flex items-center justify-center shrink-0">
              <Icon name="UserX" size={22} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xl text-white flex items-center gap-2 flex-wrap">
                <span className="text-[hsl(var(--mc-redstone))] font-bold">#{r.id}</span>
                на <span className="text-[hsl(var(--mc-gold))]">{r.target}</span>
              </div>
              <div className="font-mono text-lg text-white/70 truncate">{r.reason}</div>
              <div className="font-mono text-base text-white/50">от {r.author} · {r.date}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {r.hasProof && (
              <span className="mc-block bg-[hsl(var(--mc-diamond))] px-2 py-1 font-mono text-base text-white flex items-center gap-1">
                <Icon name="Paperclip" size={14} /> Пруфы
              </span>
            )}
            <span className="mc-block px-3 py-1 font-mono text-base text-white flex items-center gap-1" style={{ background: s.color }}>
              <Icon name={s.icon} size={14} /> {s.label}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ===== NEW REPORT =====
  function NewReport({ files, onFiles }: { files: File[]; onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <SectionTitle icon="PlusSquare" title="НОВЫЙ РЕПОРТ" sub="Опиши нарушение и приложи доказательства" />
        <form className="mc-panel mc-dirt-tex p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Field label="Ник нарушителя" icon="UserX">
            <input className="mc-input" placeholder="Например: GrieferKing" />
          </Field>
          <Field label="Твой ник" icon="User">
            <input className="mc-input" placeholder="Твой ник на сервере" />
          </Field>
          <Field label="Тип нарушения" icon="AlertTriangle">
            <select className="mc-input">
              <option>Гриферство</option>
              <option>Читы / модификации</option>
              <option>Оскорбления в чате</option>
              <option>Воровство</option>
              <option>Другое</option>
            </select>
          </Field>
          <Field label="Описание" icon="MessageSquare">
            <textarea className="mc-input min-h-28 resize-none" placeholder="Опиши, что произошло, когда и где..." />
          </Field>

          <Field label="Доказательства (фото, видео, файлы)" icon="Paperclip">
            <label className="block cursor-pointer mc-block bg-[hsl(var(--mc-stone))] p-6 text-center hover:brightness-110 transition">
              <Icon name="Upload" size={30} className="mx-auto mb-2 text-[hsl(var(--mc-gold))]" />
              <div className="font-mono text-xl text-white">Перетащи или выбери файлы</div>
              <div className="font-mono text-base text-white/60">Скриншоты · Видео · .txt логи</div>
              <input type="file" multiple accept="image/*,video/*,.txt,.log" className="hidden" onChange={onFiles} />
            </label>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="mc-block bg-[hsl(var(--mc-grass))] px-3 py-2 flex items-center gap-2 font-mono text-lg animate-pop-in">
                    <Icon name={f.type.startsWith('video') ? 'Video' : f.type.startsWith('image') ? 'Image' : 'File'} size={18} />
                    <span className="truncate">{f.name}</span>
                    <span className="ml-auto text-white/70 text-base">{(f.size / 1024).toFixed(0)} КБ</span>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <button type="submit" className="mc-btn bg-[hsl(var(--mc-grass))] w-full py-4 font-mono text-2xl flex items-center justify-center gap-2">
            <Icon name="Send" size={22} /> Отправить репорт
          </button>
        </form>
      </div>
    );
  }

  function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
    return (
      <div>
        <label className="font-mono text-xl text-[hsl(var(--mc-gold))] flex items-center gap-2 mb-1.5 pixel-shadow">
          <Icon name={icon} size={18} /> {label}
        </label>
        {children}
      </div>
    );
  }

  // ===== MY REPORTS =====
  function MyReports() {
    const mine = REPORTS.slice(0, 2);
    return (
      <div className="animate-fade-in">
        <SectionTitle icon="User" title="МОИ РЕПОРТЫ" sub="Жалобы, которые ты подал" />
        <div className="mc-panel mc-stone-tex p-4 mb-4 flex items-center gap-3">
          <div className="w-14 h-14 mc-block bg-[hsl(var(--mc-grass))] flex items-center justify-center">
            <Icon name="User" size={26} className="text-white" />
          </div>
          <div className="font-mono">
            <div className="text-2xl text-white">Steve_Miner</div>
            <div className="text-lg text-white/70">Подано репортов: {mine.length} · Подтверждено: 1</div>
          </div>
        </div>
        <div className="space-y-3">
          {mine.map((r, i) => (
            <ReportCard key={r.id} r={r} delay={i * 0.06} />
          ))}
        </div>
      </div>
    );
  }

  // ===== STATS =====
  function Stats() {
    const bars = [
      { l: 'Гриферство', v: 42, c: 'hsl(var(--mc-grass))' },
      { l: 'Читы', v: 31, c: 'hsl(var(--mc-diamond))' },
      { l: 'Оскорбления', v: 18, c: 'hsl(var(--mc-gold))' },
      { l: 'Воровство', v: 9, c: 'hsl(var(--mc-redstone))' },
    ];
    return (
      <div className="animate-fade-in">
        <SectionTitle icon="BarChart3" title="СТАТИСТИКА" sub="Аналитика нарушений на сервере" />
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: 'FileWarning', n: '1 042', l: 'Репортов', c: 'hsl(var(--mc-gold))' },
            { icon: 'Gavel', n: '412', l: 'Наказаний', c: 'hsl(var(--mc-redstone))' },
            { icon: 'Timer', n: '2.4ч', l: 'Средний отклик', c: 'hsl(var(--mc-diamond))' },
          ].map((s, i) => (
            <div key={i} className="mc-panel mc-dirt-tex p-5 text-center animate-pop-in" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <div className="w-14 h-14 mc-block mx-auto flex items-center justify-center mb-2" style={{ background: s.c }}>
                <Icon name={s.icon} size={26} className="text-white" />
              </div>
              <div className="font-pixel text-lg text-white pixel-shadow">{s.n}</div>
              <div className="font-mono text-lg text-white/70">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="mc-panel mc-stone-tex p-6">
          <h3 className="font-mono text-2xl text-[hsl(var(--mc-gold))] mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={22} /> Нарушения по типам
          </h3>
          <div className="space-y-4">
            {bars.map((b, i) => (
              <div key={i}>
                <div className="flex justify-between font-mono text-xl text-white mb-1">
                  <span>{b.l}</span><span>{b.v}%</span>
                </div>
                <div className="h-6 mc-block bg-black/30 overflow-hidden">
                  <div className="h-full animate-fade-in" style={{ width: `${b.v}%`, background: b.c, animationDelay: `${i * 0.1}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub: string }) {
    return (
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 mc-block bg-[hsl(var(--mc-grass))] flex items-center justify-center shrink-0 animate-float">
          <Icon name={icon} size={28} className="text-white" />
        </div>
        <div>
          <h2 className="font-pixel text-base sm:text-xl text-[hsl(var(--mc-gold))] pixel-shadow">{title}</h2>
          <p className="font-mono text-xl text-white/70">{sub}</p>
        </div>
      </div>
    );
  }
}
