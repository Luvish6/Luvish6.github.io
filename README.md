# luvish6.github.io

Personal website of **Luvish Ramchandani**: CS student at SRM, born in Zimbabwe, from Lucknow.
Live at **https://luvish6.github.io**.

Plain HTML, CSS and JavaScript (no build step), chess-themed:
- 3D chessboard opening screen (Three.js), with a knight that moves as you scroll
- Chess-square transitions between sections and a playable mate-in-one puzzle
- Projects with story pop-ups, Now, Dream projects, Journey, Certifications, and a "Luvish recommends" page
- Ctrl/⌘ + K quick jump, light/dark mode, and a few Easter eggs (try typing `e4`)

## Edit
See the [A/B Testing Analysis Toolkit README](ab-testing/README.md) for setup, tests, and deployment.

Most content lives in `script.js` (`LINKS`, `STATS`, `PROJECTS`, `STORIES`, `CERTS`).
Shows and movies live in the `RECS` array in `recommends.html`.

## Run locally
```
python -m http.server 5517
```
Then open http://localhost:5517.

## Deploy
Push to `main`; GitHub Pages publishes it automatically. Bump the `?v=` version on the CSS/JS links so visitors get fresh files.
