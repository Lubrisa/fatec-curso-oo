import React from 'react';
import { ChapterItem } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

interface ChapterFooterProps {
  prev: ChapterItem | null;
  next: ChapterItem | null;
  currentChapterId: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNavigate: (chapterId: string) => void;
}

export const ChapterFooter: React.FC<ChapterFooterProps> = ({
  prev,
  next,
  isCompleted,
  onToggleComplete,
  onNavigate,
}) => {
  return (
    <div className="mt-14 pt-8 border-t border-slate-200 w-full min-w-0">
      {/* Complete chapter action banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 mb-8">
        <div className="text-center sm:text-left min-w-0">
          <div className="text-sm font-semibold text-slate-800">
            Concluiu a leitura deste capítulo?
          </div>
          <div className="text-xs text-slate-500">
            Marque como concluído para acompanhar seu progresso no curso.
          </div>
        </div>
        <button
          id="toggle-complete-btn"
          onClick={onToggleComplete}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs shrink-0 ${
            isCompleted
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Capítulo Concluído</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-slate-400" />
              <span>Marcar como Concluído</span>
            </>
          )}
        </button>
      </div>

      {/* Prev / Next Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
        {prev ? (
          <button
            type="button"
            onClick={() => {
              onNavigate(prev.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400/80 hover:bg-amber-50/30 transition-all text-left group cursor-pointer shadow-2xs w-full min-w-0 overflow-hidden"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-amber-700 mb-1.5 shrink-0">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform shrink-0" />
              <span>Capítulo Anterior</span>
            </span>
            <span className="text-sm font-bold text-slate-900 group-hover:text-amber-900 line-clamp-2 break-words leading-snug">
              {prev.title}
            </span>
            {prev.subtitle && (
              <span className="text-xs text-slate-500 line-clamp-2 break-words mt-1 leading-normal">
                {prev.subtitle}
              </span>
            )}
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {next ? (
          <button
            type="button"
            onClick={() => {
              onNavigate(next.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400/80 hover:bg-amber-50/30 transition-all text-left sm:text-right sm:items-end group cursor-pointer shadow-2xs w-full min-w-0 overflow-hidden"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-amber-700 mb-1.5 shrink-0 sm:flex-row-reverse">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
              <span>Próximo Capítulo</span>
            </span>
            <span className="text-sm font-bold text-slate-900 group-hover:text-amber-900 line-clamp-2 break-words leading-snug">
              {next.title}
            </span>
            {next.subtitle && (
              <span className="text-xs text-slate-500 line-clamp-2 break-words mt-1 leading-normal">
                {next.subtitle}
              </span>
            )}
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </div>
  );
};
