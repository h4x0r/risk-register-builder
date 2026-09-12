'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders teaching prose that carries mathematics, using KaTeX.
 *
 * `$...$` is inline, `$$...$$` is a centred display block. Written this way so the
 * bilingual prose stays readable in the source while the formulas render properly —
 * "3(x√f)(y√f) = 3xy·f" set as plain text is exactly the sort of thing a student
 * skips over.
 *
 * SAFETY: the LaTeX handed to katex.renderToString comes only from the static
 * content in education.ts, never from user input, so the rendered HTML cannot carry
 * anything a reader supplied. If that ever stops being true, this must change —
 * KaTeX's own `trust` option defaults to false, but the input path is the real
 * control here.
 */

function renderLatex(latex: string, displayMode: boolean): string {
  return katex.renderToString(latex, {
    displayMode,
    throwOnError: false,
    // A malformed formula shows in red rather than blowing up the panel, so a typo
    // in the content is visible to whoever is editing it.
    errorColor: '#9e1b1b',
    strict: 'ignore',
    output: 'html',
  });
}

interface Segment {
  kind: 'text' | 'inline' | 'display';
  value: string;
}

/** Split prose into text and math runs. `$$` wins over `$` so display math parses first. */
export function parseMath(source: string): Segment[] {
  const segments: Segment[] = [];
  // Non-greedy so adjacent formulas do not merge into one run.
  const pattern = /\$\$([^$]+?)\$\$|\$([^$]+?)\$/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > cursor) {
      segments.push({ kind: 'text', value: source.slice(cursor, match.index) });
    }
    if (match[1] !== undefined) segments.push({ kind: 'display', value: match[1].trim() });
    else segments.push({ kind: 'inline', value: match[2].trim() });
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) segments.push({ kind: 'text', value: source.slice(cursor) });

  return segments;
}

export function MathText({ children, className }: { children: string; className?: string }) {
  const segments = useMemo(() => parseMath(children), [children]);

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        if (segment.kind === 'text') return <span key={i}>{segment.value}</span>;

        const html = renderLatex(segment.value, segment.kind === 'display');

        return segment.kind === 'display' ? (
          <span
            key={i}
            className="my-3 block overflow-x-auto rounded-[4px] border-l-2 border-[var(--brand)] bg-muted/40 px-3 py-2.5"
            // Static authored LaTeX only — see the safety note in the file header.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          // Static authored LaTeX only — see the safety note in the file header.
          <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
        );
      })}
    </span>
  );
}
