<div dir="rtl" lang="he" align="right">

# rtl-safe-ai

**מנוע RTL חופשי ומאובטח לממשקי צ׳אט של בינה מלאכותית.**

[![CI](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/ci.yml)
[![CodeQL](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/codeql.yml/badge.svg)](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-111%20passing-success.svg)](./tests)
[![No telemetry](https://img.shields.io/badge/privacy-no%20telemetry%20%C2%B7%20local--only-brightgreen.svg)](./docs/PRIVACY.md)

הפרויקט `rtl-safe-ai` מתקן את אופן ההצגה של שפות הנכתבות מימין לשמאל — עברית,
ערבית, פרסית, אורדו, יידיש ועוד — בממשקי צ׳אט של בינה מלאכותית, שבהם טקסט מעורב
כיווניות מוצג לרוב בצורה שגויה. הוא עושה זאת באמצעות מנוע קטן, ללא תלויות,
ש**פועל באופן מקומי בלבד** ולעולם אינו נוגע בנתונים שלך.

> 🇬🇧 English: ראו [README.md](./README.md)

> **ללא הסמכה רשמית.** הפרויקט **מתוכנן להתיישר** עם עקרונות פיתוח מאובטח מוכרים
> (NIST SSDF, CISA Secure by Design, OWASP ASVS והנחיות שרשרת האספקה של מערך
> הסייבר הלאומי), אך אינו מוסמך או מאושר על ידי גורם חיצוני כלשהו — ראו את
> [תיעוד האבטחה](#תיעוד-אבטחה-ופרטיות).

---

## הבעיה

ממשקי צ׳אט של בינה מלאכותית בנויים מלכתחילה לכיוון שמאל‑לימין. כשתשובה משלבת
עברית או ערבית עם אנגלית, קוד, כתובות URL, נתיבי קבצים או נוסחאות — האלגוריתם
הדו‑כיווני (bidi) מציג את הטקסט בסדר מבלבל: משפטים מתהפכים, סימני פיסוק קופצים
לצד הלא נכון, וכתובת URL בתחילת פסקה עלולה לכפות הצגה שמאל‑לימין על פסקה שלמה
בעברית. גרוע מכך, תווי יוניקוד נסתרים ותווי עקיפת כיווניות עלולים לשמש לזיוף
הטקסט המוצג (Trojan Source) או להסתרת הוראות.

## הפתרון

מנוע TypeScript טהור שמזהה את כיוון הבסיס הנכון של טקסט מעורב, שומר קוד ונוסחאות
בכיוון שמאל‑לימין, ומנטרל תווי בקרה לא בטוחים/נסתרים — הכול **מקומית, בזיכרון,
ללא גישת רשת**. אותו מנוע מפעיל גם את תוסף הדפדפן וגם את אפליקציית ההדגמה.

## למה זה חשוב לדוברי עברית וערבית

מי שכותב בעברית או בערבית מול כלי בינה מלאכותית נתקל יום‑יום בטקסט מבולגן: משפט
שמשלב מילה באנגלית, קישור או קטע קוד — ומיד מתהפך וקשה לקריאה. הפרויקט פותר זאת
ברמת הטקסט, באופן שמכבד את הפרטיות: שום דבר ממה שאתם כותבים אינו נשמר או נשלח.

## יכולות

- 🔤 **זיהוי כיווניות חכם** לעברית, ערבית, פרסית, אורדו, יידיש, סורית, ת׳אנה,
  נְקֹו, אדלם ועוד.
- 🧩 **מודעות לתוכן מעורב** — שומר כתובות URL, נתיבים, קוד ונוסחאות LaTeX בכיוון
  שמאל‑לימין תוך זיהוי נכון של המשפט שמסביב.
- 📊 **זיהוי כיוון לטבלאות Markdown** באמצעות הצבעת רוב על תאים.
- 🛡️ **בטיחות bidi**: הסרת תווי עקיפה מסוג Trojan Source ונטרול יוניקוד
  נסתר/ברוחב אפס; `isPlainTextSafe()` מסמן שימוש לרעה.
- 🧪 **מכוסה בבדיקות**: 111 בדיקות, כולל אינוריאנטות אבטחה.
- 🧱 **ללא תלויות זמן ריצה** בליבה; פונקציות טהורות וסינכרוניות.

## מה הפרויקט הזה לעולם לא יעשה

זהו גבול נוקשה ובלתי ניתן למשא ומתן. הפרויקט `rtl-safe-ai` **אינו**:

- ❌ מתקן אפליקציות דסקטופ או משנה קבצי מערכת
- ❌ דורש הרשאות מנהל / root
- ❌ עוקף בדיקות תקינות אפליקציה או חתימת קוד
- ❌ מתקין תעודות או מיירט תעבורת TLS
- ❌ ניגש לעוגיות, אסימונים, סיסמאות או פרטי הזדהות כלשהם
- ❌ אוסף טלמטריה או נתוני אנליטיקה
- ❌ שולח בקשות רשת מכל סוג
- ❌ משתמש ב‑`eval` או בהרצת קוד דינמית
- ❌ מציג HTML לא מהימן באמצעות `innerHTML`

כל העיבוד מתבצע **מקומית, בתוך הדף, ובאופן סינכרוני.**

## עקרונות אבטחה

| עיקרון | אופן האכיפה |
| --- | --- |
| ללא טלמטריה / אנליטיקה | אין קוד כזה; בדיקת CI סורקת את הליבה. |
| ללא רשת חיצונית | ESLint חוסם `fetch`/`XHR`; ה‑CSP של התוסף מגדיר `connect-src 'none'`. |
| ללא `eval` | כללי `no-eval`, `no-new-func`. |
| ללא `innerHTML` | חסימה ב‑ESLint; הליבה עובדת על מחרוזות בלבד. |
| ללא גישה לפרטי הזדהות | התוסף אינו מבקש הרשאות כאלה. |
| עיבוד מקומי בלבד | הליבה היא פונקציות טהורות, ללא קלט/פלט. |
| הרשאות מינימליות | התוסף מבקש רק `activeTab` ו‑`storage`. |

## התחייבויות פרטיות

ללא טלמטריה, ללא אנליטיקה, ללא מעקב וללא בקשות רשת. הטקסט שלך לעולם אינו נאסף,
נשמר או נשלח. תוסף הדפדפן שומר מקומית רק העדפת הפעלה/כיבוי לפי אתר. ראו
[docs/PRIVACY.md](./docs/PRIVACY.md).

## תיעוד אבטחה ופרטיות

תכנון מאובטח מיסודו, **שמתוכנן להתיישר** עם עקרונות פיתוח מאובטח של NIST SSDF,
CISA Secure by Design, OWASP ASVS והנחיות שרשרת האספקה של מערך הסייבר הלאומי.
מדובר בהערכה עצמית, לא בהסמכה של גורם חיצוני.

| מסמך | תוכן |
| --- | --- |
| [SECURITY.md](./SECURITY.md) | מדיניות אבטחה ודיווח על פגיעויות. |
| [docs/SECURITY.md](./docs/SECURITY.md) | סקירת אבטחה ובקרות. |
| [docs/PRIVACY.md](./docs/PRIVACY.md) | התחייבויות פרטיות (ללא טלמטריה, מקומי בלבד). |
| [docs/THREAT_MODEL.md](./docs/THREAT_MODEL.md) | נכסים, איומים והגנות. |
| [docs/COMPLIANCE_MATRIX.md](./docs/COMPLIANCE_MATRIX.md) | מיפוי הערכה עצמית מול מסגרות. |
| [docs/SUPPLY_CHAIN.md](./docs/SUPPLY_CHAIN.md) | נוהלי שרשרת אספקה ותלויות. |
| [docs/EXTENSION_SECURITY.md](./docs/EXTENSION_SECURITY.md) | מודל האבטחה של תוסף הדפדפן. |
| [docs/RELEASE_SECURITY.md](./docs/RELEASE_SECURITY.md) | רשימת בדיקות לפני שחרור גרסה. |

## התחלה מהירה

נדרש **Node.js ≥ 20** ו‑npm.

```bash
npm install
npm run typecheck
npm run lint
npm test
```

### הרצת אפליקציית ההדגמה

```bash
npm run dev:demo
```

### בנייה וטעינה של תוסף הדפדפן

```bash
npm run build --workspace @rtl-safe-ai/browser-extension
```

לאחר מכן טוענים אותו ללא אריזה:

1. פותחים את `chrome://extensions` (או `edge://extensions`).
2. מפעילים **מצב מפתח** (Developer mode).
3. לוחצים **Load unpacked** ובוחרים את `packages/browser-extension/dist`.

ראו [docs/EXTENSION_SECURITY.md](./docs/EXTENSION_SECURITY.md) למודל ההרשאות
ולמגבלות.

### שימוש בחבילת הליבה

<div dir="ltr" align="left">

```ts
import { detect, toRenderHint, isPlainTextSafe, VERSION } from '@rtl-safe-ai/core';

const result = detect('בדקו את https://example.com לפני שתמשיכו');
const hint = toRenderHint(result.direction);
isPlainTextSafe(untrustedText); // false אם יש תווים נסתרים/עוקפים
```

</div>

## מפת דרכים

ראו [ROADMAP.md](./ROADMAP.md) לעבודה מתוכננת ולמטרות שמחוץ לתחום.

## על הפרויקט (כפרויקט תיק עבודות)

הפרויקט נבנה כדי לפתור בעיה אמיתית של דוברי עברית וערבית בכלי בינה מלאכותית, והוא
מדגים TypeScript, React, פיתוח תוסף דפדפן, טיפול ביוניקוד דו‑כיווני, הנדסה
ממוקדת‑אבטחה, בדיקות, CI/CD ותיעוד פתוח. לסיכום קצר ולנקודות לקורות חיים ראו
[docs/PORTFOLIO_SUMMARY.md](./docs/PORTFOLIO_SUMMARY.md).

## תרומה לפרויקט

תרומות יתקבלו בברכה! קראו את [CONTRIBUTING.md](./CONTRIBUTING.md) ואת
[כללי ההתנהגות](./CODE_OF_CONDUCT.md), ושמרו כל שינוי בגבולות עקרונות האבטחה.

## רישיון

[MIT](./LICENSE)

</div>
