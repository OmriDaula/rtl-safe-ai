<!-- Thanks for contributing to rtl-safe-ai! Please fill out this template. -->

## Summary

<!-- What does this PR do and why? Link any related issues (e.g. Closes #123). -->

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that changes existing behavior/API)
- [ ] Documentation only
- [ ] Build / CI / tooling

## Security checklist

- [ ] No network access added (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`).
- [ ] No dynamic code execution (`eval`, `new Function`).
- [ ] No unsafe DOM sinks (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`).
- [ ] No new runtime dependency added to `@rtl-safe-ai/core`.
- [ ] Extension permissions unchanged or reduced.
- [ ] Security invariant tests still pass.

## Privacy checklist

- [ ] No telemetry, analytics, or tracking added.
- [ ] No user text is collected, stored, or transmitted.
- [ ] No access to cookies or website `localStorage` / `sessionStorage`.

## Tests run

<!-- Confirm the local checks you ran. -->

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm audit`

## Screenshots (if UI changed)

<!-- Add before/after screenshots for demo or extension UI changes. Otherwise write "N/A". -->
