![Tone Trainer Logo](apps/web/public/images/logo.svg)

# Tone Trainer

> *Master notes and maintain perfect timing*  
> A web-first & native-ready practice tool for string instrument players

## Overview

Tone Trainer helps musicians master note names on the fretboard by displaying random notes synchronized to a metronome. Users match the displayed note on their instrument before it changes. By increasing the BPM, players can build speed and confidence.

## Features

- **High Precision Metronome**: BPM 20-240, time signatures (2/4, 3/4, 4/4), togglable accented first beat
- **Random Note Generator**: Selection from user-defined note pool (≥1 of 12 semitones). No repetition until pool is exhausted
- **Tap to Start/Pause**: Tap the current note to toggle playback state
- **Beat Visualization**: Pulsating ring and beat position display ("M 2 | B 3")
- **Settings & Note Pool Editing**: Inline selected notes summary (with edit button), note selector modal (3×4 toggle grid)
- **Persistence & PWA**: Settings saved to LocalStorage/AsyncStorage, installable offline PWA
- **Chord Support**: Practice not just single notes but various chord types (maj7, 7, m7, m7(b5), dim7)

## Getting Started

### Prerequisites

- Node.js (v18 LTS or higher recommended)
- Yarn package manager (v1.22 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/yasnis/ToneTrainer.git
cd ToneTrainer

# Install dependencies
yarn install
```

### Running Development Server

```bash
# Run web app in development mode
yarn dev:web

# Run mobile app in development mode
yarn dev:mobile
```

### Building

```bash
# Build web app
yarn build:web

# Build mobile app
yarn build:mobile
```

## Deployment

### Deploying to Vercel

When deploying to Vercel, the following settings are required:

1. Specify `apps/web` as the root directory
2. Select "Next.js" as the framework preset
3. Configure environment variables as needed

```bash
# If deploying using Vercel CLI
cd apps/web
vercel
```

## Project Structure

```
tone-trainer/
├ apps/                  # Applications
│ ├ mobile/             # Expo mobile app
│ └ web/                # Next.js web app
├ packages/              # Shared packages
│ ├ core/               # Audio, scheduler, note logic
│ ├ ui/                 # Shared React components
│ └ config/             # eslint, tailwind, tsconfigs
└ docs/                 # Documentation
```

## Tech Stack

| Layer | Technology Choice | Rationale |
|---------|----------|------|
| UI & Routing | Next.js 14 (Web) / Expo Router (Mobile) | Single TypeScript codebase |
| Styling | NativeWind (Tailwind) | Shareable classes across Web and Native |
| State Management | Zustand | Lightweight global store |
| Audio | Web Audio API / Expo-AV | Low latency; abstracted with `IAudioEngine` |
| Graphics | react-native-skia (+ web shim) | GPU-powered pulse ring |
| Testing | Vitest, Testing Library, Cypress | Unit/Rendering/E2E tests |
| CI/CD | GitHub Actions + Vercel + Expo EAS | Automated previews and builds |
| Repository | Turborepo + Yarn PnP | Shared `core`, `ui`, `config` packages |

## Architecture

```
UI (Next.js / Expo Router)
  ├─ NoteDisplay     (tap to start/pause)
  ├─ BeatVisualizer + BeatPositionDisplay
  └─ ControlsCard    (sliders, pickers, summary)
          │
          ▼ subscribes
   settingsStore (Zustand)
          │ injects
          ▼
   BeatManager + SimpleMetronome ── onBeat/onMeasure
          │
          ▼
   Web Audio API / Expo-AV
```

## Compatibility Notes

### Next.js 14.2.29 and later

In Next.js 14.2.29 and later, components using client hooks like `useSearchParams()` must be wrapped in a `<Suspense>` boundary. This project addresses this by:

- Separating Client Components into their own files from Server Components (`page.tsx`, `not-found.tsx`)
- Wrapping all Client Components with `<Suspense>`
- Setting `dynamic = 'force-dynamic'` where necessary

## Troubleshooting

### Build Errors

**Error: `useSearchParams() should be wrapped in a suspense boundary`**

Solution: Ensure the page component is a Server Component and wrap Client Components with `<Suspense>`. See the "Compatibility Notes" section for details.

**Error: `'X' is declared but its value is never read`**

Solution: Remove unused variables or imports.

### Web Audio Issues

**Error: Cannot start AudioContext before user interaction**

Solution: Always initialize AudioContext inside user action handlers (e.g., button click).

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Contact

If you have questions or suggestions, please open an [issue](https://github.com/yasnis/ToneTrainer/issues).

---

© 2025 Tone Trainer Team