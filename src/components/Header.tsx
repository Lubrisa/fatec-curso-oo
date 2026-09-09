import React from 'react';
import {
  Menu,
  Search,
  Coffee,
  PanelLeft,
  AlignLeft,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ChapterItem } from '../types';

interface HeaderProps {
  currentChapter: ChapterItem;
  onOpenMobileSidebar: () => void;
  isSidebarCollapsedDesktop: boolean;
  onToggleSidebarDesktop: () => void;
  isTocCollapsed: boolean;
  onToggleToc: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentChapter,
  onOpenMobileSidebar,
  isSidebarCollapsedDesktop,
  onToggleSidebarDesktop,
  isTocCollapsed,
  onToggleToc,
  isFocusMode,
  onToggleFocusMode,
  onOpenSearch,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Left: Sidebar toggles and breadcrumbs */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            id="mobile-sidebar-toggle"
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
            aria-label="Abrir navegação de conteúdos"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar collapse/expand toggle */}
          <button
            id="desktop-sidebar-toggle"
            type="button"
            onClick={onToggleSidebarDesktop}
            className={`hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shrink-0 ${
              isSidebarCollapsedDesktop ? 'bg-amber-100/70 text-amber-900' : ''
            }`}
            title={isSidebarCollapsedDesktop ? 'Expandir Conteúdos' : 'Recolher Conteúdos'}
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs truncate">
            <span className="font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md hidden sm:inline-block shrink-0">
              FATEC POO
            </span>
            <span className="text-slate-400 hidden sm:inline">/</span>
            <span className="text-slate-600 truncate font-medium max-w-[120px] sm:max-w-[200px]">
              {currentChapter.moduleTitle}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-bold truncate">
              {currentChapter.title}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Search trigger */}
          <button
            id="header-search-btn"
            type="button"
            onClick={onOpenSearch}
            className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-medium transition-colors cursor-pointer"
            title="Buscar conteúdo (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden md:inline">Buscar...</span>
            <kbd className="hidden md:inline-block px-1 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
              /
            </kbd>
          </button>

          {/* Toggle Table of Contents (Desktop) */}
          <button
            id="toggle-toc-btn"
            type="button"
            onClick={onToggleToc}
            className={`hidden xl:flex items-center space-x-1 p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              !isTocCollapsed
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                : 'border-slate-200 bg-slate-100/60 text-slate-400 hover:text-slate-600'
            }`}
            title={isTocCollapsed ? 'Mostrar Sumário do Capítulo' : 'Ocultar Sumário do Capítulo'}
          >
            <AlignLeft className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden 2xl:inline text-[11px]">Sumário</span>
          </button>

          {/* Toggle Focus Mode */}
          <button
            id="toggle-focus-mode-btn"
            type="button"
            onClick={onToggleFocusMode}
            className={`flex items-center space-x-1 p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isFocusMode
                ? 'border-amber-400 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={isFocusMode ? 'Sair do Modo de Foco (Esc)' : 'Ativar Modo de Foco (Tela cheia)'}
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Sair do Foco</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline text-[11px]">Modo Foco</span>
              </>
            )}
          </button>

          <div className="hidden lg:flex items-center pl-1.5 border-l border-slate-200 text-amber-700">
            <Coffee className="w-4 h-4 text-amber-600 mr-1" />
            <span className="text-xs font-medium text-slate-600">Java 21</span>
          </div>
        </div>
      </div>
    </header>
  );
};
