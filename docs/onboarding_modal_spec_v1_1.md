# Onboarding Modal Specification — Tone Trainer (v1.1)

> Scope: **Onboarding functionality only** — updated with 4‑slide structure  
> Previous version: v1.0 (Intro / Usage / Share / Support)  
> This version splits Intro into two concise slides and merges all settings into one.

---

## 1. Goals

- Show value proposition in ≤ 4 swipes (≈ 25 s total).
- Language toggle **en / ja** (default = en).
- Share link & Buy‑me‑a‑Coffee CTA in final slide.
- Auto‑start metronome when modal closed after first visit.
- Manual reopen via header “?” icon.

---

## 2. State & Storage

```ts
type OnboardingState = {
  open: boolean;
  lang: 'en' | 'ja';
  auto: boolean;
};
```

- Completion flag: `localStorage["tt_onb_v1"] = "1"`.

---

## 3. Public API

```tsx
<OnboardingModal
  open={state.open}
  lang={state.lang}
  onLangChange={setLang}
  onClose={() => {
    localStorage["tt_onb_v1"] = "1";
    startMetronome();
  }}
/>
```

---

## 4. Slide Structure (4 slides)

| Index | Key (i18n) | EN Text (excerpt) | JA Text (excerpt) | Extra UI |
|-------|------------|-------------------|-------------------|----------|
| 0 | introBenefit | *Welcome to Tone Trainer — break free from fixed note patterns by practicing with random prompts.* | *Tone Trainerへようこそ — ランダム提示で決まった並びから脱却！* | SVG mascot |
| 1 | introTips | *Boost results by limiting frets or single strings.* | *フレットや弦を限定すると効果倍増。* | Mini illustration |
| 2 | usageSettings | *Tap the big note to start/pause. Adjust BPM, select notes, meter, accent & change‑every.* | *大きな音名タップで開始／停止。BPM・音名・拍子・アクセント等を調整。* | Icon grid |
| 3 | support | *Share your fastest BPM & buy me a coffee if you enjoy the app.* | *最速BPMをシェア！気に入ったらコーヒーで応援☕* | ShareButton, BuyCoffeeButton |

---

## 5. UI Outline

```
<Dialog role="dialog">
  <LangToggle  [EN] · [JA] />
  <EmblaCarousel>
     Slide0  Slide1  Slide2  Slide3
  </EmblaCarousel>
  <DotsIndicator />   // four dots
  <CloseButton  × />
</Dialog>
```

---

## 6. Interaction Spec

| Action | Behaviour |
|--------|-----------|
| × Close | Hide modal; if `auto` flag true → startMetronome() |
| LangToggle | Switch texts instantly |
| Swipe / Arrow | Change slide; Dots update |
| ShareButton | Invoke Web Share API (fallback: copy link) |
| BuyCoffeeButton | Open external BMC page |
| ESC / click‑outside | Same as Close |

---

## 7. Tech Stack

| Concern | Library |
|---------|---------|
| Modal | @headlessui/react Dialog |
| Carousel | embla-carousel-react |
| Animation | framer-motion |
| i18n | react-i18next |

---

## 8. Accessibility

- `aria-modal="true"`, focus trap.
- `LangToggle` uses `role="tablist"`.
- Each slide heading is `<h2>`, hidden from assistive tech except active.

---

## 9. Tests (Vitest + RTL)

| ID | Scenario | Expectation |
|----|-----------|-------------|
| T1 | First visit | Modal visible (`introBenefit` slide) |
| T2 | Close | LocalStorage flag set; metronome started |
| T3 | Revisit | Modal not auto‑shown |
| T4 | Manual open | Modal opens, close does **not** alter metro state |
| T5 | Lang toggle | Texts switch ja/en |
| T6 | Swipe | Slide index increments; dot active |

---

## 10. File Layout

```
packages/ui/onboarding/
  ├ OnboardingModal.tsx
  ├ slides/
  │   ├ IntroBenefit.tsx
  │   ├ IntroTips.tsx
  │   ├ UsageSettings.tsx
  │   └ Support.tsx
  └ LangToggle.tsx
locales/
  ├ en.json
  └ ja.json
```

*(End of spec)*