import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ChapterFooter } from './components/ChapterFooter';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { getChapterById, getPrevNextChapter, ALL_CHAPTERS } from './curriculum';
import { getMarkdownContent } from './contentLoader';
import { BookOpen, Clock, CheckCircle, PanelLeftOpen, Minimize2 } from 'lucide-react';

const STORAGE_CHAPTER_KEY = 'fatec_oo_current_chapter';
const STORAGE_COMPLETED_KEY = 'fatec_oo_completed_chapters';
const STORAGE_SIDEBAR_KEY = 'fatec_oo_sidebar_collapsed';
const STORAGE_TOC_KEY = 'fatec_oo_toc_collapsed';

export default function App() {
  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAPTER_KEY);
      if (saved && ALL_CHAPTERS.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'README.md';
  });

  const [completedChapters, setCompletedChapters] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsedDesktop, setIsSidebarCollapsedDesktop] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isTocCollapsed, setIsTocCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_TOC_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Save current chapter
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAPTER_KEY, currentChapterId);
    } catch {
      // ignore
    }
  }, [currentChapterId]);

  // Save completed chapters
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_COMPLETED_KEY,
        JSON.stringify(Array.from(completedChapters))
      );
    } catch {
      // ignore
    }
  }, [completedChapters]);

  // Save sidebar preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SIDEBAR_KEY, String(isSidebarCollapsedDesktop));
    } catch {
      // ignore
    }
  }, [isSidebarCollapsedDesktop]);

  // Save TOC preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TOC_KEY, String(isTocCollapsed));
    } catch {
      // ignore
    }
  }, [isTocCollapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT')) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (isFocusMode) {
          setIsFocusMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isFocusMode]);

  const currentChapter = useMemo(
    () => getChapterById(currentChapterId),
    [currentChapterId]
  );

  const { prev, next } = useMemo(
    () => getPrevNextChapter(currentChapterId),
    [currentChapterId]
  );

  const markdownContent = useMemo(
    () => getMarkdownContent(currentChapterId),
    [currentChapterId]
  );

  const handleSelectChapter = useCallback((id: string) => {
    setCurrentChapterId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleComplete = () => {
    setCompletedChapters((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(currentChapterId)) {
        nextSet.delete(currentChapterId);
      } else {
        nextSet.add(currentChapterId);
      }
      return nextSet;
    });
  };

  const isCompleted = completedChapters.has(currentChapterId);
  const showSidebar = !isFocusMode && !isSidebarCollapsedDesktop;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Scroll indicator bar (isolated DOM updates, zero re-renders) */}
      <ScrollProgressBar currentChapterId={currentChapterId} />

      {/* Focus Mode: Invisible top hover zone to reveal Header */}
      {isFocusMode && (
        <div
          onMouseEnter={() => setIsHeaderHovered(true)}
          className="fixed top-0 left-0 right-0 h-4 z-40 cursor-default"
        />
      )}

      {/* Sidebar Navigation (hidden in focus mode) */}
      {!isFocusMode && (
        <Sidebar
          currentChapterId={currentChapterId}
          onSelectChapter={handleSelectChapter}
          completedChapters={completedChapters}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          isCollapsedDesktop={isSidebarCollapsedDesktop}
          onToggleCollapseDesktop={() => setIsSidebarCollapsedDesktop((prev) => !prev)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          showSidebar ? 'lg:pl-80' : 'lg:pl-0'
        }`}
      >
        {/* Header container */}
        <div
          onMouseEnter={() => isFocusMode && setIsHeaderHovered(true)}
          onMouseLeave={() => isFocusMode && setIsHeaderHovered(false)}
          className={`transition-transform duration-200 ${
            isFocusMode
              ? `fixed top-0 left-0 right-0 z-40 ${
                  isHeaderHovered ? 'translate-y-0 shadow-md' : '-translate-y-full'
                }`
              : 'relative z-30'
          }`}
        >
          <Header
            currentChapter={currentChapter}
            onOpenMobileSidebar={() => setIsSidebarOpenMobile(true)}
            isSidebarCollapsedDesktop={isSidebarCollapsedDesktop}
            onToggleSidebarDesktop={() => setIsSidebarCollapsedDesktop((prev) => !prev)}
            isTocCollapsed={isTocCollapsed}
            onToggleToc={() => setIsTocCollapsed((prev) => !prev)}
            isFocusMode={isFocusMode}
            onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>

        {/* Floating reopen sidebar button when collapsed on desktop */}
        {!isFocusMode && isSidebarCollapsedDesktop && (
          <button
            id="floating-expand-sidebar-btn"
            type="button"
            onClick={() => setIsSidebarCollapsedDesktop(false)}
            className="hidden lg:flex fixed left-4 bottom-5 z-30 items-center space-x-2 px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-amber-700 hover:border-amber-300 transition-all cursor-pointer text-xs font-semibold"
            title="Expandir Conteúdos"
          >
            <PanelLeftOpen className="w-4 h-4 text-amber-600" />
            <span>Conteúdos</span>
          </button>
        )}

        {/* Floating Focus Mode indicator */}
        {isFocusMode && (
          <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2.5 bg-slate-900/90 backdrop-blur-xs text-white px-3.5 py-2 rounded-full shadow-xl text-xs border border-slate-700">
            <span className="font-medium text-slate-200">Modo de Foco</span>
            <button
              type="button"
              onClick={() => setIsFocusMode(false)}
              className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer text-[11px]"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Sair (Esc)</span>
            </button>
          </div>
        )}

        {/* Content Container */}
        <div
          className={`flex-1 w-full mx-auto px-4 sm:px-8 py-8 flex items-start gap-8 transition-all ${
            isFocusMode ? 'max-w-4xl pt-10' : 'max-w-6xl'
          }`}
        >
          <main className="flex-1 min-w-0 bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-10">
            {/* Chapter Header meta */}
            <div className="mb-8 pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-800">
                  <BookOpen className="w-3.5 h-3.5" />
                  {currentChapter.moduleTitle}
                </span>

                {currentChapter.estimatedMinutes && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    ~{currentChapter.estimatedMinutes} min de leitura
                  </span>
                )}

                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Lido
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {currentChapter.title}
              </h1>

              {currentChapter.subtitle && (
                <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
                  {currentChapter.subtitle}
                </p>
              )}
            </div>

            {/* Markdown rendered body with mermaid & themed callouts */}
            <MarkdownRenderer
              content={markdownContent}
              currentChapterId={currentChapterId}
              onNavigate={handleSelectChapter}
            />

            {/* Chapter Footer for next/previous navigation & completion */}
            <ChapterFooter
              prev={prev}
              next={next}
              currentChapterId={currentChapterId}
              isCompleted={isCompleted}
              onToggleComplete={handleToggleComplete}
              onNavigate={handleSelectChapter}
            />
          </main>

          {/* Table of contents sidebar on large screens (hidden in focus mode) */}
          {!isFocusMode && (
            <TableOfContents
              content={markdownContent}
              isCollapsed={isTocCollapsed}
              onToggleCollapse={() => setIsTocCollapsed((prev) => !prev)}
            />
          )}
        </div>
      </div>

      {/* Full-text Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChapter={handleSelectChapter}
      />
    </div>
  );
}
