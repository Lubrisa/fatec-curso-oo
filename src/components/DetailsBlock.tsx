import React from 'react';
import { ChevronRight } from 'lucide-react';

interface DetailsBlockProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  children?: React.ReactNode;
}

interface SummaryBlockProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ children, ...props }) => {
  return (
    <summary
      className="flex items-center justify-between gap-3 px-5 py-3.5 cursor-pointer select-none font-semibold text-slate-800 hover:text-amber-950 hover:bg-amber-100/40 transition-colors list-none [&::-webkit-details-marker]:hidden bg-amber-50/40 group-open:bg-amber-50/70"
      {...props}
    >
      <div className="flex items-center gap-2.5 min-w-0 text-[14px]">
        <ChevronRight className="w-4 h-4 text-amber-600 transition-transform duration-200 group-open:rotate-90 shrink-0" />
        <span className="font-semibold text-slate-900 leading-snug">
          {children}
        </span>
      </div>
      <div className="shrink-0 flex items-center">
        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200/80 group-open:hidden shadow-2xs">
          Expandir
        </span>
        <span className="hidden text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 group-open:inline-block shadow-2xs">
          Recolher
        </span>
      </div>
    </summary>
  );
};
SummaryBlock.displayName = 'Summary';

export const DetailsBlock: React.FC<DetailsBlockProps> = ({ children, ...props }) => {
  let summaryNode: React.ReactNode = null;
  const bodyNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type === SummaryBlock ||
        child.type === 'summary' ||
        (typeof child.type === 'function' && (child.type as { displayName?: string }).displayName === 'Summary') ||
        (child.props as { 'data-is-summary'?: boolean })?.['data-is-summary'])
    ) {
      summaryNode = child;
    } else {
      bodyNodes.push(child);
    }
  });

  return (
    <details
      className="group my-6 rounded-2xl border border-amber-200/90 bg-amber-50/20 shadow-2xs open:border-amber-300 open:bg-white open:shadow-xs transition-all duration-200 overflow-hidden"
      {...props}
    >
      {summaryNode || (
        <SummaryBlock>
          <span>Aprofundamento / Detalhes</span>
        </SummaryBlock>
      )}
      <div className="px-6 py-5 border-t border-amber-100/80 bg-white/70">
        {bodyNodes}
      </div>
    </details>
  );
};
