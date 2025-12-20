# GermanFlow — MVP Roadmap (Cursor-Driven, Atomic)
> **Source of truth. Cursor must follow this file strictly.**

## Cursor Rules (must follow)
1) Read this file fully before starting any task.
2) Implement **ONLY the next unchecked item(s) `[ ]`** in order below.
3) After finishing, Cursor **MUST**:
- mark completed items `[x]`
- append an entry to `## Changelog (Cursor fills)`
4) Do not refactor unrelated code.
5) Keep current feature-based architecture.

---

## MVP DoD (Definition of Done)
MVP is ready when **all items in sections 1–8** are `[x]`.

---

## 0) Global Conventions
- [x] Angular 21 standalone app
- [x] Tailwind v4 via `@theme` (no tailwind.config)
- [x] Feature-based architecture
- [x] GitHub Pages build + hash routing configured

---

## 1) Video Lesson Core
### 1.1 Routing & Assets
- [x] Route `/video/:id` exists
- [x] MP4 assets in `src/assets/videos/`
- [x] VTT assets in `src/assets/subtitles/`
- [x] Asset URLs are relative: `assets/...`

### 1.2 Player
- [x] Native `<video>` used
- [x] `currentTimeSec` emitted on `timeupdate`

---

## 2) Subtitle Interaction
### 2.1 Loading & Parsing
- [x] Load VTT via HttpClient (`responseType: 'text'`)
- [x] Parse VTT → `SubtitleLine[] { startSec, endSec, text }`

### 2.2 Active Line
- [x] Detect active subtitle by `currentTimeSec`
- [x] Highlight active subtitle

### 2.3 Interaction
- [x] Click subtitle → seek video
- [x] Auto-scroll active subtitle into view

---

## 3) Phrase Loop (Repeat active line)
### 3.1 UI
- [x] Loop enabled toggle exists on Video Page
- [x] Add loop mode segmented control: `∞ / 2x / 3x`
  - default: `∞`
  - state stored in VideoPage container

### 3.2 Loop Engine (core logic)
- [x] Add loop engine state:
  - `loopEnabled`
  - `loopMode: infinite | 2 | 3`
  - `loopsDone`
  - `activeLineKey`

- [x] Detect line end correctly:
  - same line
  - `prevTime < endSec && currentTime >= endSec`

- [x] Anti-bounce protection (prevent seek spam)
- [x] Infinite loop behavior (`∞`)
- [x] Finite loop behavior (`2x / 3x`)
- [x] Reset loop state when active line changes

### 3.3 Persistence
- [x] Persist loop settings in localStorage:
  - `gf.loop.enabled`
  - `gf.loop.count` (mapped to mode)

---

## 4) Vocabulary MVP (lesson-based)
> Vocabulary is derived from **lesson subtitles only**.
> Saved words are a separate persistence layer.

### 4.1 Extraction
- [x] Create `VocabularyService`
  - input: `SubtitleLine[]`
  - output: `VocabItem[] { word, count, example }`
  - source of words: **subtitle text only**
- [x] Add `shared/utils/stop-words.de.ts`

### 4.2 UI
- [x] Vocabulary tab in Video sidebar
  - displays words extracted from current lesson subtitles
- [x] Add/remove word UI state
  - reflects saved state from `MyWordsRepository`

### 4.3 Storage
- [x] `MyWordsRepository` (localStorage)
  - persists user-selected words only
  - does NOT define lesson vocabulary list

---

## 5) Exercises MVP
### 5.1 Fill-in-the-blank
- [ ] `FillBlankService`
  - input: active subtitle text
  - output: `{ maskedText, answer }`
- [ ] `FillBlankCardComponent`

---

## 6) Progress & XP
- [ ] `XpService`
- [ ] Award XP for exercises
- [ ] Show XP in header

---

## 7) Catalog MVP
- [ ] `/catalog` page with mock lessons

---

## 8) Deploy MVP
- [x] base-href `/german-flow/`
- [x] output `dist/german-flow/browser`
- [x] hash routing enabled
- [x] assets load correctly on Pages

---

## Changelog (Cursor fills)
- 2025-12-20: Implemented Vocabulary MVP (Section 4).
  - Created `VocabularyService` for lesson-based extraction from subtitles.
  - Implemented `MyWordsRepository` for `localStorage` persistence of saved words.
  - Added Vocabulary tab to sidebar and updated `VocabWidgetComponent` with add/remove functionality.
  - Integrated extraction logic into `VideoPageComponent` via signals and effects.
- 2025-12-20: Implemented Phrase Loop (Section 3).
  - Added loop engine in `VideoPageComponent` with signals and anti-bounce.
  - Added UI controls in `LessonRightSidebarComponent` (Toggle + ∞/2x/3x selector).
  - Added localStorage persistence for loop settings.
  - Verified auto-scroll and subtitle interactions.
