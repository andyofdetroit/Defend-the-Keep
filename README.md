# Defend the Keep! v.064 — Multi-file edition

This project is a structure-only refactor of the v.064 checkpoint. Gameplay, balance, art, saves, and Hall of Heroes storage keys are preserved.

## Files

- `index.html` — page structure and script loading order
- `css/styles.css` — all interface and screen styling
- `js/config.js` — DOM references, constants, and shared game state
- `js/audio.js` — sound effects, music, and title voice
- `js/controls.js` — resizing, deployment, commands, heroes, and input
- `js/combat.js` — enemies, projectiles, damage, promotions, records, and simulation
- `js/renderer.js` — battlefield, units, towers, particles, and king portrait
- `js/main.js` — UI refresh, reset/start flow, menus, and main loop
- `checkpoint/` — untouched original single-file v.064 build

## GitHub Pages

Upload the **contents of this folder** to the root of the repository. GitHub Pages will open `index.html` automatically. Keep the `css`, `js`, and `checkpoint` folders intact.

## Important

The JavaScript files are classic scripts and must remain in the order shown in `index.html`, because they intentionally share one top-level game state.


## Version .064 — The Juice Update

- Press **Q** to toggle Developer Mode.
- Added hit stop, knockback, enhanced blood, armor sparks, movement dust, camera shake, and persistent death animations.
- Developer Mode includes live diagnostics, pause, infinite coins, effect toggles, instant spawns, kill-all, and Keep-damage testing.
