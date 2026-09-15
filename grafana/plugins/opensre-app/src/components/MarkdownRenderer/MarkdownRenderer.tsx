import React, { useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const s = useStyles2(getStyles);

  // Parse into blocks
  const blocks = parseBlocks(content);

  return (
    <div className={s.container}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'code':
            return <CodeBlock key={idx} language={block.language || 'text'} code={block.text || ''} />;
          case 'header':
            if (block.level === 1) {return <h2 key={idx} className={s.h1}>{renderInline(block.text, s)}</h2>;}
            if (block.level === 2) {return <h3 key={idx} className={s.h2}>{renderInline(block.text, s)}</h3>;}
            return <h4 key={idx} className={s.h3}>{renderInline(block.text, s)}</h4>;
          case 'list':
            return (
              <ul key={idx} className={s.list}>
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className={s.listItem}>
                    {renderInline(item, s)}
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return <TableBlock key={idx} headers={block.headers} rows={block.rows} styles={s} />;
          case 'paragraph':
          default:
            return (
              <p key={idx} className={s.paragraph}>
                {renderInline(block.text, s)}
              </p>
            );
        }
      })}
    </div>
  );
};

interface Block {
  type: 'paragraph' | 'header' | 'code' | 'list' | 'table';
  text?: string;
  level?: number;
  language?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith('```')) {
      const language = line.trim().substring(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: 'code',
        language: language || 'text',
        text: codeLines.join('\n'),
      });
      continue;
    }

    // Table block
    if (line.trim().startsWith('|') && line.trim().endsWith('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
      const headers = line.split('|').slice(1, -1).map(h => h.trim());
      i += 2; // skip header and delimiter
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].split('|').slice(1, -1).map(c => c.trim());
        rows.push(row);
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // Header
    const headerMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headerMatch) {
      blocks.push({
        type: 'header',
        level: headerMatch[1].length,
        text: headerMatch[2],
      });
      i++;
      continue;
    }

    // List items
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph (group consecutive non-empty lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^(#{1,4})\s+/) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|'))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join('\n') });
    }
  }

  return blocks;
}

function renderInline(text: string | undefined, s: ReturnType<typeof getStyles>): React.ReactNode {
  if (!text) {return null;}

  // Split on inline tokens: `code`, **bold**, *italic*, [link](url)
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|🟢\s*[^,\n.]+|🟡\s*[^,\n.]+|🔴\s*[^,\n.]+)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) {return null;}

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className={s.inlineCode}>
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className={s.strong}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        return (
          <a key={idx} href={match[2]} target="_blank" rel="noopener noreferrer" className={s.link}>
            {match[1]}
          </a>
        );
      }
    }
    if (part.startsWith('🟢')) {
      return <span key={idx} className={s.badgeNormal}>{part}</span>;
    }
    if (part.startsWith('🟡')) {
      return <span key={idx} className={s.badgeWarning}>{part}</span>;
    }
    if (part.startsWith('🔴')) {
      return <span key={idx} className={s.badgeCritical}>{part}</span>;
    }

    return part;
  });
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const s = useStyles2(getStyles);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={s.codeContainer}>
      <div className={s.codeHeader}>
        <span className={s.codeLang}>{language || 'code'}</span>
        <Button
          size="xs"
          variant="secondary"
          fill="outline"
          icon={copied ? 'check' : 'copy'}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className={s.codePre}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

const TableBlock: React.FC<{ headers?: string[]; rows?: string[][]; styles: ReturnType<typeof getStyles> }> = ({
  headers,
  rows,
  styles,
}) => {
  if (!headers || !rows) {return null;}
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>{renderInline(cell, styles)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    font-size: ${theme.typography.body.fontSize};
    line-height: 1.6;
    color: ${theme.colors.text.primary};
  `,
  h1: css`
    font-size: 1.25rem;
    font-weight: 600;
    margin: ${theme.spacing(2, 0, 1, 0)};
    color: ${theme.colors.primary.text};
    border-bottom: 1px solid ${theme.colors.border.weak};
    padding-bottom: ${theme.spacing(0.5)};
  `,
  h2: css`
    font-size: 1.1rem;
    font-weight: 600;
    margin: ${theme.spacing(1.5, 0, 0.75, 0)};
    color: ${theme.colors.text.primary};
  `,
  h3: css`
    font-size: 0.95rem;
    font-weight: 600;
    margin: ${theme.spacing(1, 0, 0.5, 0)};
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,
  paragraph: css`
    margin-bottom: ${theme.spacing(1.25)};
    white-space: pre-line;
  `,
  list: css`
    margin: ${theme.spacing(0.5, 0, 1.25, 2)};
    padding: 0;
  `,
  listItem: css`
    margin-bottom: ${theme.spacing(0.5)};
  `,
  inlineCode: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: 0.85em;
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${theme.colors.primary.text};
  `,
  strong: css`
    font-weight: 600;
    color: ${theme.colors.text.primary};
  `,
  link: css`
    color: ${theme.colors.primary.text};
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  `,
  codeContainer: css`
    margin: ${theme.spacing(1.5, 0)};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    overflow: hidden;
  `,
  codeHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing(0.5, 1.5)};
    background: ${theme.colors.background.canvas};
    border-bottom: 1px solid ${theme.colors.border.weak};
  `,
  codeLang: css`
    font-size: 0.75rem;
    font-family: ${theme.typography.fontFamilyMonospace};
    text-transform: uppercase;
    color: ${theme.colors.text.secondary};
    font-weight: 600;
  `,
  codePre: css`
    margin: 0;
    padding: ${theme.spacing(1.5)};
    overflow-x: auto;
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: 0.85rem;
    line-height: 1.45;
  `,
  badgeNormal: css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(16, 185, 129, 0.3);
  `,
  badgeWarning: css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(245, 158, 11, 0.3);
  `,
  badgeCritical: css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(239, 68, 68, 0.3);
  `,
  tableWrapper: css`
    overflow-x: auto;
    margin: ${theme.spacing(1.5, 0)};
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    th, td {
      border: 1px solid ${theme.colors.border.weak};
      padding: ${theme.spacing(0.75, 1)};
      text-align: left;
    }
    th {
      background: ${theme.colors.background.secondary};
      font-weight: 600;
    }
  `,
});
