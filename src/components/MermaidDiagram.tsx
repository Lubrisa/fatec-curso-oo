import React, { useEffect, useState, useMemo } from 'react';
import mermaid from 'mermaid';
import { Network, AlertCircle, RefreshCw, Code2, Check, Copy } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
}

let mermaidInitialized = false;
let diagramCounter = 0;
// Global cache for rendered diagrams so they never re-render or flicker on scroll/navigate
const diagramSvgCache = new Map<string, string>();

function ensureMermaidInitialized() {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'default',
      themeVariables: {
        primaryColor: '#fef3c7',
        primaryTextColor: '#78350f',
        primaryBorderColor: '#d97706',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#ffffff',
        fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
        fontSize: '13px',
      },
    });
    mermaidInitialized = true;
  }
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = React.memo(({ chart }) => {
  const trimmedChart = useMemo(() => chart.trim(), [chart]);
  const cachedSvg = diagramSvgCache.get(trimmedChart);

  const [svgHtml, setSvgHtml] = useState<string>(() => cachedSvg || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !cachedSvg);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate a STABLE, safe unique ID for this instance
  const diagramId = useMemo(() => {
    diagramCounter += 1;
    return `mermaid_svg_${diagramCounter}`;
  }, []);

  useEffect(() => {
    let isMounted = true;

    // If already in cache, immediately use cached SVG without re-rendering or loading spinner
    if (diagramSvgCache.has(trimmedChart)) {
      setSvgHtml(diagramSvgCache.get(trimmedChart)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const renderDiagram = async () => {
      try {
        ensureMermaidInitialized();

        // Clean up any stray container with same ID
        const existing = document.getElementById(diagramId);
        if (existing) existing.remove();
        const existingD = document.getElementById(`d${diagramId}`);
        if (existingD) existingD.remove();

        const { svg } = await mermaid.render(diagramId, trimmedChart);
        diagramSvgCache.set(trimmedChart, svg);

        if (isMounted) {
          setSvgHtml(svg);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.warn('Mermaid rendering failed for chart:', chart, err);
          const stray = document.getElementById(diagramId);
          if (stray) stray.remove();
          const strayD = document.getElementById(`d${diagramId}`);
          if (strayD) strayD.remove();

          setError(err instanceof Error ? err.message : 'Falha ao processar diagrama');
          setLoading(false);
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
      const el = document.getElementById(diagramId);
      if (el) el.remove();
      const elD = document.getElementById(`d${diagramId}`);
      if (elD) elD.remove();
    };
  }, [trimmedChart, diagramId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-amber-300 bg-amber-50/50 p-4">
        <div className="flex items-center space-x-2 text-amber-800 text-xs font-semibold mb-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Diagrama Mermaid (Modo texto alternativo)</span>
        </div>
        <pre className="p-3 bg-slate-900 text-slate-200 text-xs font-mono rounded-lg overflow-x-auto">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs overflow-hidden">
      {/* Diagram header badge */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          <Network className="w-3.5 h-3.5 text-amber-600" />
          Diagrama Conceitual
        </span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowCode((prev) => !prev)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 hover:text-amber-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={showCode ? 'Ocultar código do diagrama' : 'Ver código Mermaid'}
          >
            <Code2 className="w-3 h-3 text-slate-400" />
            <span>{showCode ? 'Ocultar código' : 'Ver código'}</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            Mermaid
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-400 space-x-2 text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
          <span>Renderizando diagrama...</span>
        </div>
      ) : (
        <div
          className="w-full overflow-x-auto py-2 flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      )}

      {showCode && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Fonte Mermaid:</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 text-slate-200 text-xs font-mono rounded-lg overflow-x-auto">
            <code>{chart}</code>
          </pre>
        </div>
      )}
    </div>
  );
});
MermaidDiagram.displayName = 'MermaidDiagram';
