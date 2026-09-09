import React, { useMemo } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';
import { CalloutBlock } from './CalloutBlock';
import { DetailsBlock, SummaryBlock } from './DetailsBlock';
import { resolveImageUrl, resolveInternalLink } from '../contentLoader';
import { ExternalLink } from 'lucide-react';
import {
  extractTextFromReactNode,
  slugifyHeading,
  stripFooterNavigation,
  normalizeMarkdownDetails,
} from '../utils/slugify';

interface MarkdownRendererProps {
  content: string;
  currentChapterId: string;
  onNavigate: (chapterId: string) => void;
}

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeRaw];

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({
  content,
  currentChapterId,
  onNavigate,
}) => {
  // Strip duplicate navigation links and HRs at the bottom of the chapter,
  // and normalize <details> blocks for proper HTML and markdown parsing
  const sanitizedContent = useMemo(
    () => normalizeMarkdownDetails(stripFooterNavigation(content)),
    [content]
  );

  const components: Components = useMemo(
    () => ({
      h1: ({ children }) => {
        const rawText = extractTextFromReactNode(children);
        const id = slugifyHeading(rawText);
        return (
          <h1
            id={id}
            className="scroll-mt-24 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2 mb-6 pb-3 border-b border-slate-200"
          >
            {children}
          </h1>
        );
      },
      h2: ({ children }) => {
        const rawText = extractTextFromReactNode(children);
        const id = slugifyHeading(rawText);
        return (
          <h2
            id={id}
            className="scroll-mt-24 text-2xl font-semibold tracking-tight text-slate-900 mt-10 mb-4 pt-4 border-t border-slate-200/80"
          >
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        const rawText = extractTextFromReactNode(children);
        const id = slugifyHeading(rawText);
        return (
          <h3
            id={id}
            className="scroll-mt-24 text-xl font-semibold text-slate-900 mt-6 mb-3"
          >
            {children}
          </h3>
        );
      },
      h4: ({ children }) => (
        <h4 className="text-lg font-semibold text-slate-800 mt-5 mb-2">
          {children}
        </h4>
      ),
      p: ({ children }) => (
        <p className="my-4 text-[16px] leading-7 text-slate-700 break-words">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="my-4 ml-6 list-disc space-y-2 text-slate-700">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-700">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="leading-7 pl-1 break-words">
          {children}
        </li>
      ),
      blockquote: ({ children }) => (
        <CalloutBlock>{children}</CalloutBlock>
      ),
      table: ({ children }) => (
        <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-sm text-slate-700">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="bg-slate-100/90 text-xs uppercase font-semibold text-slate-700 border-b border-slate-200">
          {children}
        </thead>
      ),
      th: ({ children }) => (
        <th className="px-4 py-3 font-semibold text-slate-800">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-3 border-t border-slate-100 text-slate-700 break-words">
          {children}
        </td>
      ),
      img: ({ src, alt }) => {
        const resolvedSrc = resolveImageUrl(currentChapterId, src || '');
        return (
          <figure className="my-6 flex flex-col items-center">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs max-w-full">
              <img
                src={resolvedSrc}
                alt={alt || 'Diagrama do curso'}
                className="max-h-[480px] w-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            {alt && (
              <figcaption className="mt-2 text-center text-xs text-slate-500 italic">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      },
      a: ({ href, children }) => {
        const targetInternal = resolveInternalLink(currentChapterId, href || '');
        if (targetInternal) {
          return (
            <button
              type="button"
              onClick={() => onNavigate(targetInternal)}
              className="font-medium text-amber-700 underline decoration-amber-400/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-700 transition-colors inline cursor-pointer text-left break-words"
            >
              {children}
            </button>
          );
        }

        const isExternal = href?.startsWith('http');
        return (
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer noopener' : undefined}
            className="font-medium text-amber-700 underline decoration-amber-400/60 underline-offset-2 hover:text-amber-900 inline-flex flex-wrap items-center gap-1 break-words"
          >
            <span>{children}</span>
            {isExternal && <ExternalLink className="w-3 h-3 text-slate-400 inline shrink-0" />}
          </a>
        );
      },
      pre: ({ children }) => <>{children}</>,
      details: DetailsBlock,
      summary: SummaryBlock,
      code: ({ className, children, node: _node, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        const lang = match ? match[1] : '';
        const codeString = String(children).replace(/\n$/, '');

        const isCodeBlock = Boolean(match || codeString.includes('\n'));
        const isMermaid =
          lang === 'mermaid' ||
          (isCodeBlock &&
            /^\s*(flowchart|graph\s+(TD|LR|TB|RL|BT)|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph)\b/m.test(
              codeString
            ));

        // Mermaid diagram detection
        if (isMermaid) {
          return <MermaidDiagram chart={codeString} />;
        }

        // Code block with syntax highlighting
        if (isCodeBlock) {
          return (
            <CodeBlock
              language={lang || 'java'}
              value={codeString}
            />
          );
        }

        // Inline code snippet
        return (
          <code
            className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[13.5px] font-medium text-amber-800 border border-slate-200"
            {...props}
          >
            {children}
          </code>
        );
      },
      hr: () => <hr className="my-8 border-slate-200" />,
    }),
    [currentChapterId, onNavigate]
  );

  return (
    <div className="markdown-content text-slate-800 leading-relaxed text-base max-w-none">
      <Markdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={components}
      >
        {sanitizedContent}
      </Markdown>
    </div>
  );
});
MarkdownRenderer.displayName = 'MarkdownRenderer';

