import { useMemo, useState } from 'react';
import { detect, toRenderHint, VERSION } from '@rtl-safe-ai/core';

const SAMPLES: ReadonlyArray<{ label: string; text: string }> = [
  { label: 'Hebrew', text: 'שלום, איך אפשר לעזור לך היום?' },
  { label: 'Arabic', text: 'مرحبًا، كيف يمكنني مساعدتك اليوم؟' },
  { label: 'Persian', text: 'سلام، امروز چطور می‌توانم کمکتان کنم؟' },
  { label: 'Mixed', text: 'התשובה היא 42 according to the docs.' },
];

export function App(): JSX.Element {
  const [text, setText] = useState<string>(SAMPLES[0]?.text ?? '');

  const result = useMemo(() => detect(text), [text]);
  const hint = useMemo(() => toRenderHint(result.direction), [result.direction]);

  return (
    <main className="app">
      <header className="app__header">
        <h1>RTL Safe AI</h1>
        <p className="app__tag">
          Local-only RTL engine demo · core v{VERSION} ·{' '}
          <span className="app__badge">no network</span>
        </p>
      </header>

      <section className="app__panel">
        <label className="app__label" htmlFor="input">
          Input
        </label>
        <textarea
          id="input"
          className="app__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
        <div className="app__samples">
          {SAMPLES.map((s) => (
            <button key={s.label} type="button" onClick={() => setText(s.text)}>
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="app__panel">
        <h2>Detection (placeholder)</h2>
        <dl className="app__result">
          <dt>direction</dt>
          <dd>{result.direction}</dd>
          <dt>script</dt>
          <dd>{result.script}</dd>
          <dt>rtlRatio</dt>
          <dd>{result.rtlRatio.toFixed(2)}</dd>
          <dt>confidence</dt>
          <dd>{result.confidence.toFixed(2)}</dd>
        </dl>
      </section>

      <section className="app__panel">
        <h2>Preview</h2>
        <p
          className="app__preview"
          dir={hint.direction}
          style={{ unicodeBidi: hint.unicodeBidi, textAlign: hint.textAlign }}
        >
          {text}
        </p>
      </section>
    </main>
  );
}
