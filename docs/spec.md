# Tone Trainer — System Specification (v1.3)

> *Memorise every note. Keep perfect time.*  
> **Web‑first & Native‑ready** practice tool for string‑instrument players.

---

## 1. Overview

Tone Trainer helps musicians master fretboard note names by flashing random notes in sync with a metronome. Users match each displayed note on their instrument before the change. Increasing BPM builds speed and confidence.

---

## 2. Core Features

| # | Feature | Details |
|---|---------|---------|
| 1 | High‑precision metronome | BPM **20–240**; meters 2/4, 3/4, 4/4; accented first beat toggle; Web Audio / Expo‑AV |
| 2 | Random note generator | Draws from **user‑defined note pool** (≥ 1 of 12 semitones). No repeats until pool exhausted, then reshuffle. |
| 3 | Tap‑to‑Start / Tap‑to‑Pause | Tapping the Current Note toggles playback. |
| 4 | Beat visualisation | Pulsing ring plus **BeatPositionDisplay** (“M N | B n”). |
| 5 | Settings & Note pool editing | Inline **SelectedNotesSummary** (+ ✏️ button). **NoteSelectorModal** opens 3×4 toggle grid. Other controls: BPM slider, Meter picker, Voice selector, Accent switch, Change‑Every stepper. |
| 6 | Persistence & PWA | Settings saved to LocalStorage / AsyncStorage; installable offline PWA. |

---

## 3. Data Model

```ts
type Settings = {
  bpm: number;                  // 20–240
  meter: [number, number];      // e.g. [4,4]
  accent: boolean;
  changeEvery: number;          // measures
  voice: 'click' | 'wood' | 'beep';
  notePool: NoteName[];         // ≥1 selected notes
};
```

---

## 4. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| UI & Routing | Expo Router (React Native Web) | Single TypeScript code‑base |
| Styling | NativeWind (Tailwind) | Shared classes Web & Native |
| State | Zustand | Lightweight global store |
| Audio | Tone.js / Expo‑AV | Low latency; abstracted via `IAudioEngine` |
| Graphics | react‑native‑skia (+ web shim) | GPU pulse ring |
| Tests | Vitest, Testing Library, Cypress | Unit / render / E2E |
| CI/CD | GitHub Actions + Vercel + Expo EAS | Auto preview & builds |
| Repo | Turborepo + Yarn PnP | Shared `core`, `ui`, `config` packages |

---

## 5. Architecture Diagram

```
UI (Expo Router)
  ├─ CurrentNote   (tap start/pause)
  ├─ BeatVisualizer + BeatPositionDisplay
  └─ ControlsCard  (sliders, pickers, summary)
          │
          ▼ subscribes
   settingsStore (Zustand)
          │ inject
          ▼
   useMetronome() ── onBeat/onMeasure
          │
          ▼
   IAudioEngine (Tone / Expo‑AV)
```

---

## 6. Folder Structure (simplified)

```
tone-trainer/
├ apps/ (web, mobile)
├ packages/
│ ├ core/   # audio, scheduler, note logic
│ ├ ui/     # shared RN components
│ └ config/ # eslint, tailwind, tsconfigs
└ docs/
```

---

## 7. Screen Components

| Zone | Component | Behaviour |
|------|-----------|-----------|
| Header | AppHeader | Logo + **Tone Trainer** title |
| Main | CurrentNote | Displays active note; tap toggles running |
|  | HintLabel | “Tap to Start” / “Tap to Pause” |
|  | BeatVisualizer | Pulsing ring |
|  | BeatPositionDisplay | “M 2 | B 3” |
| Below | NextNote | Shows next note |
| Controls | SelectedNotesSummary | Inline list of current pool (`C D♯ G ...`) |
|  | EditNotesButton | Opens NoteSelectorModal |
|  | Other Controls | BPM slider, Meter picker, Voice selector, Accent switch, Change‑Every stepper |
| Modal | NoteSelectorModal | 3×4 grid; Select All / Clear; Save |

---

## 8. MVP Acceptance Criteria

- Tap starts/pauses playback; HintLabel updates.  
- BPM 20–240, meter, accent, changeEvery & notePool editing function correctly.  
- BeatPositionDisplay counts accurately.  
- Deployed as Vercel PWA & Expo preview; audio drift ≤ ±3 ms @120 BPM.  
- Lighthouse PWA/Perf/A11y ≥ 90.

---

© 2025 Tone Trainer Team