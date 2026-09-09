import React, { useState, useMemo, useEffect } from 'react';
import { CURRICULUM_TREE, ALL_CHAPTERS } from '../curriculum';
import { ChapterItem, ModuleNode } from '../types';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Search,
  CheckCircle2,
  Bookmark,
  Layers,
  PanelLeftClose,
  Folder,
  FolderOpen,
  FileCode2,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  completedChapters: Set<string>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
}

// Helper to filter recursive module tree for search
function filterModuleRecursive(node: ModuleNode, query: string): ModuleNode | null {
  const q = query.toLowerCase().trim();
  const titleMatches = node.title.toLowerCase().includes(q);

  const matchingFiles = (node.files || []).filter(
    (f) =>
      titleMatches ||
      f.title.toLowerCase().includes(q) ||
      (f.subtitle && f.subtitle.toLowerCase().includes(q))
  );

  const matchingSubmodules: ModuleNode[] = [];
  if (node.submodules) {
    for (const sub of node.submodules) {
      const filteredSub = filterModuleRecursive(sub, query);
      if (filteredSub) {
        matchingSubmodules.push(filteredSub);
      }
    }
  }

  if (matchingFiles.length > 0 || matchingSubmodules.length > 0 || titleMatches) {
    return {
      ...node,
      files: matchingFiles.length > 0 ? matchingFiles : node.files,
      submodules: matchingSubmodules,
    };
  }

  return null;
}

// Recursive Tree Node component
interface ModuleTreeNodeProps {
  node: ModuleNode;
  level: number;
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  completedChapters: Set<string>;
  collapsedMap: Record<string, boolean>;
  onToggleCollapse: (id: string) => void;
  searchActive: boolean;
}

const ModuleTreeNode: React.FC<ModuleTreeNodeProps> = ({
  node,
  level,
  currentChapterId,
  onSelectChapter,
  completedChapters,
  collapsedMap,
  onToggleCollapse,
  searchActive,
}) => {
  // When searching, auto-expand
  const isCollapsed = !searchActive && !!collapsedMap[node.id];

  const hasFiles = node.files && node.files.length > 0;
  const hasSubmodules = node.submodules && node.submodules.length > 0;

  // Check if current chapter or any completed chapter is inside this node
  const containsActive = useMemo(() => {
    const checkActive = (n: ModuleNode): boolean => {
      if (n.files?.some((f) => f.id === currentChapterId)) return true;
      return n.submodules?.some(checkActive) || false;
    };
    return checkActive(node);
  }, [node, currentChapterId]);

  return (
    <div
      className={`rounded-xl transition-all ${
        level === 0
          ? 'border border-slate-200/70 bg-white/70 shadow-2xs mb-2.5 overflow-hidden'
          : 'mt-1.5 border-l-2 border-slate-200/80 pl-2 ml-1'
      }`}
    >
      {/* Module / Submodule Header */}
      <button
        type="button"
        onClick={() => onToggleCollapse(node.id)}
        className={`w-full flex items-center justify-between text-left transition-colors cursor-pointer ${
          level === 0
            ? 'px-3 py-2.5 hover:bg-slate-100/70 bg-slate-50/50'
            : 'px-2 py-1.5 hover:bg-slate-100/80 rounded-lg'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 pr-1">
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}

          {level === 0 ? (
            <span className="text-xs font-bold text-slate-900 truncate">
              {node.title}
            </span>
          ) : (
            <div className="flex items-center space-x-1.5 truncate">
              {isCollapsed ? (
                <Folder className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              ) : (
                <FolderOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className="text-[12px] font-semibold text-slate-800 truncate">
                {node.title}
              </span>
            </div>
          )}
        </div>

        {node.badge && (
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${
              node.badge === 'Core'
                ? 'bg-amber-100 text-amber-800 border border-amber-200/60'
                : node.badge === 'Estruturas'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : node.badge === 'Generics'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                : node.badge === 'Funcional'
                ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
            }`}
          >
            {node.badge}
          </span>
        )}
      </button>

      {/* Body: Direct Files and Submodules */}
      {!isCollapsed && (
        <div className={level === 0 ? 'px-2 pb-2.5 pt-1 space-y-1' : 'space-y-1 pb-1 pt-0.5'}>
          {/* Direct chapter files */}
          {hasFiles &&
            node.files!.map((file) => {
              const isActive = currentChapterId === file.id;
              const isDone = completedChapters.has(file.id);

              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => onSelectChapter(file.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-start justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                  }`}
                >
                  <div className="min-w-0 pr-1.5">
                    <div className="flex items-center gap-1.5">
                      <FileCode2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate text-[12px] leading-tight">
                        {file.title}
                      </span>
                    </div>
                    {file.subtitle && (
                      <div
                        className={`text-[10.5px] truncate pl-5 mt-0.5 ${
                          isActive ? 'text-amber-100' : 'text-slate-400'
                        }`}
                      >
                        {file.subtitle}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isActive ? 'text-white' : 'text-emerald-500'
                        }`}
                      />
                    ) : (
                      <span
                        className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${
                          isActive ? 'text-amber-100' : 'text-slate-400'
                        }`}
                      >
                        {file.estimatedMinutes}m
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

          {/* Recursive submodules */}
          {hasSubmodules &&
            node.submodules!.map((sub) => (
              <ModuleTreeNode
                key={sub.id}
                node={sub}
                level={level + 1}
                currentChapterId={currentChapterId}
                onSelectChapter={onSelectChapter}
                completedChapters={completedChapters}
                collapsedMap={collapsedMap}
                onToggleCollapse={onToggleCollapse}
                searchActive={searchActive}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentChapterId,
  onSelectChapter,
  completedChapters,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter tree recursively
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return CURRICULUM_TREE;
    return CURRICULUM_TREE.map((node) => filterModuleRecursive(node, searchQuery)).filter(
      (node): node is ModuleNode => node !== null
    );
  }, [searchQuery]);

  const totalChapters = ALL_CHAPTERS.length;
  const completedCount = completedChapters.size;
  const progressPercent = Math.min(100, Math.round((completedCount / totalChapters) * 100));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsedDesktop ? 'lg:-translate-x-full' : 'lg:translate-x-0'}`}
      >
        {/* Brand / Header */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight block">
                FATEC · Curso POO
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Trilha Java & Ecossistema
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Desktop collapse button */}
            <button
              id="sidebar-collapse-desktop-btn"
              type="button"
              onClick={onToggleCollapseDesktop}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Recolher barra lateral"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>

            {/* Mobile close button */}
            <button
              id="close-sidebar-mobile-btn"
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2.5 bg-amber-50/40 border-b border-amber-100/60">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              Progresso do Curso
            </span>
            <span className="text-amber-700 font-semibold">
              {progressPercent}% ({completedCount}/{totalChapters})
            </span>
          </div>
          <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-slate-200/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="sidebar-search-input"
              type="text"
              placeholder="Buscar capítulos, classes, tópicos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Recursive Curriculum Tree */}
        <div className="flex-1 overflow-y-auto p-3">
          {filteredTree.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Nenhum capítulo ou submódulo encontrado para "{searchQuery}".
            </div>
          ) : (
            filteredTree.map((node) => (
              <ModuleTreeNode
                key={node.id}
                node={node}
                level={0}
                currentChapterId={currentChapterId}
                onSelectChapter={(id) => {
                  onSelectChapter(id);
                  onCloseMobile();
                }}
                completedChapters={completedChapters}
                collapsedMap={collapsedMap}
                onToggleCollapse={toggleCollapse}
                searchActive={Boolean(searchQuery.trim())}
              />
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {totalChapters} Capítulos
          </span>
          <span className="text-slate-400">JDK 21+ LTS</span>
        </div>
      </aside>
    </>
  );
};
