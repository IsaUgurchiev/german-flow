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

### 5.1 Fill-in-the-blank (single card)
- [x] `FillBlankService`
- [x] `FillBlankCardComponent`
  - input: `exercise: { maskedText: string; answer: string }`
  - UI: maskedText + input + Check + feedback
  - Must not crash if `answer` is empty: show "Нет подходящих слов" and disable Check
  - NOTE: Card must be reusable for rendering a list of exercises (no direct binding to video playback)

### 5.2 Exercise Set (10 random tasks per lesson on page load)
- [x] Create `ExercisesSetService` (or `FillBlankSetService`)
  - input: `SubtitleLine[]` (lesson subtitles)
  - output: `FillBlankExercise[]` length = 10
    - `FillBlankExercise` = `{ id: string; sourceText: string; maskedText: string; answer: string }`
  - selection rules:
    - pick UNIQUE subtitle lines (by startSec-endSec key or index)
    - only lines that produce a valid exercise (`answer` not empty)
    - random sample each page reload (MVP). No need to persist.
    - if not enough valid lines: return as many as possible (>=0), do not crash

- [x] Render Exercises section as a LIST of 10 FillBlankCardComponent items
  - Source: the generated exercise set (not active line, not currentTime)
  - UI: show all exercises сразу (scrollable if needed)
  - Optional: "Regenerate" button to re-roll the 10 tasks (nice-to-have, only if trivial)

---

## 6) Progress & XP
- [x] `XpService`
- [x] Award XP for exercises
- [x] Show XP in header

---

## 7) Catalog MVP
- [x] `/catalog` page with mock lessons

---

## 8) Deploy MVP
- [x] base-href `/german-flow/`
- [x] output `dist/german-flow/browser`
- [x] hash routing enabled
- [x] assets load correctly on Pages

---

## 9) My Progress (local-only, no backend)

> Goal: show user learning progress using existing localStorage data.
> No backend. No advanced analytics. MVP-level clarity only.

### 9.1 Route & Page shell
- [x] Create `/progress` route
- [x] Create `ProgressPageComponent`
  - title: "My Progress"
  - simple layout container (no complex UI yet)

DoD:
- Page opens at `/progress`
- No errors if localStorage is empty

---

### 9.2 Progress Summary (stats cards)
- [x] Create `ProgressSummaryService`
  - aggregates data from:
    - `XpService` (total XP)
    - `MyWordsRepository` (saved words count)
  - output:
    ```ts
    {
      totalXp: number;
      savedWordsCount: number;
    }
    ```

- [x] Display summary cards on Progress page:
  - Total XP
  - Saved words

DoD:
- Values reflect real localStorage data
- Empty state shows `0` safely

---

### 9.3 My Words Preview
- [x] Show preview list of saved words
  - source: `MyWordsRepository.getAll()`
  - show first 10 words max
- [x] Add actions:
  - "Copy all" → copies words to clipboard (newline or comma-separated)
  - "Clear all" → clears saved words (with confirm)

DoD:
- Clearing updates UI immediately
- Copy works without errors

---

### 9.4 XP Activity Log (optional but recommended)
- [x] Extend XP persistence with log:
  - new key: `gf.xp.log`
  - entry format:
    ```ts
    { ts: number; amount: number; reason: string }
    ```
- [x] Update XP awarding logic to append log entry
- [x] Show last 10 XP events on Progress page

DoD:
- XP total still works even if log is empty
- Log rendering is optional-safe

---

### 9.5 Quick Actions
- [x] Add "Continue learning" button:
  - if `gf.last.lessonId` exists → `/video/:id`
  - else → `/catalog`
- [x] Add "Go to catalog" button

DoD:
- Buttons navigate correctly
- Missing last lesson handled gracefully

---

### 9.6 Header Integration (optional)
- [x] Add link/button to `/progress` in header

DoD:
- Navigation works with hash routing
- No layout break

---

## Notes
- Do NOT add charts, graphs, or backend calls.
- Do NOT refactor existing XP or Vocabulary logic beyond what is specified.
- Keep components dumb; aggregation logic lives in services.

---

## Changelog (Cursor fills)
- 2025-12-20: Replaced native popups with beautiful confirmation modal and toast on Progress page.
- 2025-12-20: Integrated "My Progress" link into the App Header (Section 9.6).
- 2025-12-20: Added Quick Actions ("Continue learning") and last lesson persistence (Section 9.5).
- 2025-12-20: Implemented XP Activity Log and displayed it on Progress page (Section 9.4).
- 2025-12-20: Added "My Words" preview with Copy/Clear actions on Progress page (Section 9.3).
- 2025-12-20: Implemented `ProgressSummaryService` and stats cards on Progress page (Section 9.2).
- 2025-12-20: Created `/progress` route and `ProgressPageComponent` shell (Section 9.1).
- 2025-12-20: Enhanced `FillBlankCardComponent` with success effects.
  - Added temporary green highlight and "+10 XP" burst animation on correct answer.
  - Ensured effects trigger only once per exercise.
- 2025-12-20: Improved visibility of lesson level labels in the catalog.
  - Changed level badge from transparent/yellow-text to solid yellow background with dark text.
- 2025-12-20: Implemented Catalog MVP (Section 7).
  - Created `/catalog` route and `CatalogPageComponent` with mock lesson data.
  - Added navigation from catalog to video page.
  - Linked header navigation to the catalog page.
- 2025-12-20: Integrated reactive XP display in the header (Section 6).
  - Modified `AppHeaderComponent` to inject `XpService` and use a `computed` signal for display.
  - Removed static mock XP value from `AppShellComponent`.
- 2025-12-20: Implemented XP awarding for correct fill-blank answers (Section 6).
  - Modified `FillBlankCardComponent` to award +10 XP using `XpService` upon correct answer.
  - Added protection to ensure XP is only awarded once per exercise.
- 2025-12-20: Implemented `XpService` (Section 6).
  - Created logic to track and persist total XP in `localStorage`.
  - Files: `src/app/core/services/xp.service.ts`.
- 2025-12-20: Updated Exercises layout to full-width cards.
  - Changed grid to vertical list in `ExercisesSectionComponent`.
- 2025-12-20: Implemented batch Exercises Set (Section 5.2).
  - Created `FillBlankSetService` to generate up to 10 random tasks from lesson subtitles.
  - Refactored `ExercisesSectionComponent` to render a list of cards generated on page load.
  - Updated `VideoPageComponent` to trigger set generation when subtitles are available.
- 2025-12-20: Refactored `FillBlankCardComponent` to take `exercise` input and handle empty answers (Section 5.1).
- 2025-12-20: Implemented `FillBlankCardComponent` and integrated it into `ExercisesSection`.
  - Replaced mock exercise cards with a dynamic fill-in-the-blank exercise based on active subtitle.
  - Added logic to check answers and provide visual feedback.
  - Updated `VideoPageComponent` and `LessonLeftColumnComponent` to pass the active subtitle text.
- 2025-12-20: Implemented `FillBlankService` (Section 5.1).
  - Created logic to mask a single non-stop-word from subtitle text.
  - Preserves punctuation and spacing in the masked text.
  - Files: `src/app/core/services/fill-blank.service.ts`.
- 2025-12-20: Simplified sidebar UI for MVP.
  - Removed mini-vocabulary widget from the Transcript tab.
  - Subtitles now occupy the full height of the sidebar in the Transcript tab.
- 2025-12-20: Fix regression in sidebar UI.
  - Restricted mini-vocabulary widget in Transcript tab to top 3 items.
  - Added `min-h-0` to scrollable container to ensure proper flex shrinking.
  - Ensured Transcript tab main content (subtitles) is prioritized and visible.
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
