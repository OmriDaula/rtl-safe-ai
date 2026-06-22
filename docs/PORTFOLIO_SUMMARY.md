# Portfolio Summary

Reusable, honest copy for a CV, GitHub profile, or interview. Nothing here claims
certification, external audit, or real-world adoption.

## Two-line project summary

RTL Safe AI is an open-source, security-first TypeScript engine that fixes
right-to-left text (Hebrew, Arabic, and more) in AI chat interfaces. It runs
entirely locally — no telemetry, no network — and ships as a core library, a
Manifest V3 browser extension, and a React demo.

## CV bullet options

Pick one (or adapt):

1. **Built RTL Safe AI**, an open-source TypeScript monorepo (core engine +
   Manifest V3 extension + React demo) that fixes bidirectional Hebrew/Arabic
   text in AI chat UIs, with 111 tests, CI, CodeQL, and a security/privacy
   documentation layer.

2. **Designed a dependency-free TypeScript RTL/bidi engine** with security
   invariants enforced by ESLint and tests (no network, no `eval`, no HTML
   sinks), plus a privacy-first browser extension using minimal permissions.

3. **Shipped a local-only, privacy-first browser extension and library** for
   right-to-left text in AI interfaces, including Trojan-Source / invisible
   Unicode defenses, a React demo, and a full CI/CD and documentation setup.

## GitHub pinned-repo description (≤ 80 chars)

> Security-first, local-only RTL engine for Hebrew/Arabic in AI chat UIs.

Alternative:

> Local-only RTL/bidi engine + MV3 extension for Hebrew & Arabic AI chat.

## Interview answer — "Why I built this"

I write in Hebrew, and using AI chat tools every day I kept hitting the same
frustration: the moment a sentence mixes Hebrew with an English word, a link, or
a code snippet, the line direction breaks and it becomes hard to read. It's a
real, daily problem for millions of right-to-left speakers that most tools
ignore. I wanted to fix it properly — at the text level, with a small, auditable
engine — and to do it in a way that respects privacy, because chat content is
sensitive. So the whole project is local-only: nothing you type is ever stored
or sent anywhere.

## Interview answer — "What was hard technically"

The hard part is that bidirectional text is genuinely ambiguous. The Unicode
bidi algorithm is correct but context-free, so deciding the *base* direction of
a real sentence needs heuristics: a Hebrew sentence that starts with a URL or a
filename should still read right-to-left, while a code block or shell command
must stay left-to-right. I had to classify scripts by Unicode ranges, separate
"strong" letters from weak characters like Arabic-Indic digits, and segment text
into natural-language vs. code vs. math so each part renders correctly.

On top of that there's a security dimension: invisible and bidi-override
characters can be used to spoof what text *looks* like ("Trojan Source") or hide
instructions. So the engine also detects and neutralizes those, and I enforced
strict constraints (no network, no `eval`, no HTML injection) with lint rules and
invariant tests so the guarantees can't silently regress. Keeping the core pure
and dependency-free made all of this testable and easy to audit.
