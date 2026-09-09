import React from 'react';

/**
 * Extracts plain text from React nodes (strings, numbers, arrays, or JSX elements)
 */
export function extractTextFromReactNode(node: React.ReactNode): string {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join('');
  if (typeof node === 'object' && 'props' in node && node.props) {
    return extractTextFromReactNode(node.props.children);
  }
  return '';
}

/**
 * Generates a clean, normalized slug for headings
 * Handles punctuation, code blocks, diacritics/accents, and special symbols
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '');        // remove leading/trailing hyphens
}

/**
 * Strips navigation links and trailing separators from the end of chapter markdown
 * e.g. <p align="right"><a href="...">...</a></p> or --- followed by return links
 */
export function stripFooterNavigation(markdown: string): string {
  if (!markdown) return '';

  let cleaned = markdown;

  // Remove trailing <p align="...">...</p> containing links to previous/next chapters
  cleaned = cleaned.replace(/<p\s+align=["'](?:right|left|center)["']>\s*<a\s+href=[^>]+>.*?<\/a>\s*<\/p>\s*$/is, '');

  // Remove trailing <a href="...">...</a> links at the end
  cleaned = cleaned.replace(/<a\s+href=["'][^"']+["']>\s*(?:←|→|Voltar|Próximo|Anterior).*?<\/a>\s*$/is, '');

  // Remove trailing markdown links [Próximo: ...](...) or [← Voltar...](...)
  cleaned = cleaned.replace(/\[(?:←|→|Voltar|Próximo|Anterior)[^\]]+\]\([^\)]+\)\s*$/is, '');

  // Remove trailing horizontal rule (--- or ***) that was preceding the removed links
  cleaned = cleaned.replace(/\n\s*---\s*$/is, '');
  cleaned = cleaned.replace(/\n\s*\*\*\*\s*$/is, '');

  return cleaned.trimEnd();
}

/**
 * Normalizes <details> and <summary> blocks in markdown to ensure that CommonMark
 * and rehype-raw treat inner content as parsed markdown blocks rather than raw text.
 */
export function normalizeMarkdownDetails(markdown: string): string {
  if (!markdown) return '';
  let res = markdown;

  // Ensure <details> starts on its own paragraph with blank lines
  res = res.replace(/([^\n])\s*<details>/gi, '$1\n\n<details>');
  res = res.replace(/<details>\s*/gi, '<details>\n\n');

  // Ensure <summary>...</summary> is on its own block with blank lines around content
  res = res.replace(/<summary>([\s\S]*?)<\/summary>\s*/gi, '<summary>$1</summary>\n\n');

  // Ensure </details> has blank lines before and after
  res = res.replace(/\s*<\/details>/gi, '\n\n</details>\n\n');

  return res;
}
