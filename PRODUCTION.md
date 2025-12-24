# GermanFlow — Production Roadmap (Cursor-Driven, Atomic)
> Source of truth. Cursor must follow this file strictly.

## Cursor Rules (must follow)
1. Read this file fully before starting any task.
2. Implement ONLY the next unchecked item(s) [ ] in order.
3. After finishing, Cursor MUST:
  - mark completed items [x]
  - append an entry to CHANGELOG.md (NOT here)
4. Do not refactor unrelated code.
5. Keep feature-based architecture in frontend.
6. Build must stay green after each step.

---

## Production DoD (Definition of Done)
Production v0 is ready when:
- Repo is split into /frontend and /backend
- Frontend builds & deploys to GitHub Pages
- Backend deploys on Render/Railway
- /api/health works
- Google OAuth login works
- User state sync works (XP, XP log, My Words, last lesson)
- App works offline and degrades gracefully if backend is unavailable

---

## 0) Repo Restructure (Monorepo)

### 0.1 Create folders and move code
- [x] Create /frontend and move existing Angular app into it
- [x] Preserve git history (use git mv)
- [x] Create empty /backend directory

DoD:
- Root contains: frontend/, backend/, PRODUCTION.md, CHANGELOG.md
- `cd frontend && npm install` works

---

### 0.2 Fix tooling & docs
- [x] Update README (if exists) to reference frontend/
- [x] Ensure frontend scripts still work
- [x] Fix any broken relative paths

DoD:
- Frontend builds successfully after move

---

## 1) Extract MVP changelog

### 1.1 Create CHANGELOG.md
- [x] Create CHANGELOG.md in repo root

### 1.2 Move MVP changelog
- [x] Remove `## Changelog` section from MVP.md
- [x] Paste it into CHANGELOG.md under `## MVP (historical)`

DoD:
- MVP.md contains no changelog
- All history preserved in CHANGELOG.md

---

## 2) Frontend deploy after move

### 2.1 GitHub Pages
- [x] Update build pipeline to use /frontend
- [x] Ensure base-href and hash routing still correct

DoD:
- GitHub Pages build succeeds
- App works as before

---

## 3) Backend v0 — Django Skeleton

### 3.1 Create Django project
- [x] Create Django project in /backend
- [x] Add requirements.txt:
  - Django
  - djangorestframework
  - django-cors-headers
  - gunicorn
  - dj-database-url
  - psycopg or psycopg2-binary
  - djangorestframework-simplejwt

DoD:
- `python manage.py runserver` works locally

---

### 3.2 Environment-based settings
- [x] Read SECRET_KEY, DEBUG, ALLOWED_HOSTS from env
- [x] Configure DATABASE_URL via dj-database-url
- [x] Add CORS_ALLOWED_ORIGINS from env
- [x] Local dev works without DATABASE_URL (sqlite)

DoD:
- App runs locally and with Postgres

---

### 3.3 Health endpoint
- [x] Add GET /api/health → { "ok": true }

DoD:
- Endpoint returns 200 JSON

---

## 4) Backend v1 — Google OAuth + JWT

### 4.1 Google login endpoint
- [x] POST /api/auth/google
  - input: { idToken: string }
  - output: { accessToken, user }
- [x] Verify Google ID token
- [x] Create or fetch user
- [x] Issue JWT

DoD:
- Invalid token → 401
- Valid token → JWT returned

---

### 4.2 /api/me
- [x] GET /api/me (JWT protected)

DoD:
- 401 without token
- 200 with token

---

## 5) Backend v1 — User State Sync

### 5.1 UserState model
- [x] Create UserState model (1:1 with user):
  - total_xp
  - xp_log (JSON)
  - my_words (JSON)
  - last_lesson_id
  - updated_at

DoD:
- Migration applies cleanly

---

### 5.2 State endpoints
- [x] GET /api/state
- [x] POST /api/state (last-write-wins)

Payload:
```json
{
  "totalXp": 0,
  "xpLog": [],
  "myWords": [],
  "lastLessonId": null
}
```

DoD:
- New user gets safe defaults
- State roundtrip works

## 6) Frontend v1 — Auth + API

### 6.1 Backend config
- [x] Add apiBaseUrl to environment config

### 6.2 Google login UI
- [x] Add Sign in with Google
- [x] Obtain Google id_token
- [x] Exchange for backend JWT
- [x] Persist token (MVP: localStorage OK)

DoD:
- Login survives reload

---

### 6.3 API client
- [x] Attach Authorization: Bearer token to requests

DoD:
- /api/me works from frontend

---

## 7) Frontend v1 — Sync Layer

### 7.1 Pull on login
- [x] GET /api/state after login
- [x] Hydrate existing localStorage keys

DoD:
- Progress appears on new device

### 7.2 Push on change
- [x] Debounced POST /api/state on XP/words/lesson change
- [x] Fail silently if backend unavailable

DoD:
- Offline mode still works

---

## 8) Deployment v1

### 8.1 Backend deploy
- [x] Deploy backend to Render or Railway
- [x] Run migrations
- [x] Verify /api/health

DoD:
- Backend reachable via HTTPS

## 9) Quality gates
- [+] Backend tests:
  - /api/health
  - /api/state roundtrip

- [+] Frontend smoke check:
  - App boots logged-out
  - /progress opens safely

DoD:
- Tests pass

---
