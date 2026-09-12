import { describe, it, expect } from 'vitest';
import { parseMath } from './MathText';

describe('parseMath', () => {
  it('leaves plain prose alone', () => {
    expect(parseMath('no maths here')).toEqual([{ kind: 'text', value: 'no maths here' }]);
  });

  it('pulls out inline and display maths', () => {
    expect(parseMath('before $a+b$ middle $$c=d$$ after')).toEqual([
      { kind: 'text', value: 'before ' },
      { kind: 'inline', value: 'a+b' },
      { kind: 'text', value: ' middle ' },
      { kind: 'display', value: 'c=d' },
      { kind: 'text', value: ' after' },
    ]);
  });

  it('does not let two currency amounts swallow the prose between them', () => {
    // The defect this guards: "$10,000 ... $1,000,000" parsed as one formula and the
    // sentence in between vanished from the page. Escaped dollars stay literal.
    const segments = parseMath('costing \\$10,000 a year versus \\$1,000,000 once a century');

    expect(segments).toHaveLength(1);
    expect(segments[0].kind).toBe('text');
    expect(segments[0].value).toBe('costing $10,000 a year versus $1,000,000 once a century');
  });

  it('still finds real maths in a line that also mentions money', () => {
    const segments = parseMath('\\$500 lost, so $x = 2$ holds');

    expect(segments.map((s) => s.kind)).toEqual(['text', 'inline', 'text']);
    expect(segments[0].value).toBe('$500 lost, so ');
    expect(segments[1].value).toBe('x = 2');
  });

  it('handles Chinese prose around maths', () => {
    const segments = parseMath('因此 $a \\times b$ 成立');
    expect(segments.map((s) => s.kind)).toEqual(['text', 'inline', 'text']);
    expect(segments[2].value).toBe(' 成立');
  });
});
