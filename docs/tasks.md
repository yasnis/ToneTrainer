# Tone Trainer v1.3 – Two‑Phase Task List

## Phase 1 – Web‑only MVP

| ID | Title | Goal / Work Items | Definition of Done |
|----|-------|-------------------|--------------------|
| **P1‑00** | Initialise mono‑repo | GitHub + Turborepo skeleton (`apps`, `packages`) | `pnpm dev` blank page |
| **P1‑01** | Add web Expo Router app | Expo Router Web only | Browser shows “Hello Tone” |
| **P1‑02** | Configure Tailwind | `nativewind`; shared config | `.bg-red-500` div red |
| **P1‑03** | Build AppHeader | Logo + title | Storybook snapshot passes |
| **P1‑04** | Render CurrentNote placeholder | Static “C” centred | RTL text exists |
| **P1‑05** | Add HintLabel | “Tap to Start” | Visible in DOM |
| **P1‑06** | Sketch BeatVisualizer ring | Skia-web ring outline | Canvas element present |
| **P1‑07** | Render NextNote placeholder | Static “G” small | DOM text exists |
| **P1‑08** | Show SelectedNotesSummary | Static list + ✏️ button | Button click event fires |
| **P1‑09** | Layout ControlsCard | BPM slider UI | Slider drag updates label |
| **P1‑10** | **Assemble static UI** | Combine P1‑00…09 | Designers review UI |
| **P1‑11** | Create Zustand store | `bpm`, `running` | Store mutation tests pass |
| **P1‑12** | Implement tap start/pause | Tap toggles `running` | Jest toggle test |
| **P1‑13** | Dynamic HintLabel text | Start ↔ Pause | RTL assertion |
| **P1‑14** | Stub ToneAudioEngine | Tone.Player click | Spy verifies playback |
| **P1‑15** | Build useMetronome | Beat events from store | Fake‑timer beat count |
| **P1‑16** | Animate pulse ring | Scale on beat | Visual diff < 2 px |
| **P1‑17** | Add BeatPositionDisplay | Measure/beat counters | 4/4 cycle test |
| **P1‑18** | Implement NextNote logic | Shuffle pool, no repeats | Exhaustion unit test |
| **P1‑19** | Build NoteSelectorModal UI | 12 toggle buttons | Toggle class switches |
| **P1‑20** | Persist notePool | LocalStorage hook | Reload keeps pool |
| **P1‑21** | Reactive note summary | Summary shows pool | UI updates instantly |
| **P1‑22** | Validate pool save | Error on empty pool | Toast test |
| **P1‑23** | BPM slider 20‑240 | Range & sync | Min/max tests pass |
| **P1‑24** | Add Meter picker | 2/4 3/4 4/4 radio | Store updates |
| **P1‑25** | ChangeEvery stepper | ± buttons, min 1 | Value tests |
| **P1‑26** | Accent audio switch | Accent sample | Count match test |
| **P1‑27** | Voice selector | click / wood / beep | Engine sample swap |
| **P1‑28** | Responsive tweaks | Breakpoints 320 px | Manual QA OK |
| **P1‑29** | Skia→Canvas fallback | Canvas ring WebGL off | Cypress stub passes |
| **P1‑30** | Export PWA | Manifest + icons | Lighthouse PWA ≥ 90 |
| **P1‑31** | Add CI lint+unit | GitHub Actions | CI green badge |
| **P1‑32** | Cypress E2E test | Tap start/stop | CI < 8 s |
| **P1‑33** | Vercel preview deploy | URL per PR | Preview URL loads |
| **P1‑34** | Accessibility audit | axe‑core 0 violations | CI green |
| **P1‑35** | Performance optimise | Code‑split & compress | Lighthouse Perf ≥ 90 |
| **P1‑36** | **Web MVP release** | Tag `v0.1.0-web` | Prod URL live |

---

## Phase 2 – Native (Expo iOS / Android)

| ID | Title | Goal / Work Items | Definition of Done |
|----|-------|-------------------|--------------------|
| **P2‑00** | Add native platforms | Enable iOS & Android | `expo run:ios` boots |
| **P2‑01** | Configure NativeWind RN | Tailwind on React Native | View `.bg-red-500` red |
| **P2‑02** | Implement Expo‑AV engine | Load WAV clicks | Device audio plays |
| **P2‑03** | Inject engine via DI | Platform check hook | Web=Tone, native=AV |
| **P2‑04** | Validate drift | Measure @120 BPM | ≤ ±3 ms/min |
| **P2‑05** | Enable background audio | iOS/Android configs | Plays background |
| **P2‑06** | Test Skia performance | 60 FPS on device | No jank |
| **P2‑07** | Native storage hook | SecureStore fallback | Reload keeps data |
| **P2‑08** | Add haptic feedback | Accent vibration | Device vibrates |
| **P2‑09** | EAS preview builds | `eas build --preview` | QR install works |
| **P2‑10** | Optimise assets | Bundle WAV, icons | App icon correct |
| **P2‑11** | Safe‑area tweaks | Notch padding | No cut content |
| **P2‑12** | Accessibility labels | RN audit 0 issues | Test passes |
| **P2‑13** | Battery test | 30 min playback drain | Acceptable usage |
| **P2‑14** | Submit to stores | TestFlight / Play beta | Review received |
| **P2‑15** | **Native release** | Tag `v0.2.0-mobile` | Beta live |