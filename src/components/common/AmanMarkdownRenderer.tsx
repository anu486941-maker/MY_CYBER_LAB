import React, { useState } from 'react';
import { Copy, Check, Terminal, Code, ChevronDown, ChevronRight, AlertCircle, Info } from 'lucide-react';

interface AmanMarkdownRendererProps {
  content: string;
  className?: string;
}

export const AmanMarkdownRenderer: React.FC<AmanMarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content by code blocks and disclosure blocks
  const parts = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-3 leading-relaxed text-slate-200 text-sm md:text-base selection:bg-cyan-500/30 selection:text-cyan-200 ${className}`}>
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeBlock key={idx} code={part.content} language={part.language} />;
        }
        if (part.type === 'details') {
          return <DetailsBlock key={idx} summary={part.summary || 'Technical Breakdown'} content={part.content} />;
        }
        if (part.type === 'table') {
          return <TableBlock key={idx} rawTable={part.content} />;
        }
        return <TextBlock key={idx} text={part.content} />;
      })}
    </div>
  );
};

interface BlockPart {
  type: 'text' | 'code' | 'details' | 'table';
  content: string;
  language?: string;
  summary?: string;
}

function parseMarkdownBlocks(raw: string): BlockPart[] {
  const parts: BlockPart[] = [];
  const lines = raw.split('\n');

  let inCode = false;
  let codeLang = '';
  let codeBuffer: string[] = [];

  let inDetails = false;
  let detailsSummary = '';
  let detailsBuffer: string[] = [];

  let inTable = false;
  let tableBuffer: string[] = [];

  let textBuffer: string[] = [];

  const flushText = () => {
    if (textBuffer.length > 0) {
      parts.push({ type: 'text', content: textBuffer.join('\n') });
      textBuffer = [];
    }
  };

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      parts.push({ type: 'table', content: tableBuffer.join('\n') });
      tableBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code fences
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        flushText();
        flushTable();
        inCode = true;
        codeLang = line.trim().replace(/^```/, '').trim();
        codeBuffer = [];
      } else {
        inCode = false;
        parts.push({ type: 'code', content: codeBuffer.join('\n'), language: codeLang });
        codeBuffer = [];
        codeLang = '';
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // Check details / summary
    if (line.includes('<details>')) {
      flushText();
      flushTable();
      inDetails = true;
      detailsBuffer = [];
      detailsSummary = 'Deep Dive';
      continue;
    }

    if (inDetails) {
      if (line.includes('</details>')) {
        inDetails = false;
        parts.push({ type: 'details', content: detailsBuffer.join('\n'), summary: detailsSummary });
        detailsBuffer = [];
        continue;
      }
      const sumMatch = line.match(/<summary>(.*?)<\/summary>/i);
      if (sumMatch) {
        detailsSummary = sumMatch[1];
        continue;
      }
      detailsBuffer.push(line);
      continue;
    }

    // Check markdown table (line starts and ends with |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushText();
      inTable = true;
      tableBuffer.push(line);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    textBuffer.push(line);
  }

  if (inCode && codeBuffer.length > 0) {
    parts.push({ type: 'code', content: codeBuffer.join('\n'), language: codeLang });
  }
  if (inDetails && detailsBuffer.length > 0) {
    parts.push({ type: 'details', content: detailsBuffer.join('\n'), summary: detailsSummary });
  }
  if (tableBuffer.length > 0) {
    flushTable();
  }
  flushText();

  return parts;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanLang = (language || 'bash').toUpperCase();
  const lineCount = code.split('\n').length;

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 font-mono shadow-md text-xs sm:text-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-cyan-400 text-xs tracking-wider">{cleanLang}</span>
          <span className="text-[11px] text-slate-500">({lineCount} {lineCount === 1 ? 'line' : 'lines'})</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto text-slate-200 selection:bg-cyan-500/30">
        <pre className="m-0 leading-relaxed font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const DetailsBlock: React.FC<{ summary: string; content: string }> = ({ summary, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-2 border border-slate-800 rounded-lg bg-slate-900/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-left font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
      >
        <span className="flex items-center gap-2 text-cyan-400">
          <Info className="w-4 h-4 text-cyan-400" />
          {summary}
        </span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40 text-slate-300 text-xs sm:text-sm">
          <AmanMarkdownRenderer content={content} />
        </div>
      )}
    </div>
  );
};

const TableBlock: React.FC<{ rawTable: string }> = ({ rawTable }) => {
  const rows = rawTable
    .trim()
    .split('\n')
    .map(line =>
      line
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim())
    );

  if (rows.length === 0) return null;

  const header = rows[0];
  const bodyRows = rows.slice(1).filter(r => !r.every(c => /^[-:\s]+$/.test(c)));

  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
            {header.map((col, idx) => (
              <th key={idx} className="px-3 py-2 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
          {bodyRows.map((r, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-slate-900/50 transition-colors">
              {r.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-3 py-2 text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TextBlock: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-2.5">
      {paragraphs.map((p, pIdx) => {
        if (!p.trim()) return null;

        const lines = p.split('\n');

        // Check for Markdown headers
        const firstLine = lines[0].trim();
        if (firstLine.startsWith('### ')) {
          return (
            <div key={pIdx} className="pt-2">
              <h4 className="text-base font-bold text-cyan-400">
                {renderInlineFormatting(firstLine.replace(/^###\s+/, ''))}
              </h4>
              {lines.length > 1 && (
                <p className="mt-1">{lines.slice(1).map((l, i) => <span key={i}>{renderInlineFormatting(l)}<br /></span>)}</p>
              )}
            </div>
          );
        }
        if (firstLine.startsWith('## ')) {
          return (
            <div key={pIdx} className="pt-2">
              <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-1">
                {renderInlineFormatting(firstLine.replace(/^##\s+/, ''))}
              </h3>
              {lines.length > 1 && (
                <p className="mt-1">{lines.slice(1).map((l, i) => <span key={i}>{renderInlineFormatting(l)}<br /></span>)}</p>
              )}
            </div>
          );
        }
        if (firstLine.startsWith('# ')) {
          return (
            <div key={pIdx} className="pt-2">
              <h2 className="text-xl font-extrabold text-white border-b border-slate-700 pb-1.5">
                {renderInlineFormatting(firstLine.replace(/^#\s+/, ''))}
              </h2>
              {lines.length > 1 && (
                <p className="mt-1">{lines.slice(1).map((l, i) => <span key={i}>{renderInlineFormatting(l)}<br /></span>)}</p>
              )}
            </div>
          );
        }

        // Check for blockquote
        if (lines.every(l => l.trim().startsWith('>'))) {
          return (
            <blockquote key={pIdx} className="my-2 border-l-4 border-cyan-500 bg-cyan-950/20 pl-3 py-1.5 italic text-slate-300 rounded-r">
              {lines.map((l, i) => (
                <div key={i}>{renderInlineFormatting(l.replace(/^>\s?/, ''))}</div>
              ))}
            </blockquote>
          );
        }

        // Check for lists
        const isBulletList = lines.every(l => /^\s*[-*]\s+/.test(l));
        if (isBulletList) {
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-1 text-slate-300">
              {lines.map((l, i) => (
                <li key={i}>{renderInlineFormatting(l.replace(/^\s*[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        const isNumberedList = lines.every(l => /^\s*\d+\.\s+/.test(l));
        if (isNumberedList) {
          return (
            <ol key={pIdx} className="list-decimal pl-5 space-y-1 text-slate-300">
              {lines.map((l, i) => (
                <li key={i}>{renderInlineFormatting(l.replace(/^\s*\d+\.\s+/, ''))}</li>
              ))}
            </ol>
          );
        }

        // Regular paragraph
        return (
          <p key={pIdx} className="text-slate-200">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineFormatting(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

function renderInlineFormatting(raw: string): React.ReactNode[] {
  // Regex to match code, bold, italic, and links
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = raw.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline code
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="mx-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Markdown link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}
