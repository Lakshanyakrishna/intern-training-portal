import type { ReactNode } from 'react';

// Small markdown-lite renderer for lesson.content -- intentionally not a
// full markdown library (no new dependency for what's fundamentally
// headings/paragraphs/lists/code). Supports: ## and ### headings,
// paragraphs, -/* bullet lists, 1. numbered lists, ```fenced code```, and
// inline **bold** / `code`.

type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; code: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'code', code: codeLines.join('\n') });
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() });
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
  }

  return blocks;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Order matters: try **bold** before *italic* so "**x**" isn't consumed
  // by the single-asterisk alternative first.
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={`${keyPrefix}-b-${idx++}`} className="font-semibold text-primary">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      parts.push(<em key={`${keyPrefix}-i-${idx++}`} className="italic">{token.slice(1, -1)}</em>);
    } else {
      parts.push(<code key={`${keyPrefix}-c-${idx++}`} className="px-1.5 py-0.5 rounded bg-surface-alt text-primary text-[0.85em] font-mono">{token.slice(1, -1)}</code>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function LessonContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-4 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        const key = `block-${i}`;

        if (block.type === 'heading') {
          return block.level === 2 ? (
            <h2 key={key} className="text-lg font-semibold text-primary pt-2 first:pt-0">{renderInline(block.text, key)}</h2>
          ) : (
            <h3 key={key} className="text-base font-semibold text-primary pt-1 first:pt-0">{renderInline(block.text, key)}</h3>
          );
        }

        if (block.type === 'paragraph') {
          return <p key={key} className="text-secondary">{renderInline(block.text, key)}</p>;
        }

        if (block.type === 'ul') {
          return (
            <ul key={key} className="list-disc list-outside pl-5 space-y-1.5 text-secondary">
              {block.items.map((item, j) => <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>)}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={key} className="list-decimal list-outside pl-5 space-y-1.5 text-secondary">
              {block.items.map((item, j) => <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>)}
            </ol>
          );
        }

        return (
          <pre key={key} className="bg-[#1e1e1e] text-neutral-100 rounded-xl p-4 overflow-x-auto text-[13px] leading-relaxed">
            <code>{block.code}</code>
          </pre>
        );
      })}
    </div>
  );
}
