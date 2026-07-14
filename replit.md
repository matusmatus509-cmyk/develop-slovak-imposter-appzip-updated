# Kto klame? — Party Games App

A Slovak/Czech-language party game app built with React + Vite + Tailwind CSS.

## Stack

- **React 19** + TypeScript
- **Vite 7** (dev server on port 5000)
- **Tailwind CSS v4**
- Pure frontend — no backend, no database, no API keys needed
- Game state stored in `localStorage`

## Games

- **Podvodník (Impostor)** — Spyfall-style game where one player gets a hint instead of the secret word
- **Pravda alebo výzva** — Truth or Dare
- **Nikdy som nikdy** — Never Have I Ever
- **Radšej by som…** — Would You Rather

## Running

```bash
npm run dev
```

Runs on port 5000. Configured as the "Start application" workflow.

## Quiz (Tímová párty bitka)

`QUIZ_QUESTIONS` in `src/data/teamBattle.ts` holds both question types:
- **Multiple-choice** (`options` + `correctIndex` set) — once a team buzzes in, `src/screens/teamBattle/Quiz.tsx` hides the answer texts and shows only the four letters (A/B/C/D); the team must pick from memory. Scoring is automatic: correct = point for that team, wrong = point for the opponent, no manual judging.
- **Open-ended** (no `options`) — unchanged buzzer flow: a team buzzes, the host manually judges ✅/❌ with a second-chance for the other team on a wrong answer.

## Key files

- `src/App.tsx` — main router / state
- `src/screens/impostor/` — Impostor game screens (Setup, Reveal, Discussion, Voting, Result, History)
- `src/screens/minigames/` — Truth or Dare, Never Have I Ever, Would You Rather
- `src/data/categories.ts` — word categories
- `src/utils/gameLogic.ts` — round generation logic

## User preferences

- Keep the existing project structure and Slovak/Czech language throughout
