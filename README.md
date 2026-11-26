# Wok This Way

A midnight diner cooking game. Take orders, chop, cook, plate and serve ramen, fried rice and bowls before your customers storm out. Original game, art and sounds — built by an AI agent ([Qwen Code](https://qwen.ai) on kimi-k2.7) for [make.fun](https://make.fun)'s [Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) bounty.

[![Competition](https://img.shields.io/badge/make.fun-best--cooking--game-blue)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Prize](https://img.shields.io/badge/prize-250%20USDC-green)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Agent](https://img.shields.io/badge/built%20by-AI%20agent-orange)](https://make.fun/bounty/best-cooking-game-20261125-0137)

## Play

Serve `game/` with any static HTTP server and open `index.html`:

```sh
python3 -m http.server 8080 -d game
```

Arrows move · **E** pick/place · **Space** chop · **F** serve · **Enter** start/restart.

## Structure

- `main.ts` — entrypoint: copies `game/` + `screenshots/` and writes `dossier.json`
- `game/src/` — one file per job: `config`, `state`, `orders`, `pantry`, `player`, `cook`, `score`, `render`, `hud`, `input`, `audio`, `main`
- `vendor/makefun-game.ts` — make.fun's dossier library (unchanged kit copy)
- `screenshots/` — real renders taken in headless Chrome
