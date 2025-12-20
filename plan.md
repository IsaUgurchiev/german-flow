# GermanFlow MVP — план реализации по шагам

Цель MVP: пользователь смотрит немецкое видео, читает синхронные субтитры, может повторять реплики, собирать словарь и делать простые упражнения — всё без backend (assets + localStorage).

---

## 0. База проекта

### 0.1 Создать Angular проект
- Angular 21, standalone
- Tailwind CSS v4
- Статика/деплой: GitHub Pages

### 0.2 Настроить Tailwind v4
- `postcss.config.js`:
  - `@tailwindcss/postcss`
  - `autoprefixer`
- `src/styles.scss`:
  - `@import "tailwindcss";`
  - `@theme { ... }` (цвета, radius, font)

### 0.3 Layout
- `AppShellComponent` (header + router-outlet)
- `AppHeaderComponent` (логотип, XP, аватар)
- Роутинг:
  - `/video/:id`
  - `/catalog` (пока заглушка)

---

## 1. Video Page (ядро MVP)

### 1.1 Данные урока (пока mocks)
- Модель `VideoLesson`:
  - `id`, `title`, `level`, `duration`
  - `videoUrl`, `subtitlesUrl`
- Источник: `features/video/data/mock-videos.ts`

> Важно для GitHub Pages: пути к assets **без ведущего слэша**
> - `assets/videos/lesson-1.mp4`
> - `assets/subtitles/lesson-1.vtt`

### 1.2 Видео-плеер (реальный, не mock)
- `VideoPlayerComponent` на базе `<video>`
- Outputs:
  - `timeChange(currentTimeSec)`
- Methods:
  - `seekTo(sec)`
  - `play()` (или `playIfNeeded()`)

### 1.3 VTT субтитры
- `VttParserService`:
  - `loadVtt(url: string) -> Observable<SubtitleLine[]>`
- `SubtitleLine`:
  - `startSec`, `endSec`, `text`

### 1.4 Панель субтитров
- `SubtitlesPanelComponent`:
  - Inputs: `subtitles`, `currentTime`
  - Output: `seek(startSec)`
- Поведение:
  - подсветка активной строки
  - клик по строке -> `seek`
  - автоскролл активной строки (`scrollIntoView`)

✅ Критерий готовности: видео проигрывается, субтитры подсвечиваются и кликаются.

---

## 2. Phrase Loop (повтор активной реплики) — must-have

### 2.1 Toggle loop
- UI: toggle “Loop line”
- хранение state:
  - `loopEnabled: boolean`
  - `loopCount: 1|2|3` (опционально)
  - `loopsDone: number`

### 2.2 Логика loop
- Если `loopEnabled` и активная строка закончилась:
  - `seekTo(activeLine.startSec)`
  - продолжить воспроизведение
- Anti-bounce:
  - защита от повторных `seek` на каждом `timeupdate`:
    - `lastLoopedLineKey`
    - `isSeeking` или `lastSeekAt`

### 2.3 (Опционально) Loop 2x/3x
- Счётчик повторов на текущую строку
- Сброс при смене активной строки

✅ Критерий готовности: активная реплика повторяется без дёрганья.

---

## 3. Vocabulary MVP (без NLP, без backend)

### 3.1 Извлечение слов из субтитров
- `VocabularyService`:
  - вход: `SubtitleLine[]`
  - выход: `VocabItem[]` (топ N по частоте)
- Нормализация:
  - lowercase
  - убрать пунктуацию
  - фильтр stop-слов (DE)
- Показывать:
  - слово, count, пример (строка субтитров)

### 3.2 “Add to My Words”
- `ProgressService` / `WordsRepository` на `localStorage`
- Кнопка:
  - `+` добавить слово
  - `✓` уже добавлено

✅ Критерий готовности: список слов генерируется и сохраняется между перезагрузками.

---

## 4. Exercises MVP (минимум 1 тип)

### 4.1 Fill-in-the-blank из активной строки
- Берём `activeLine.text`
- Выбираем 1 слово (не stop-word)
- Рендер:
  - фраза с `____`
  - input
  - кнопка “Check”
- Проверка:
  - trim/lowercase
  - убрать пунктуацию

### 4.2 XP за упражнения
- `XpService` (localStorage):
  - +XP за правильный ответ
- Показывать XP в header (как в макете)

✅ Критерий готовности: упражнение работает и начисляет XP.

---

## 5. Progress MVP (localStorage)

### 5.1 Видео-прогресс
- сохранять:
  - `lastTimeSec` или `% watched`
- (MVP) достаточно сохранять позицию

### 5.2 Статистика в профиле (заглушка)
- `/profile` (можно позже)
- вывести:
  - total XP
  - saved words count
  - completed exercises count

---

## 6. Catalog MVP (минимально)

- `/catalog` список видео из mock данных
- карточка видео:
  - title, level, duration
  - кнопка “Open”
- переход на `/video/:id`

✅ Критерий готовности: пользователь может выбрать урок.

---

## 7. Деплой MVP (GitHub Pages)

### 7.1 Build
- `base-href` соответствует имени репозитория:
  - `/german-flow/`

### 7.2 Deploy
- папка деплоя:
  - `dist/german-flow/browser`

### 7.3 Роутинг
- hash routing (`withHashLocation()`) чтобы refresh работал на Pages

✅ Критерий готовности: сайт открывается по URL GitHub Pages, видео и VTT грузятся.

---

## MVP Definition of Done (чеклист)

- [ ] `/catalog` показывает список уроков
- [ ] `/video/1` проигрывает видео
- [ ] субтитры синхронизированы, кликабельны, автоскролл
- [ ] Loop line работает (1x, желательно 2x/3x)
- [ ] Vocabulary топ-слов + add/check + localStorage
- [ ] 1 упражнение (fill-blank) + начисление XP
- [ ] XP виден в header и сохраняется
- [ ] деплой на GitHub Pages работает

---

## Рекомендованный порядок реализации (самый быстрый)

1) Video Page + subtitles (DONE)
2) Phrase Loop (DONE/в процессе)
3) Vocabulary + localStorage
4) Fill-blank + XP
5) Catalog
6) Deploy

