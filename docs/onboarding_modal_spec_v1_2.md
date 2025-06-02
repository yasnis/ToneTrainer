# Onboarding Modal Specification — Tone Trainer (v1.2)

> Updated to **2‑slide** structure (intro+tips / usage+support).  
> Applies to Tone Trainer v1.3 core.

---

## 1. Goals

- Convey value and usage in **≤ 2 swipes** (≈ 12 s).  
- Language toggle **en / ja** (default = en).  
- Share + Buy‑me‑a‑Coffee CTA included.  
- Close after first view starts metronome; later reopen via “?” icon.

---

## 2. Storage & State

```ts
localStorage["tt_onb_v1"] // "1" when completed
```

```ts
type OnboardingState = {
  open: boolean;
  lang: 'en' | 'ja';
  auto: boolean;
};
```

---

## 3. API

```tsx
<OnboardingModal
  open={open}
  lang={lang}
  onLangChange={setLang}
  onClose={() => {
    localStorage["tt_onb_v1"] = "1";
    startMetronome();
  }}
/>
```

---

## 4. Slides (2 total)

| Index | Key | **EN Copy** | **JA Copy** |
|-------|-----|-------------|-------------|
| 0 | intro | **Welcome to Tone Trainer!** Break free from fixed note orders — random prompts train real-time fretboard recall. <br /><br />**Quick tip:** limit practice to one string or a narrow fret range. Short, focused loops lock the notes into muscle memory. | **Welcome to Tone Trainer!** 指板をいつもの順番で覚える癖をリセット。ランダムな音名提示で本当の記憶を鍛えましょう。<br /><br />**上達のコツ：** 弦を 1 本に絞ったり、フレット範囲を限定して繰り返しましょう。短い集中ループが記憶を定着させます。 |
| 1 | usage | **How to use**- Tap the big note → Start / Pause • Pick your note pool & BPM • Choose meter, sound, accent • Change note every N measures <br /><br />**Support** • @sinsay_guitar • Buy me a coffee | **使い方** ・ 大きな音名タップで開始／停止・ 練習したい音名と BPM を選択・ 拍子・音色・アクセントを設定・ 何小節ごとに音名を切り替えるか指定 <br /><br />**Support** • @sinsay_guitar • Buy me a coffee |

---

## 5. UI Outline

```
<Dialog>
  <LangToggle />          // en / ja
  <EmblaCarousel>         // 2 slides
  <DotsIndicator>  ● ○    // two dots
  <CloseButton />
</Dialog>
```

---

## 6. Interaction Notes

Same as v1.1; dot count now 2.

---

## 7. Tech & Accessibility

Unchanged from v1.1.

---

## 8. Tests updates

- Adjust swipe test to expect max index 1  
- Dots indicator length = 2

---

*(End spec v1.2)*