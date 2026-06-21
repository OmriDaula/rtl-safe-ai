import { useMemo, useState, type ReactElement } from 'react';
import {
  detect,
  detectTextDirection,
  isPlainTextSafe,
  neutralizeInvisible,
  segmentText,
  stripUnsafeControls,
  toRenderHint,
  VERSION,
  type DetectionResult,
  type RenderHint,
  type Segment,
} from '@rtl-safe-ai/core';
import { EXAMPLES, type Example } from './examples.js';

const PRINCIPLES: readonly string[] = [
  'No telemetry',
  'No network requests',
  'No credential access',
  'No DOM / HTML injection',
  'Local-only processing',
  'Open-source and auditable',
];

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function ExampleButtons({ onPick }: { onPick: (text: string) => void }): ReactElement {
  return (
    <div className="examples" role="group" aria-label="Load an example">
      {EXAMPLES.map((ex: Example) => (
        <button
          key={ex.id}
          type="button"
          className="examples__btn"
          title={ex.description}
          onClick={() => {
            onPick(ex.text);
          }}
        >
          {ex.label}
        </button>
      ))}
    </div>
  );
}

function DetectionPanel({
  result,
  hint,
  safe,
}: {
  result: DetectionResult;
  hint: RenderHint;
  safe: boolean;
}): ReactElement {
  return (
    <section className="card" aria-labelledby="detection-title">
      <h2 id="detection-title" className="card__title">
        Detection result
      </h2>
      <dl className="facts" aria-live="polite">
        <div className="facts__row">
          <dt>Direction</dt>
          <dd>
            <span className={`badge badge--${result.direction}`}>{result.direction}</span>
          </dd>
        </div>
        <div className="facts__row">
          <dt>Script</dt>
          <dd>{result.script}</dd>
        </div>
        <div className="facts__row">
          <dt>RTL ratio</dt>
          <dd>{percent(result.rtlRatio)}</dd>
        </div>
        <div className="facts__row">
          <dt>Confidence</dt>
          <dd>{percent(result.confidence)}</dd>
        </div>
        <div className="facts__row">
          <dt>Mixed direction</dt>
          <dd>{result.isMixed ? 'yes' : 'no'}</dd>
        </div>
        <div className="facts__row">
          <dt>Plain-text safe</dt>
          <dd>
            <span className={`badge ${safe ? 'badge--ok' : 'badge--warn'}`}>
              {safe ? 'safe' : 'unsafe'}
            </span>
          </dd>
        </div>
        <div className="facts__row">
          <dt>Render hint</dt>
          <dd className="facts__mono">
            dir={hint.direction}; unicode-bidi:{hint.unicodeBidi}; text-align:{hint.textAlign}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function SegmentViewer({ segments }: { segments: readonly Segment[] }): ReactElement {
  return (
    <section className="card" aria-labelledby="segments-title">
      <h2 id="segments-title" className="card__title">
        Segments <span className="card__count">({segments.length})</span>
      </h2>
      <ul className="segments">
        {segments.map((seg, i) => (
          <li key={`${seg.start}-${i}`} className="segments__item">
            <span className={`tag tag--${seg.kind}`}>{seg.kind}</span>
            <span className={`tag tag--dir-${seg.direction}`}>{seg.direction}</span>
            <code className="segments__text" dir={seg.kind === 'text' ? seg.direction : 'ltr'}>
              {seg.text.trim() === '' ? '·whitespace·' : seg.text}
            </code>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SafePreview({
  segments,
  direction,
}: {
  segments: readonly Segment[];
  direction: 'ltr' | 'rtl' | 'auto';
}): ReactElement {
  return (
    <div className="preview preview--safe" dir={direction}>
      {segments.map((seg, i) =>
        seg.kind === 'text' ? (
          <span key={`${seg.start}-${i}`} dir={seg.direction} style={{ unicodeBidi: 'isolate' }}>
            {seg.text}
          </span>
        ) : (
          <code
            key={`${seg.start}-${i}`}
            className="preview__code"
            dir="ltr"
            style={{ unicodeBidi: 'isolate' }}
          >
            {seg.text}
          </code>
        ),
      )}
    </div>
  );
}

export function App(): ReactElement {
  const [text, setText] = useState<string>(EXAMPLES[0]?.text ?? '');

  const result = useMemo(() => detect(text), [text]);
  const hint = useMemo(() => toRenderHint(result.direction), [result.direction]);
  const segments = useMemo(() => segmentText(text), [text]);
  const safe = useMemo(() => isPlainTextSafe(text), [text]);

  // The safe preview renders sanitized text so bidi-override attacks cannot
  // leak into the surrounding UI, while keeping all legitimate content.
  const sanitized = useMemo(() => neutralizeInvisible(stripUnsafeControls(text)), [text]);
  const safeSegments = useMemo(() => segmentText(sanitized), [sanitized]);
  const safeDirection = useMemo(() => detectTextDirection(sanitized), [sanitized]);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__top">
          <h1 className="hero__title">RTL Safe AI</h1>
          <span className="hero__version">core v{VERSION}</span>
        </div>
        <p className="hero__subtitle">
          Secure RTL support for Hebrew, Arabic and bidirectional AI text
        </p>
        <p className="hero__privacy" role="note">
          🔒 All processing happens locally in your browser. No text is sent anywhere.
        </p>
      </header>

      <main className="layout">
        <section className="card card--input" aria-labelledby="input-title">
          <h2 id="input-title" className="card__title">
            Input
          </h2>
          <label className="sr-only" htmlFor="rtl-input">
            Text to analyse
          </label>
          <textarea
            id="rtl-input"
            className="input"
            value={text}
            spellCheck={false}
            rows={6}
            placeholder="Type or paste Hebrew, Arabic, English or mixed text…"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <h3 className="card__subtitle">Examples</h3>
          <ExampleButtons onPick={setText} />
        </section>

        <DetectionPanel result={result} hint={hint} safe={safe} />

        <section className="card" aria-labelledby="raw-title">
          <h2 id="raw-title" className="card__title">
            Raw preview
          </h2>
          <p className="card__hint">Rendered in an LTR container with no RTL handling.</p>
          <div className="preview preview--raw" dir="ltr">
            {text === '' ? <span className="preview__empty">(empty)</span> : text}
          </div>
        </section>

        <section className="card" aria-labelledby="safe-title">
          <h2 id="safe-title" className="card__title">
            RTL Safe preview
          </h2>
          <p className="card__hint">
            Direction detected per segment; code and math stay LTR and isolated.
          </p>
          {sanitized === '' ? (
            <div className="preview preview--safe">
              <span className="preview__empty">(empty)</span>
            </div>
          ) : (
            <SafePreview segments={safeSegments} direction={safeDirection} />
          )}
        </section>

        <section className="card" aria-labelledby="sanitizer-title">
          <h2 id="sanitizer-title" className="card__title">
            Sanitizer
          </h2>
          {safe ? (
            <p className="card__hint">
              ✅ This text contains no unsafe bidi overrides or hidden characters.
            </p>
          ) : (
            <p className="card__hint card__hint--warn">
              ⚠️ Unsafe control characters detected. The sanitized output below removes bidi
              overrides and hidden zero-width characters.
            </p>
          )}
          <div className="preview preview--raw" dir="ltr">
            {sanitized === '' ? <span className="preview__empty">(empty)</span> : sanitized}
          </div>
        </section>

        <SegmentViewer segments={segments} />

        <aside className="card card--principles" aria-labelledby="principles-title">
          <h2 id="principles-title" className="card__title">
            Security principles
          </h2>
          <ul className="principles">
            {PRINCIPLES.map((p) => (
              <li key={p} className="principles__item">
                <span aria-hidden="true" className="principles__check">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
        </aside>
      </main>

      <footer className="footer">
        <p>
          RTL Safe AI · local-only RTL engine · <span className="footer__badge">no network</span>
        </p>
      </footer>
    </div>
  );
}
