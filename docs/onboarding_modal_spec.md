# Onboarding Modal Specification — Tone Trainer (v1.0)

> Scope: **Onboarding functionality only**. Integrates with existing Tone Trainer app (v1.3).

---

## 1. Goals

- Welcome first‑time users and explain core interactions in ≤ 15 s.
- Provide language toggle **en / ja** (default = en).
- Offer Share and Buy‑me‑a‑Coffee actions.
- Auto‑start metronome when onboarding is dismissed with ×.
- Allow manual reopening from header “?” icon on subsequent visits.

---

## 2. State & Storage

```ts
type OnboardingState = {
  open: boolean;        // modal visibility
  lang: 'en' | 'ja';    // current language
  auto: boolean;        // true when first‑visit autoplay
};
```

- Persist completion flag: `localStorage["tt_onb_v1"] = "1"`.
- On app mount:

```ts
if (!localStorage["tt_onb_v1"]) {
  setState({ open: true, auto: true });
}
```

---

## 3. Public API

```tsx
<OnboardingModal
  open={state.open}
  lang={state.lang}
  onLangChange={(l) => setState({ lang: l })}
  onClose={() => {
    localStorage["tt_onb_v1"] = "1";
    setState({ open:false });
    startMetronome();          // global action
  }}
/>
```

`startMetronome()` is provided by existing context / hook.

---

## 4. UI Structure

```
┌─────────────────────────────────────────┐
│ LangToggle  [EN] · [JA]                │
│                                         │
│  SlideCarousel (4 slides)               │
│   ┌ IntroSlide        ┐                 │
│   ├ UsageSlide        │  swipe / tap ▶ │
│   ├ ShareSlide        │                 │
│   └ SupportSlide      ┘                 │
│                                         │
│  DotsIndicator   ○ ● ○ ○               │
│                                         │
│  CloseButton  ×                          │
└─────────────────────────────────────────┘
```

### 4.1 Slides content

| ID | Key (i18n) | EN Text | JA Text | Extra |
|----|------------|---------|---------|-------|
| 0 | intro | *Welcome to Tone Trainer — learn fretboard notes in time!* | *Tone Trainerへようこそ — 指板の音名をリズムで覚えましょう！* | SVG mascot |
| 1 | usage | *Tap the big note to start/pause. Adjust tempo below.* | *大きな音名タップで開始／停止。下でテンポ調整。* | GIF demo |
| 2 | share | *Share your fastest BPM!* | *最速BPMをシェアしよう！* | `<ShareButton/>` |
| 3 | support | *Buy me a coffee if you like it.* | *気に入ったらコーヒーで応援☕* | `<BuyCoffeeButton/>` |

---

## 5. Interaction Spec

| Action | Result |
|--------|--------|
| **Close (×)** | modal hides → metronome starts (if `auto` true) |
| **LangToggle click** | updates `lang`, rerenders texts instantly |
| **Swipe / ← → buttons** | advance slides; update dots |
| **ShareButton** | invokes OS share sheet with current BPM link |
| **BuyCoffeeButton** | opens BMC external URL (`target="_blank"`) |
| **ESC / outside click** | same as Close |

Keyboard trap enforced (`aria-modal="true"`).

---

## 6. Tech Stack Constraints

| Concern | Library |
|---------|---------|
| Modal | **@headlessui/react `Dialog`** |
| Carousel | **embla-carousel-react** (touch & keyboard) |
| Lang toggle | Plain buttons or `@headlessui/react` Tabs |
| Animations | **framer-motion** (`AnimatePresence`) |
| i18n | **react-i18next** (`locales/en.json`, `ja.json`) |

No additional global state library; re‑use existing Zustand store if available.

---

## 7. Accessibility

- `role="dialog"` `aria-modal="true"`.
- `LangToggle` = `role="tablist"`.
- All buttons have `aria-label`.
- Focus returns to previously focused element after close.

---

## 8. Tests (Vitest + RTL)

1. **First visit shows modal**  
   - Clear `localStorage`, render → expect dialog in document.
2. **Close writes flag & starts metro**  
   - Mock `startMetronome`, click × → flag set, fn called.
3. **Second visit hidden**  
   - With flag in storage, modal not rendered.
4. **Manual open via prop**  
   - `open=true` → dialog visible, close keeps metro state.
5. **Lang toggle**  
   - Click JA → text matches ja JSON.
6. **Carousel swipe**  
   - Fire swipe gesture → slide index increments, dots update.

---

## 9. File Locations

```
packages/ui/
 └─ onboarding/
     ├─ OnboardingModal.tsx
     ├─ slides/
     │   ├─ IntroSlide.tsx
     │   ├─ UsageSlide.tsx
     │   ├─ ShareSlide.tsx
     │   └─ SupportSlide.tsx
     ├─ LangToggle.tsx
     └─ index.ts
packages/core/locales/
 ├─ en.json
 └─ ja.json
```

---

*(End of spec)*