# Defend the Keep! v.111 — Keep Balance & Battle Animation

Major campaign and command update.

- Three-act battle director with probing attacks, main assaults, final charges, pauses, and horn blasts
- Wounded Troop Retreat strategy command
- Enemy troops prioritize friendly towers; towers now have 150 HP and 30% damage resistance
- Every phase title reliably appears after the Royal Workshop
- Music grows faster, denser, and more intense with each campaign phase
- Hero names remain visibly labeled during battle
- Friendly troops and towers within 92 pixels of a hero receive +10% damage and attack speed
- Hall of Heroes is presented as a torch-lit book

Open `index.html` in a modern browser. Press Q for developer mode.


## v.111 changes
- Enemy damage dealt directly to the Keep reduced by 50%.
- Enemy melee, knight, archer, and catapult wall attacks now use visible two-frame poses.
- Hall of Heroes book is wider and shorter.
- Hall torches rebuilt as chunky, square-pixel NES/Atari-style sprites.


## Version .113 — Compact Command Bar

This branch returns to the full-screen `.111` presentation and changes only the HUD/control layout.

- No letterboxing
- No fixed 16:9 stage
- Full browser-window battlefield
- Shorter top HUD
- Shorter bottom control bar
- Eight unit buttons in one row
- Four strategy buttons side by side
- More vertical battlefield space
- No gameplay, balance, AI, art, or campaign changes


## Version .116 — Heroes Are Forged

Definitive .113 graphics/layout retained.

Gameplay changes:
- Random hero deployment every 100 friendly deployments is removed.
- An ordinary friendly combat unit becomes a Hero immediately upon reaching 10 kills.
- Earned Heroes receive the existing generated name, Hero stat bonus, persistent name display, and 10% nearby friendly aura.
- Veteran visual/stat progression continues independently after Hero promotion.
- At the end of every level, ALL ordinary troops and non-Hero veterans leave. Only living Heroes return for the next battle.
- Enemy troops now tactically engage friendly combatants they encounter while advancing instead of routinely walking past them.
- Melee enemies use a 46px engagement radius. Ranged enemies engage friendly troops within their normal firing range.
- Towers remain strategic objectives; nearby friendly troops can now intercept attackers en route.

No graphics, control layout, Level 1 pacing, costs, or base balance values were changed from .113.


## Version .117 — Hold the Line

- Heroes are earned at 3 kills instead of 10.
- Towers now cost 20 Royal Purse.
- Every level after Dawn compounds an additional 10% boost to enemy HP, damage, movement speed, and attack rate.
- Enemy troops now have a more visible two-frame marching cycle.
- Enemy archers and catapults no longer idle indefinitely when no target is in range; they advance to their siege position and attack the Keep.
- Friendly troops no longer disappear past the northern edge.
- While enemies are still deploying, friendly melee troops establish a defensive line near the top of the battlefield.
- They temporarily leave the line to intercept nearby attackers or threatening ranged units, then return.
- Once the entire enemy army has deployed, surviving friendly troops sweep back through the battlefield to eliminate enemies that broke through.

## Version .12 — Eight Nations
Major strategy update: eight selectable nations with asymmetric bonuses and random enemy nations; period-inspired waving keep banners; enemy mounted herald at each level; How to Play screen; 4-kill Hero threshold (Japan 3); France fortifications; England archer range; Spain melee; HRE healing; Holland organic purse / enemy +10% army; Russia periodic free soldiers; China catapult splash; cavalry +50% vs archers; enemies scale without movement-speed escalation; friendly figure-eight defensive patrol; controlled 9-second Dragon with arrow keys and 80px fire radius.

## Version .121 — Royal Records
- Rebuilt nation selector as a contained responsive 4×2 grid with chunky period-inspired flag previews.
- Replaced Hero-only Hall with top-ten player reigns, scored from kills, stage, purse spent, and Heroes forged.
- Each record includes player, nation flag, detailed stats, and the run's best Hero story.
- Fixed controlled Dragon freeze caused by an undefined aura variable.
- Improved mounted herald with a recognizable two-frame gallop and rider.
- Improved Keep and herald flags with larger, chunkier two-frame waving shapes.
- Exaggerated enemy two-frame marching legs, body bob, and lateral step.

## Version .122 — Banners & Dragon
- Reworked all eight flags into more recognizable period-inspired designs.
- Updated menu flags, Royal Record flags, Keep banners, and herald banners consistently.
- Dragon speed increased from 44 to 92 and damage radius increased from 80 to 120 pixels.
- Fixed the real enemy-walking bug: enemy animation timers were never being advanced.
- Exaggerated the two marching frames for clearer legs, body bob, and stride.
- Royal Records torches now use an obvious multi-frame chunky flame, moving core, sparks, and offset timing.

## Version .123 — Four Torches
- Enemy walking animation reduced to a normal, readable two-frame step without exaggerated lateral hopping.
- Royal Records now has two independently animated torches on each side.
- In-game banners use a three-frame waving outline, moving highlight/shadow folds, and a more lively trailing edge.
- All enemy nation bonuses have been cut approximately in half:
  England 5% range; Spain 5% melee; France 5% tower HP; HRE 7.5% HP;
  Japan 10% elite boost; China 10% splash; Holland 5% extra army;
  Russia one free Raider per 20 deployments.
- Player nation bonuses remain unchanged.

## Version .124 — Nation Toggles
Developer Mode now includes two independent live controls:
- PLAYER NATION: ON/OFF
- ENEMY NATION: ON/OFF

Turning one off disables that side's nation-specific dynamic effects and prevents nation bonuses from being applied to newly deployed or spawned units. Existing units that already received a one-time stat modification keep their current values until a new game.

## Version .125 — Targeting & Direction
- Fixed misleading wall combat: when an enemy acquires a troop or tower target, wall-attack animation stops immediately.
- Added a 0.20-second attack handoff delay when switching from the Keep to a defender, preventing a pre-charged wall strike from instantly hitting the arriving troop.
- Controlled Dragon now changes visual direction with arrow-key movement and faces north when control expires.
- Flag fields and emblems now move together with the cloth wave, so crosses, stripes, suns, stars, and other symbols no longer appear stationary inside a moving outline.

## Version .126 — Fortifications
- Added Aggressive/Defensive stance toggle. Defensive keeps troops close to the Keep and limits pursuit.
- Added friendly Berserker: 3 coins, 30 HP, 9 damage, slow attack.
- Added deployable Wall segments: 10 coins, 250 base HP, snapping to nearby walls/towers, destructible, and friendly automatic gate animation.
- Enemies attempt to route around isolated walls; broad blockades force them to attack.
- Friendly troops pass through wall gates.
- France and Keep/Fortification workshop upgrades improve wall HP.
- Enemy catapults deal +50% damage to walls and towers.

## Version .127 — Command Bar Fix
- Rebuilt the expanded bottom command bar around the ten unit buttons and five strategy buttons.
- Unit controls now use a deliberate 5×2 layout.
- Strategy controls use one complete five-button row.
- Added explicit row sizing, smaller icons/text, responsive heights, and overflow protection so buttons are no longer clipped at the bottom.

## Version .128 — Wall & Stance Fix
- Fixed the invisible-wall bug: wall objects were being created correctly but never included in the renderer's draw pass.
- Replaced the stance button with a permanent split Aggressive/Defensive toggle.
- The active stance occupies the highlighted half; clicking flips the highlight and emphasis to the other half.

## Version .129 — Wall Polish
- Open wall gates now expose a true transparent passage showing the battlefield turf behind them.
- Added a stronger stone arch and a visibly raised portcullis when friendly troops pass.
- Melee enemies now close to the face of a wall before attacking instead of striking from the wall-detection distance.
- Walls are fully immune to positional knockback while retaining damage flashes, particles, hit stop, and destruction effects.
