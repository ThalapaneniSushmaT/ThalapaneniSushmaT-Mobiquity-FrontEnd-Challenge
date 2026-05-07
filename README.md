# Movie Explorer

Movie Explorer is a small Angular application that connects to TMDB and lets users:
- browse popular movies
- filter the list by genre
- open a detail page for each movie

## Setup instructions (local)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure TMDB API key (environment files)

Per assignment requirements, the API key is stored in Angular environment files.

1. Open `src/environments/environment.development.ts`
2. Set `tmdbApiKey` to your TMDB developer key


### 3) Run locally

```bash
npm start
```

## i18n (EN + NL)

- Source locale: `en-US` (English)
- Translated locale: `nl` (Dutch)
- Locale catalogs in repo: `src/locale/messages.en.xlf` and `src/locale/messages.nl.xlf`
- Translation file: `src/locale/messages.nl.xlf` (fully populated for current app keys)

Run Dutch locale directly:

```bash
npm run start:nl
```

Open `http://localhost:4200` and view application in the browser

### 4) Run tests

```bash
npm test
```