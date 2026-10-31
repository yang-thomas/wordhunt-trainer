# Word Hunt Trainer

## What it is
A solo version of GamePigeon's Word Hunt. 4x4 letter grid; words are formed
by chaining adjacent tiles (including diagonals), no tile reused per word,
minimum 3 letters. Timed rounds.
Features: solo play, show all possible words after a round, replay the same
board, create custom boards, accounts with stats (high score, average, win/loss).

## Stack (do not add to this without asking)
- Expo (React Native + Expo Router), TypeScript, targeting web first, iOS later
- Supabase for Postgres, auth, and API
- Vitest for tests
- Word list: ENABLE (enable1.txt, public domain), stored at data/words.txt

## Architecture rules
- All game logic lives in src/game/ as pure TypeScript functions with no
  React, Expo, or Supabase imports.
- Boards are generated from a seed; same seed = same board.
- A board is identified by one string, the `seed` URL param: a random seed, or
  `custom-<16 letters>` for a custom board (see src/board/boardId.ts). Phase 3
  adds a proper place to store saved boards.
- Saved games store the list of words found, not just the score.

## Scoring
100 × (length − 2)² points per word: 3 letters → 100, 4 → 400, 5 → 900,
6 → 1600. Words under 3 letters score 0. Each unique word counts once.
Generated boards must have at least 50 valid words.

## How to work with me
- I'm new to Expo, Supabase, and system design. When you introduce a new
  concept or pattern, explain it in 2-3 sentences.
- Propose a plan and wait for my OK before writing code.
- Work in small steps I can test and commit.
- Don't install new dependencies without asking.
- Prefer simple, readable code over clever code.