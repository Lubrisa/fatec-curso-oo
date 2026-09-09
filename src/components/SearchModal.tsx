import React, { useState, useEffect, useRef } from 'react';
import { searchInChapters, SearchResult } from '../contentLoader';
import { getChapterById } from '../curriculum';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapterId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchInChapters(query));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in-50 zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Buscar por termos, conceitos, classes ou anotações (ex: ArrayList, Streams, JPA)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 text-sm focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-sm font-semibold px-2"
            >
              Limpar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {query.trim().length < 2 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Digite pelo menos 2 caracteres para pesquisar em todos os capítulos do curso.
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nenhum resultado encontrado para <span className="font-semibold text-slate-600">"{query}"</span>.
            </div>
          ) : (
            results.map((res) => {
              const chapter = getChapterById(res.chapterId);
              return (
                <button
                  key={res.chapterId}
                  type="button"
                  onClick={() => {
                    onSelectChapter(res.chapterId);
                    onClose();
                  }}
                  className="w-full text-left py-3 px-2 rounded-xl hover:bg-amber-50/60 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {chapter.moduleTitle}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-amber-900 mb-1">
                    {chapter.title}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2 bg-slate-50 group-hover:bg-amber-100/50 p-2 rounded-lg font-mono">
                    {res.matchSnippet}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
          <span>{results.length} resultados encontrados</span>
          <span>Pressione Esc para fechar</span>
        </div>
      </div>
    </div>
  );
};
