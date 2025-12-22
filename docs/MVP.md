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


# Content Pipeline Roadmap (Cursor)

## 10) Content Pipeline (Lesson autoload, no backend)

Goal:
- Add new lessons without touching TS/HTML.
- Lessons are loaded from static assets + JSON metadata.
- Pipeline does NOT generate videos or subtitles.

---

### 10.1 Lesson data model
[x] Define LessonMeta interface

LessonMeta fields:
- id: string
- title: string
- level: A1 | A2 | B1
- durationMin: number
- videoSrc: string (relative path, assets/lessons/{id}/video.mp4)
- subtitlesSrc: string (relative path, assets/lessons/{id}/subtitles.vtt)

Definition of Done:
- Single shared interface
- No runtime logic
- No duplicate lesson formats

---

### 10.2 Lessons registry
[x] Create lessons registry file

File:
- src/assets/lessons/lessons.json

Rules:
- JSON array of LessonMeta
- Relative paths only (assets/...)
- 2–3 lessons are enough

Definition of Done:
- File loads via HttpClient
- No hardcoded lesson lists in TS

---

### 10.3 LessonsService
[x] Create LessonsService

Responsibilities:
- Load lessons.json
- Cache result in memory
- API:
  - getAllLessons()
  - getLessonById(id)

Definition of Done:
- lessons.json loaded once
- Safe fallback on error
- Components never import JSON directly

---

### 10.4 Catalog page integration
[x] Migrate /catalog to LessonsService

Definition of Done:
- Catalog renders lessons from pipeline
- Adding JSON entry shows lesson automatically

---

### 10.5 Video page integration
[x] Migrate VideoPage to pipeline

Rules:
- lessonId from route
- Load LessonMeta via LessonsService
- Use videoSrc and subtitlesSrc from metadata

Definition of Done:
- No hardcoded asset paths
- All features still work

---

### 10.6 Error handling
[x] Handle invalid lesson and missing assets

Definition of Done:
- Invalid lessonId handled gracefully
- Missing video/subtitles do not crash app

---

### 10.7 Developer workflow
[x] Document lesson adding steps

**Steps to add a new lesson:**
1.  **Prepare Assets**:
    *   Create a folder for the lesson: `src/assets/lessons/{lessonId}/` (optional, but recommended for organization).
    *   Place `video.mp4` in the video assets or lesson folder.
    *   Prepare `transcript.json` in `src/assets/transcripts/`.
2.  **Update Registry**:
    *   Add a new entry to `src/assets/lessons/lessons.json`:
        ```json
        {
          "id": "new-id",
          "title": "Lesson Title",
          "level": "A1",
          "durationMin": 10,
          "thumbnailUrl": "assets/images/new-thumbnail.png",
          "videoSrc": "assets/videos/new-video.mp4",
          "subtitlesSrc": "assets/transcripts/new-lesson.transcript.en.json"
        }
        ```
3.  **Done**: No code changes required. The new lesson will automatically appear in the Catalog and use the JSON subtitles with translations.

Definition of Done:
- Zero TS/HTML changes needed
- Works on GitHub Pages

---


## 11) Subtitles Pipeline v2 (JSON + Translation, no VTT)

Goal:
- Replace legacy `.vtt` subtitles with unified JSON transcript format
- Display original text + translation in subtitles UI
- Remove VTT parsing logic completely
- Keep all existing subtitle features working (sync, loop, vocab, exercises)

---

### 11.1 Transcript JSON format (source of truth)

Rules:
- [x] Subtitles are loaded ONLY from JSON files
- [x] `.vtt` files are no longer used anywhere in the app
- [x] `LessonMeta.subtitlesSrc` now points to a JSON file

Expected JSON format:

```json
{
  "version": 1,
  "source": { "lang": "de" },
  "target": { "lang": "en" },
  "lines": [
    {
      "startSec": 0.0,
      "endSec": 2.0,
      "de": "Aladdin und die Wunderlampe.",
      "en": "Aladdin and the magic lamp."
    }
  ]
}
```

Definition of Done:
- [x] JSON structure documented implicitly by usage
- [x] No references to VTT remain as a source format

---

### 11.2 LessonMeta update (breaking but clean)

Changes:
- [x] `subtitlesSrc` now contains path to transcript JSON, not `.vtt`

Example lesson entry:

```json
{
  "id": "1",
  "title": "Aladdin und die Wunderlampe",
  "level": "A2",
  "durationMin": 13,
  "thumbnailUrl": "assets/images/lesson-1.png",
  "videoSrc": "assets/videos/lesson-1.mp4",
  "subtitlesSrc": "assets/transcripts/lesson-1.transcript.en.json"
}
```

Definition of Done:
- [x] All lessons use JSON subtitles
- [x] No `.vtt` paths remain in lessons registry

---

### 11.3 Subtitle loading (JSON only)

Tasks:
- [x] Remove VTT loading via HttpClient with `responseType: 'text'`
- [x] Remove VTT parsing logic entirely
- [x] Implement transcript loading via `HttpClient.get<TranscriptJson>()`
- [x] Map `lines[]` to internal `SubtitleLine[]`

Internal SubtitleLine model:

```ts
{
  startSec: number;
  endSec: number;
  text: string;          // German (line.de)
  translation?: string;  // English (line.en)
}
```

Rules:
- [x] Mapping happens in exactly one place (service or adapter)
- [x] Components never work with raw transcript JSON

Definition of Done:
- [x] Subtitle pipeline works without any VTT-related code
- [x] Existing consumers (VideoPage, loop engine, vocab, exercises) still receive SubtitleLine[]

---

### 11.4 Subtitle rendering (original + translation)

UI changes:
- [x] Each subtitle item renders:
  - timecode in format `MM:SS – MM:SS`
  - German text as primary content
  - English translation below, smaller font, muted color

Rules:
- [x] Translation rendering is optional-safe
- [x] Styling remains minimal and consistent with current subtitles UI

Definition of Done:
- [x] Translation is visible under each subtitle line
- [x] No layout or scrolling regressions

---

### 11.5 Feature compatibility check (non-negotiable)

The following MUST continue to work:
- [x] Active subtitle detection by currentTimeSec
- [x] Highlight active subtitle line
- [x] Click subtitle → seek video
- [x] Auto-scroll active subtitle into view
- [x] Phrase loop (∞ / 2x / 3x)
- [x] Vocabulary extraction (from German text only)
- [x] Exercise generation

Rules:
- [x] No feature regressions allowed
- [x] No duplicated subtitle parsing logic

Definition of Done:
- [x] All MVP features behave identically using JSON subtitles

---

### 11.6 Cleanup & removal (mandatory)

Tasks:
- [x] Delete unused VTT parser files
- [x] Remove `.vtt`-specific utilities, regex logic, and types
- [x] Remove dead imports and unreachable code
- [x] Ensure project builds cleanly

Rules:
- [x] No legacy subtitle code left in the repository
- [x] JSON transcript is the only subtitle source

Definition of Done:
- [x] Codebase contains zero VTT-related logic
- [x] Project contains no unused subtitle assets

---

## 12) Exercises v2 (Restore UX step-by-step: XP Burst + Wrong Answer Feedback)

Goal:
- Restore the previously working Exercises UX (XP burst animation + clear wrong-answer feedback)
- Rebuild MCQ exercises and shared UI incrementally, one atomic sub-step at a time, to avoid regressions
- Follow the existing design reference: `src/app/_design/code.html`

Reference:
- UI mockup: `src/app/_design/code.html`
- Target behavior: as in the last known good state (XP burst + “wrong answer” feedback)

---

### 12.1 Restore XP Burst (Fill-in-the-Blank only)

Tasks:
- [x] Re-introduce the XP burst animation/effect exactly as it existed when it worked
- [x] Ensure XP is awarded only once per exercise (no double-award on repeated clicks)

Rules:
- No refactors outside the Fill-in-the-Blank card
- Keep styling and timing identical to the working version

Definition of Done:
- [x] Correct answer triggers XP burst and awards XP once
- [x] No console errors
- [x] Reloading the page does not break the card

---

### 12.2 Restore “Wrong answer” feedback text (MCQ + FillBlank)

Tasks:
- When user checks an answer and it is incorrect, show a clear feedback message (as it was before):
  - Example: “Wrong answer” / “Incorrect” + (optional) small hint
- Ensure feedback is hidden before the user presses Check

Rules:
- No correctness/answer leaks before Check
- Minimal UI changes; follow existing look and feel

Definition of Done:
- Incorrect answer shows visible feedback text
- Correct answer shows visible success feedback
- No feedback shown before user action

---

### 12.3 MCQ: Fix pre-check styling leak (no “correct border” before Check)

Tasks:
- Ensure correct option is NOT visually distinguished before pressing Check
- Unify MCQ state to enforce:
  - pre-check: all options neutral (only selected state is allowed)
  - post-check: show correct/incorrect feedback

Rules:
- Do not change exercise data format
- Do not redesign components (minimal fix)

Definition of Done:
- Before Check, correct option has no special border/background
- After Check, feedback is shown properly

---

### 12.4 MCQ: Add incorrect/correct option highlighting (post-check)

Tasks:
- After Check:
  - selected wrong option gets incorrect highlight (red)
  - correct option gets correct highlight (green)
  - if selected is correct, it gets correct highlight

Rules:
- Highlight must be applied to the option container (label/div), not only the radio input
- Keep styles consistent across MCQ types

Definition of Done:
- Wrong selections are clearly highlighted
- Correct option is clearly highlighted
- Works for all MCQ types

---

### 12.5 Deduplicate MCQ option rendering (shared component)

Tasks:
- Extract the repeated MCQ option list + state logic into a shared reusable component (or directive)
- Refactor MCQ exercise components to use the shared component

Rules:
- No behavior changes while refactoring (refactor-only step)
- Shared component must support:
  - choices
  - selectedIndex
  - checked
  - answerIndex
  - feedback rendering hook (or event output)

Definition of Done:
- MCQ code duplication removed
- Behavior identical to steps 12.2–12.4
- Easier to maintain and extend

---

### 12.6 Tabs layout for exercise types (as in mockup)

Tasks:
- Render each exercise type in its own tab, following `src/app/_design/code.html`
- Tabs hidden/disabled if type has no items

Rules:
- No redesign; follow mockup
- Switching tabs does not reset solved state within a session (MVP-level)

Definition of Done:
- Tabs work and match mockup
- Each tab shows only its exercise type list
- Empty types handled safely

---



## Changelog (Cursor fills)
- 2025-12-22: Completed Section 12.1: Restored XP Burst for Fill-in-the-Blank exercises with single-award protection (`xpAwarded` flag).
- 2025-12-22: Implemented Section 11: Subtitles Pipeline v2 (JSON + Translation, no VTT).
  - Replaced VTT parsing with JSON transcript loading in `SubtitleService`.
  - Updated `SubtitleLine` model and all consumers to use `startSec`/`endSec`.
  - Updated `LessonMeta` and `lessons.json` registry to use JSON transcripts.
  - Enhanced Subtitles UI to show English translations and start timecodes (`MM:SS`).
  - Removed legacy VTT parser logic and deleted `src/assets/subtitles/` folder.
- 2025-12-20: Aligned `ProgressPageComponent` layout and styling with `CatalogPageComponent`.
- 2025-12-20: Fixed video poster (thumbnail) not being displayed on the video page.
- 2025-12-20: Completed Content Pipeline (Section 10). Documented developer workflow for adding lessons.
- 2025-12-20: Added error handling and "Not Found" state to `VideoPageComponent` (Section 10.6).
- 2025-12-20: Migrated `VideoPageComponent` to use `LessonsService` (Section 10.5).
- 2025-12-20: Migrated `/catalog` to `LessonsService` (Section 10.4).
- 2025-12-20: Implemented `LessonsService` with caching and error handling (Section 10.3).
- 2025-12-20: Created `lessons.json` registry with 3 lessons (Section 10.2).
- 2025-12-20: Defined `LessonMeta` data model (Section 10.1).
- 2025-12-20: Improved contrast for "Loop line" button and loop count selector.
  - Changed enabled state to use solid yellow background with dark text for better visibility.
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
