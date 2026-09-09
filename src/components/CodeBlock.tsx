import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markup'; // XML/HTML
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'java', value }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [value, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const normalizedLang = (language || 'java').toLowerCase();
  const prismLang = Prism.languages[normalizedLang] ? normalizedLang : 'java';
  const highlighted = Prism.languages[prismLang]
    ? Prism.highlight(value, Prism.languages[prismLang], prismLang)
    : value;

  return (
    <div className="relative group my-5 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-md">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 border-b border-slate-700/70 text-xs text-slate-300 select-none">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          <span className="ml-2 font-mono uppercase font-semibold text-slate-400 tracking-wider text-[11px]">
            {language || 'java'}
          </span>
        </div>
        <button
          id="copy-code-button"
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-[13.5px] leading-relaxed font-mono">
        <pre className={`language-${prismLang} !bg-transparent !p-0 !m-0 text-slate-100`}>
          <code
            className={`language-${prismLang}`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
};
