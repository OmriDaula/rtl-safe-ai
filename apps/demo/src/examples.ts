/**
 * Curated example inputs that exercise the different code paths of the RTL
 * engine. Control characters in the "unsafe" example are written as explicit
 * escape sequences so reviewers can see exactly what they are.
 */
export interface Example {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly text: string;
}

export const EXAMPLES: readonly Example[] = [
  {
    id: 'hebrew',
    label: 'Hebrew paragraph',
    description: 'Pure Hebrew — should detect as RTL.',
    text: 'בינה מלאכותית משנה את האופן שבו אנחנו עובדים. ממשקי צ׳אט חייבים להציג טקסט עברי בצורה נכונה, אחרת המשתמשים מתבלבלים.',
  },
  {
    id: 'arabic',
    label: 'Arabic paragraph',
    description: 'Pure Arabic — should detect as RTL.',
    text: 'الذكاء الاصطناعي يغيّر طريقة عملنا. يجب أن تعرض واجهات الدردشة النص العربي بشكل صحيح، وإلا أصيب المستخدمون بالحيرة.',
  },
  {
    id: 'mixed-he-en',
    label: 'Mixed Hebrew + English',
    description: 'RTL sentence with Latin technical terms.',
    text: 'הצוות שלנו בנה את הממשק עם React ו-TypeScript תוך שבועיים בלבד.',
  },
  {
    id: 'mixed-ar-en',
    label: 'Mixed Arabic + English',
    description: 'RTL sentence with Latin technical terms.',
    text: 'بنى فريقنا هذا المنتج باستخدام React و-TypeScript خلال أسبوعين فقط.',
  },
  {
    id: 'filename-start',
    label: 'Hebrew after filename',
    description: 'Leading filename should not flip the sentence to LTR.',
    text: 'config.json הוא קובץ ההגדרות הראשי של הפרויקט וצריך לערוך אותו בזהירות.',
  },
  {
    id: 'url-start',
    label: 'Hebrew after URL',
    description: 'Leading URL should not flip the sentence to LTR.',
    text: 'https://github.com/rtl-safe-ai המאגר פתוח לקוד וכל אחד מוזמן לתרום בו.',
  },
  {
    id: 'typescript',
    label: 'TypeScript snippet',
    description: 'Code should stay LTR.',
    text: 'export function add(a: number, b: number): number {\n  return a + b;\n}',
  },
  {
    id: 'shell-hebrew',
    label: 'Shell + Hebrew',
    description: 'Command embedded in a Hebrew explanation.',
    text: 'הרץ את הפקודה git status כדי לראות אילו קבצים השתנו לפני הקומיט.',
  },
  {
    id: 'latex-hebrew',
    label: 'LaTeX in Hebrew',
    description: 'Math is isolated as an LTR segment.',
    text: 'משפט פיתגורס קובע כי $$a^2 + b^2 = c^2$$ עבור כל משולש ישר זווית.',
  },
  {
    id: 'rtl-table',
    label: 'RTL markdown table',
    description: 'Table direction resolved from its cells.',
    text: '| שם | תפקיד | עיר |\n| --- | --- | --- |\n| דוד | מהנדס | תל אביב |\n| שרה | מעצבת | חיפה |',
  },
  {
    id: 'currency',
    label: 'Currency (not LaTeX)',
    description: '$5.99 and $5 to $10 must NOT be treated as math.',
    text: 'המחיר הוא $5.99 בלבד, והמשלוח עולה בין $5 ל-$10 נוספים.',
  },
  {
    id: 'unsafe-bidi',
    label: 'Unsafe bidi control',
    description: 'Trojan-Source style override + a zero-width char.',
    text: 'קיבלתי מייל עם קובץ בשם "report\u202Efdp.exe"\u200B שנראה תמים אך מסוכן.',
  },
];
