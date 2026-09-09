import React, { useMemo, useState, useEffect } from 'react';
import { AlignLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { slugifyHeading, stripFooterNavigation } from '../utils/slugify';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [activeId, setActiveId] = useState<string>('');

  const headings = useMemo(() => {
    const cleaned = stripFooterNavigation(content);
    const lines = cleaned.split('\n');
    const items: TOCItem[] = [];

    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h2Match) {
        const rawText = h2Match[1].trim();
        const text = rawText.replace(/[*_`]/g, '').trim();
        const id = slugifyHeading(rawText);
        items.push({ id, text, level: 2 });
      } else if (h3Match) {
        const rawText = h3Match[1].trim();
        const text = rawText.replace(/[*_`]/g, '').trim();
        const id = slugifyHeading(rawText);
        items.push({ id, text, level: 3 });
      }
    }

    return items;
  }, [content]);

  // Track scroll position to highlight currently active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 120;

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (scrollY >= top - offset) {
            setActiveId(headings[i].id);
            return;
          }
        }
      }
      if (headings.length > 0 && scrollY < 200) {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // If heading is inside a closed <details>, expand it first
      const parentDetails = el.closest('details');
      if (parentDetails && !parentDetails.open) {
        parentDetails.open = true;
      }
      const yOffset = -75;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (isCollapsed) {
    return (
      <div className="hidden xl:block sticky top-20 self-start">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          title="Expandir Sumário do Capítulo"
        >
          <AlignLeft className="w-4 h-4 text-amber-600" />
        </button>
      </div>
    );
  }

  return (
    <nav className="hidden xl:block w-64 sticky top-20 self-start p-4 text-xs max-h-[calc(100vh-6rem)] overflow-y-auto bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between text-slate-900 font-bold mb-3 pb-2 border-b border-slate-200 uppercase tracking-wider text-[11px]">
        <div className="flex items-center space-x-2">
          <AlignLeft className="w-3.5 h-3.5 text-amber-600" />
          <span>Neste Capítulo</span>
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Recolher Sumário"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <ul className="space-y-1 text-slate-600">
        {headings.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={`${item.id}-${idx}`}
              className={item.level === 3 ? 'pl-3' : 'pl-0'}
            >
              <button
                type="button"
                onClick={() => scrollToHeading(item.id)}
                className={`text-left text-[12px] leading-snug py-1 px-1.5 rounded-md transition-all block w-full truncate cursor-pointer ${
                  isActive
                    ? 'text-amber-800 font-semibold bg-amber-50/80 border-l-2 border-amber-500'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
