export interface ChapterItem {
  id: string;             // relative path e.g. "02-oo/02-objetos.md"
  title: string;          // e.g. "02. Objetos"
  subtitle?: string;      // subtitle or description
  moduleTitle: string;    // module name for breadcrumbs
  sectionTitle?: string;  // parent section or submodule
  estimatedMinutes?: number;
}

export interface ModuleNode {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  files?: ChapterItem[];
  submodules?: ModuleNode[];
}
