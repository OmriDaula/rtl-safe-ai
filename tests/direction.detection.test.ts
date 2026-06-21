import { describe, expect, it } from 'vitest';
import { detect, detectTextDirection, isRtl } from '@rtl-safe-ai/core';

/**
 * Section 1–3: base direction detection for natural language, mixed-direction
 * text, and technical/code content.
 */

describe('basic direction detection', () => {
  it('detects Hebrew-only text as rtl', () => {
    expect(detectTextDirection('שלום עולם')).toBe('rtl');
    expect(detectTextDirection('הטקסט הזה כתוב כולו בעברית')).toBe('rtl');
  });

  it('detects Arabic-only text as rtl', () => {
    expect(detectTextDirection('مرحبا بالعالم')).toBe('rtl');
    expect(detectTextDirection('هذا النص مكتوب بالكامل بالعربية')).toBe('rtl');
  });

  it('detects Persian and Urdu text as rtl', () => {
    expect(detectTextDirection('این یک متن فارسی است')).toBe('rtl');
    expect(detectTextDirection('یہ اردو زبان میں لکھا ہے')).toBe('rtl');
  });

  it('detects English-only text as ltr', () => {
    expect(detectTextDirection('Hello world')).toBe('ltr');
    expect(detectTextDirection('The quick brown fox jumps')).toBe('ltr');
  });

  it('uses the neutral default for numbers-only text', () => {
    expect(detectTextDirection('1234567890')).toBe('ltr');
    expect(detectTextDirection('42', { neutralDefault: 'rtl' })).toBe('rtl');
  });

  it('uses the neutral default for punctuation-only text', () => {
    expect(detectTextDirection('!?.,;:()')).toBe('ltr');
    expect(detectTextDirection('---===', { neutralDefault: 'rtl' })).toBe('rtl');
  });

  it('handles empty and whitespace-only strings without throwing', () => {
    expect(detectTextDirection('')).toBe('ltr');
    expect(detectTextDirection('   \t\n ')).toBe('ltr');
    expect(detectTextDirection('', { neutralDefault: 'rtl' })).toBe('rtl');
  });
});

describe('mixed direction text', () => {
  it('keeps a Hebrew sentence with an English word rtl', () => {
    expect(detectTextDirection('הטקסט הזה משתמש במונח API מסוים')).toBe('rtl');
  });

  it('keeps an Arabic sentence with an English word rtl', () => {
    expect(detectTextDirection('هذا النص يستخدم كلمة API هنا')).toBe('rtl');
  });

  it('keeps an English-dominant sentence with one Hebrew word ltr', () => {
    expect(detectTextDirection('Please read the שלום message carefully now')).toBe('ltr');
    expect(detectTextDirection('This document explains the מערכת in detail today')).toBe('ltr');
  });

  it('resolves rtl when a Hebrew sentence starts with an English filename', () => {
    expect(detectTextDirection('config.json הקובץ הזה חשוב מאוד לפרויקט שלנו')).toBe('rtl');
  });

  it('resolves rtl when a Hebrew sentence starts with a URL', () => {
    expect(detectTextDirection('https://example.com/docs הקישור הזה מאוד שימושי')).toBe('rtl');
  });

  it('resolves rtl when a Hebrew sentence starts with a path', () => {
    expect(detectTextDirection('/usr/local/bin הנתיב הזה חשוב מאוד למערכת ההפעלה')).toBe('rtl');
  });

  it('resolves rtl when a Hebrew sentence starts with a package name or version', () => {
    expect(detectTextDirection('@types/node הספרייה הזו דרושה מאוד לפרויקט')).toBe('rtl');
    expect(detectTextDirection('v2.1.0 שוחררה אתמול עם תיקונים רבים וחשובים')).toBe('rtl');
  });

  it('keeps code-like text ltr even with an embedded RTL string literal', () => {
    expect(detectTextDirection('const greeting = "שלום";')).toBe('ltr');
    expect(detectTextDirection('let x = 5; let y = x + 1;')).toBe('ltr');
  });
});

describe('code and technical text stays ltr', () => {
  it('treats npm commands as ltr', () => {
    expect(detectTextDirection('npm install react')).toBe('ltr');
    expect(detectTextDirection('npm run build')).toBe('ltr');
  });

  it('treats git commands as ltr', () => {
    expect(detectTextDirection('git commit -m "fix bug"')).toBe('ltr');
    expect(detectTextDirection('git push origin main')).toBe('ltr');
  });

  it('treats file paths as ltr', () => {
    expect(detectTextDirection('/usr/local/bin/node')).toBe('ltr');
    expect(detectTextDirection('src/components/App.tsx')).toBe('ltr');
    expect(detectTextDirection('C:\\Users\\test\\file.txt')).toBe('ltr');
  });

  it('treats URLs as ltr', () => {
    expect(detectTextDirection('https://example.com/path?q=1')).toBe('ltr');
    expect(detectTextDirection('www.example.org')).toBe('ltr');
  });

  it('treats markdown inline code as ltr', () => {
    expect(detectTextDirection('`const x = 1`')).toBe('ltr');
  });

  it('treats fenced code blocks as ltr', () => {
    expect(detectTextDirection('```js\nconst x = 1;\n```')).toBe('ltr');
  });

  it('treats TypeScript/JavaScript snippets as ltr', () => {
    expect(detectTextDirection('export function add(a: number, b: number) { return a + b; }')).toBe(
      'ltr',
    );
  });

  it('treats JSON-like snippets as ltr', () => {
    expect(detectTextDirection('{ "name": "test", "version": "1.0.0", "list": [1, 2, 3] }')).toBe(
      'ltr',
    );
  });

  it('treats shell commands followed by a Hebrew explanation as rtl', () => {
    expect(detectTextDirection('הרץ את git status כדי לראות את המצב הנוכחי במאגר')).toBe('rtl');
  });

  it('isRtl agrees with detectTextDirection', () => {
    expect(isRtl('שלום')).toBe(true);
    expect(isRtl('hello')).toBe(false);
    expect(isRtl('npm install')).toBe(false);
  });

  it('detect reports mixed content correctly', () => {
    expect(detect('abc שלום').isMixed).toBe(true);
    expect(detect('hello world').isMixed).toBe(false);
    expect(detect('שלום עולם').isMixed).toBe(false);
  });
});
