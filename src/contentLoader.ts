// Content and asset loader for FATEC OO Course

const markdownModules: Record<string, string> = import.meta.glob([
  '../README.md',
  '../00-fundamentos/*.md',
  '../01-java-basico/*.md',
  '../01-java-basico/estruturas/*.md',
  '../02-oo/*.md',
  '../03-java-in-depth/**/*.md',
  '../ecossistema/**/*.md',
], { query: '?raw', import: 'default', eager: true });

const imageModules: Record<string, string> = import.meta.glob([
  '../01-java-basico/imgs/*.png',
  '../02-oo/imgs/*.png',
], { import: 'default', eager: true });

export function getMarkdownContent(chapterId: string): string {
  const key = `../${chapterId.replace(/^\//, '')}`;
  if (markdownModules[key]) {
    return markdownModules[key];
  }
  // Try alternative matching
  for (const k of Object.keys(markdownModules)) {
    if (k.endsWith(chapterId) || k.endsWith('/' + chapterId)) {
      return markdownModules[k];
    }
  }
  return `# Conteúdo não encontrado\n\nO arquivo \`${chapterId}\` não foi localizado.`;
}

/**
 * Resolves a relative path from the current chapter file to an image asset
 */
export function resolveImageUrl(currentChapterId: string, src: string): string {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }

  // Get current chapter directory
  const parts = currentChapterId.split('/');
  parts.pop(); // remove filename
  const currentDir = parts.join('/');

  // Normalize path
  let targetPath = src.trim();
  if (targetPath.startsWith('./')) {
    targetPath = targetPath.slice(2);
  }

  let fullRelativePath = '';
  if (targetPath.startsWith('../')) {
    const targetParts = targetPath.split('/');
    const dirParts = currentDir ? currentDir.split('/') : [];
    while (targetParts[0] === '..') {
      targetParts.shift();
      dirParts.pop();
    }
    fullRelativePath = [...dirParts, ...targetParts].join('/');
  } else if (targetPath.startsWith('/')) {
    fullRelativePath = targetPath.slice(1);
  } else {
    fullRelativePath = currentDir ? `${currentDir}/${targetPath}` : targetPath;
  }

  const key = `../${fullRelativePath}`;
  if (imageModules[key]) {
    return imageModules[key];
  }

  // Look for partial match
  const filename = targetPath.split('/').pop();
  if (filename) {
    for (const [k, url] of Object.entries(imageModules)) {
      if (k.endsWith(filename)) {
        return url;
      }
    }
  }

  return src;
}

/**
 * Resolves an internal markdown link from the current chapter file
 */
export function resolveInternalLink(currentChapterId: string, href: string): string | null {
  if (!href) return null;
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('mailto:')) {
    return null;
  }

  // Clean anchors
  const [cleanHref] = href.split('#');
  if (!cleanHref || !cleanHref.endsWith('.md')) {
    return null;
  }

  const parts = currentChapterId.split('/');
  parts.pop(); // remove file
  const currentDir = parts.join('/');

  let targetPath = cleanHref.trim();
  if (targetPath.startsWith('./')) {
    targetPath = targetPath.slice(2);
  }

  let fullRelativePath = '';
  if (targetPath.startsWith('../')) {
    const targetParts = targetPath.split('/');
    const dirParts = currentDir ? currentDir.split('/') : [];
    while (targetParts[0] === '..') {
      targetParts.shift();
      dirParts.pop();
    }
    fullRelativePath = [...dirParts, ...targetParts].join('/');
  } else if (targetPath.startsWith('/')) {
    fullRelativePath = targetPath.slice(1);
  } else {
    fullRelativePath = currentDir ? `${currentDir}/${targetPath}` : targetPath;
  }

  return fullRelativePath;
}

/**
 * Full-text search across all course markdown content
 */
export interface SearchResult {
  chapterId: string;
  matchSnippet: string;
}

export function searchInChapters(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const [key, content] of Object.entries(markdownModules)) {
    const chapterId = key.replace(/^\.\.\//, '');
    const lower = content.toLowerCase();
    const index = lower.indexOf(q);
    if (index !== -1) {
      const start = Math.max(0, index - 40);
      const end = Math.min(content.length, index + q.length + 60);
      let snippet = content.slice(start, end).replace(/[\r\n]+/g, ' ');
      if (start > 0) snippet = '...' + snippet;
      if (end < content.length) snippet = snippet + '...';
      results.push({
        chapterId,
        matchSnippet: snippet,
      });
    }
  }

  return results;
}
