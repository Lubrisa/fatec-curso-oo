import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  Info,
  Sparkles,
  Compass,
  Bookmark,
} from 'lucide-react';
import { extractTextFromReactNode } from '../utils/slugify';

interface CalloutBlockProps {
  children: React.ReactNode;
}

type CalloutType = 'warning' | 'danger' | 'tip' | 'info' | 'golden' | 'analogy' | 'default';

interface CalloutStyle {
  type: CalloutType;
  title: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  titleColor: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}

function detectCalloutType(plainText: string): { type: CalloutType; matchedPrefix?: string } {
  const lower = plainText.toLowerCase().trim();

  // Golden rule / Regra de Ouro / Regra Fundamental
  if (
    lower.includes('regra de ouro') ||
    lower.includes('regra fundamental') ||
    lower.includes('princípio fundamental') ||
    lower.includes('golden rule')
  ) {
    return { type: 'golden' };
  }

  // Danger / Perigo / Cuidado crítico
  if (
    lower.startsWith('perigo') ||
    lower.includes('perigo:') ||
    lower.includes('cuidado:') ||
    lower.includes('[!danger]') ||
    lower.includes('[!caution]') ||
    lower.includes('atenção!') ||
    lower.includes('cuidado com')
  ) {
    return { type: 'danger' };
  }

  // Warning / Aviso / Atenção
  if (
    lower.startsWith('aviso') ||
    lower.includes('aviso:') ||
    lower.includes('atenção:') ||
    lower.includes('[!warning]') ||
    lower.startsWith('⚠️')
  ) {
    return { type: 'warning' };
  }

  // Tip / Dica
  if (
    lower.startsWith('dica') ||
    lower.includes('dica:') ||
    lower.includes('dica prática') ||
    lower.includes('boas práticas') ||
    lower.includes('[!tip]') ||
    lower.startsWith('💡')
  ) {
    return { type: 'tip' };
  }

  // Analogy / Analogia
  if (
    lower.startsWith('analogia') ||
    lower.includes('analogia:') ||
    lower.includes('pense assim') ||
    lower.includes('guarda essa analogia')
  ) {
    return { type: 'analogy' };
  }

  // Info / Nota / Observação
  if (
    lower.startsWith('nota') ||
    lower.startsWith('observação') ||
    lower.includes('observação:') ||
    lower.includes('nota:') ||
    lower.includes('[!note]') ||
    lower.includes('[!info]') ||
    lower.includes('importante:') ||
    lower.startsWith('ℹ️')
  ) {
    return { type: 'info' };
  }

  return { type: 'default' };
}

export const CalloutBlock: React.FC<CalloutBlockProps> = ({ children }) => {
  const plainText = extractTextFromReactNode(children);
  const { type } = detectCalloutType(plainText);

  const styles: Record<CalloutType, CalloutStyle> = {
    golden: {
      type: 'golden',
      title: 'Regra de Ouro / Conceito Fundamental',
      borderColor: 'border-purple-400/90',
      bgColor: 'bg-purple-50/70',
      textColor: 'text-purple-950',
      titleColor: 'text-purple-900',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800 border-purple-200',
      icon: <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />,
    },
    danger: {
      type: 'danger',
      title: 'Atenção / Ponto Crítico',
      borderColor: 'border-rose-400/90',
      bgColor: 'bg-rose-50/70',
      textColor: 'text-rose-950',
      titleColor: 'text-rose-900',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800 border-rose-200',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
    },
    warning: {
      type: 'warning',
      title: 'Aviso Importante',
      borderColor: 'border-amber-400/90',
      bgColor: 'bg-amber-50/70',
      textColor: 'text-amber-950',
      titleColor: 'text-amber-900',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    tip: {
      type: 'tip',
      title: 'Dica Prática',
      borderColor: 'border-emerald-400/90',
      bgColor: 'bg-emerald-50/70',
      textColor: 'text-emerald-950',
      titleColor: 'text-emerald-900',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800 border-emerald-200',
      icon: <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    analogy: {
      type: 'analogy',
      title: 'Analogia Conceitual',
      borderColor: 'border-indigo-400/90',
      bgColor: 'bg-indigo-50/70',
      textColor: 'text-indigo-950',
      titleColor: 'text-indigo-900',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800 border-indigo-200',
      icon: <Compass className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
    info: {
      type: 'info',
      title: 'Informação / Nota',
      borderColor: 'border-sky-400/90',
      bgColor: 'bg-sky-50/70',
      textColor: 'text-sky-950',
      titleColor: 'text-sky-900',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800 border-sky-200',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
    },
    default: {
      type: 'default',
      title: 'Destaque',
      borderColor: 'border-amber-400/70',
      bgColor: 'bg-amber-50/50',
      textColor: 'text-slate-800',
      titleColor: 'text-amber-900',
      badgeBg: 'bg-amber-100/70',
      badgeText: 'text-amber-800 border-amber-200',
      icon: <Bookmark className="w-5 h-5 text-amber-600 shrink-0" />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`my-6 rounded-xl border-l-4 ${style.borderColor} ${style.bgColor} p-4 sm:p-5 shadow-2xs border border-r-slate-200/50 border-t-slate-200/50 border-b-slate-200/50`}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${style.badgeBg} ${style.badgeText}`}
            >
              {style.title}
            </span>
          </div>
          <div
            className={`callout-body text-[15px] leading-relaxed ${style.textColor} font-normal [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5 [&>strong]:font-bold`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
