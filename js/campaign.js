"use strict";
const LEVELS=[
 {name:'Dawn',className:'dawn',count:150,types:['raider','berserker'],subtitle:'The first horns sound beyond the fields.'},
 {name:'Morning',className:'morning',count:200,types:['raider','berserker','enemyArcher'],subtitle:'Enemy bowmen take their places in the rising light.'},
 {name:'Late Morning',className:'late-morning',count:275,types:['raider','berserker','enemyArcher','enemyTower'],subtitle:'Siege towers appear along the northern road.'},
 {name:'Noon',className:'noon',count:350,types:['raider','berserker','enemyArcher','enemyTower','enemyKnight'],subtitle:'Armored riders charge beneath the high sun.'},
 {name:'Afternoon',className:'afternoon',count:450,types:['raider','berserker','enemyArcher','enemyTower','enemyKnight','enemyCatapult'],subtitle:'Catapults roll into range as shadows lengthen.'},
 {name:'Evening',className:'evening',count:550,types:['raider','berserker','enemyArcher','enemyKnight','enemyCatapult','enemyDragon'],subtitle:'Wings darken the western sky.'},
 {name:'Dusk',className:'dusk',count:700,types:['raider','berserker','enemyArcher','enemyTower','enemyKnight','enemyCatapult','enemyDragon'],subtitle:'The whole enemy host advances in the purple light.'},
 {name:'Night',className:'night',count:850,types:['raider','berserker','enemyArcher','enemyTower','enemyKnight','enemyCatapult','enemyDragon'],subtitle:'Torches burn. Every surviving foe joins the final assault.'}
];
const RESEARCH=[
 {key:'speed',title:'Lighter Leather Shoes',body:'The royal cobblers propose layered soles, finer stitching, and fewer unnecessary buckles.',effect:'All defenders move 5% faster.'},
 {key:'speed',title:'Standardized Battlefield Commands',body:'The scribes have devised concise commands that even the loudest knight can understand.',effect:'All defenders move 5% faster.'},
 {key:'power',title:'Better-Tempered Blades',body:'The blacksmiths insist a slower quench will keep every sword keener through a long battle.',effect:'All defenders deal 5% more damage.'},
 {key:'power',title:'Goose-Feather Fletching',body:'The fletchers request the kingdom’s finest feathers for straighter, harder shots.',effect:'All defenders deal 5% more damage.'},
 {key:'stamina',title:'New Rivets for Our Armor',body:'The armorers believe broader rivets will keep breastplates together under repeated blows.',effect:'All defenders gain 5% stamina.'},
 {key:'stamina',title:'A More Nourishing Porridge',body:'The palace cooks have produced a gray but remarkably sustaining battlefield breakfast.',effect:'All defenders gain 5% stamina.'},
 {key:'keep',title:'Stronger Mortar',body:'The masons propose mixing horsehair and volcanic ash into the Keep’s aging mortar.',effect:'Maximum Keep integrity rises 5%.'},
 {key:'keep',title:'Oak Bracing for the Gate',body:'The carpenters request seasoned oak beams thick enough to inconvenience even a berserker.',effect:'Maximum Keep integrity rises 5%.'}
];
function currentLevel(){return LEVELS[Math.min(levelIndex,LEVELS.length-1)]}
function applyPhaseClass(){document.body.className=document.body.className.replace(/\bphase-[\w-]+\b/g,'').trim();document.body.classList.add('phase-'+currentLevel().className)}
function effectiveEnemyCount(){return Math.round(currentLevel().count*(devEnemyNation&&enemyNation==='holland'?1.05:1))}
function showLevelIntro(){levelState='intro';applyPhaseClass();$('#researchScreen').classList.add('hidden');$('#levelComplete').classList.add('hidden');$('#phaseName').textContent=currentLevel().name.toUpperCase();$('#phaseSubtitle').textContent=currentLevel().subtitle;$('#levelIntro').classList.remove('hidden');setTimeout(()=>{if(levelState==='intro')startLevel()},2200)}
function prepareCarryover(){units.filter(u=>u.hero).forEach(u=>{u.heroBattles=(u.heroBattles||0)+1;archiveHero(u)});carryover=units.filter(u=>u.hero).map(u=>({...u,hp:u.maxHp,dead:false,done:false,retreating:false,healing:false,target:null,forcedTarget:null,commandTarget:null,y:H+18,x:clamp(u.x,30,W-30),entering:true}));units=[];shots=[];parts=[];deaths=[]}
function startLevel(){herald={x:-60,y:70,t:0};toast(`THE ARMIES OF ${NATIONS[enemyNation].name.toUpperCase()} APPROACH!`); $('#levelIntro').classList.add('hidden');$('#researchScreen').classList.add('hidden');levelState='battle';levelSpawned=0;levelDefeated=0;levelStartKills=kills;spawnTick=0;elapsed=0;battleAct=0;battlePause=1.4;waveCooldown=0;waveNumber=0;battleBanner='THE ENEMY SCOUTS APPROACH';units=carryover;carryover=[];for(const u of units){u.y=H+18;u.entering=true;u.hp=u.maxHp}toast(`${currentLevel().name.toUpperCase()} — ${effectiveEnemyCount()} ENEMIES APPROACH`);startMusic();updateUI() }

function actLimit(act){return Math.round(effectiveEnemyCount()*actThresholds[act])}
function beginBattlePause(nextAct){battleAct=nextAct;battlePause=nextAct===1?5.2:6.2;waveCooldown=0;battleBanner=nextAct===1?'THE MAIN ASSAULT FORMS':nextAct===2?'THE FINAL CHARGE':'THE ENEMY REGROUPS';sfx.horn();toast(`${battleBanner}<br>THE HORNS SOUND`)}
function updateBattleDirector(dt){
 if(levelSpawned>=effectiveEnemyCount())return;
 if(battlePause>0){battlePause-=dt;return}
 const limit=actLimit(battleAct);
 if(levelSpawned>=limit&&battleAct<2){beginBattlePause(battleAct+1);return}
 waveCooldown-=dt;if(waveCooldown>0)return;
 const remaining=Math.min(limit-levelSpawned,effectiveEnemyCount()-levelSpawned);
 let min=2,max=4,gap=3.5;
 if(battleAct===1){min=5+Math.floor(levelIndex*.35);max=8+Math.floor(levelIndex*.6);gap=2.65}
 if(battleAct===2){min=8+Math.floor(levelIndex*.6);max=12+levelIndex;gap=2.15}
 let group=Math.min(remaining,Math.floor(rand(min,max+1)));
 for(let i=0;i<group;i++)spawn();
 waveNumber++;waveCooldown=Math.max(1.15,gap-levelIndex*.08+rand(-.3,.35));
 if(battleAct===2&&remaining===group)toast('THE LAST ENEMY WAVE HAS ENTERED THE FIELD!')
}

function campaignEnemyType(){let types=currentLevel().types,r=Math.random();if(types.length===2)return r<.68?'raider':'berserker';let weights={raider:36,berserker:23,enemyArcher:18,enemyTower:5,enemyKnight:9,enemyCatapult:5,enemyDragon:2};let pool=types.map(t=>[t,weights[t]||5]),sum=pool.reduce((a,x)=>a+x[1],0),pick=Math.random()*sum;for(const [t,w] of pool){pick-=w;if(pick<=0)return t}return types[0]}
function levelEnemyScale(){return 1+levelIndex*.16+(levelSpawned/effectiveEnemyCount())*.32}
function levelFinished(){return levelState==='battle'&&levelSpawned>=effectiveEnemyCount()&&enemies.length===0&&shots.filter(s=>s.enemy).length===0}
function finishLevel(){if(levelState!=='battle')return;levelState='complete';stopMusic();prepareCarryover();$('#completeTitle').textContent=currentLevel().name.toUpperCase()+' SURVIVED';$('#levelStats').innerHTML=`<div>Enemies defeated<b>${levelDefeated}</b></div><div>Keep integrity<b>${Math.ceil(keep)} / ${Math.ceil(maxKeep)}</b></div><div>Royal purse<b>${Math.floor(mana)}</b></div><div>Returning heroes<b>${carryover.length}</b></div>`;$('#levelComplete').classList.remove('hidden');sfx.hero()}
function researchPair(){let a=rnd(RESEARCH),others=RESEARCH.filter(x=>x.key!==a.key),b=rnd(others);return[a,b]}
function showResearch(){ $('#levelComplete').classList.add('hidden');if(levelIndex>=LEVELS.length-1){showVictory();return}levelState='research';let choices=researchPair();$('#researchChoices').innerHTML=choices.map((c,i)=>`<button class="researchChoice" data-i="${i}"><b>${c.title}</b><p>${c.body}</p><strong>${c.effect}</strong></button>`).join('');$$('.researchChoice').forEach((b,i)=>b.onpointerdown=()=>chooseResearch(choices[i]));$('#researchScreen').classList.remove('hidden')}
function chooseResearch(choice){$('#researchScreen').classList.add('hidden');research[choice.key]*=1.05;if(choice.key==='keep'){let old=maxKeep;maxKeep*=1.05;keep=Math.min(maxKeep,keep+(maxKeep-old));for(const t of towers){t.maxHp*=1.05;t.hp*=1.05}for(const w of walls){w.maxHp*=1.05;w.hp*=1.05}}for(const u of carryover)applyResearchToUnit(u,choice.key);for(const t of towers)applyResearchToUnit(t,choice.key);for(const w of walls)applyResearchToUnit(w,choice.key);toast(`${choice.title.toUpperCase()} COMPLETED`);levelIndex++;showLevelIntro()}
function applyResearchToUnit(u,key){if(key==='speed'&&u.speed)u.speed*=1.05;if(key==='power'&&u.damage)u.damage*=1.05;if(key==='stamina'&&u.maxHp){u.maxHp*=1.05;u.hp=u.maxHp}}
function researchUnit(u){if(u.speed)u.speed*=research.speed;if(u.damage)u.damage*=research.power;if(u.maxHp){u.maxHp*=research.stamina;u.hp=u.maxHp}return u}
function showVictory(){saveRunScore(true);levelState='victory';$('#researchScreen').classList.add('hidden');$('#victorySummary').textContent=`King ${playerName}'s defenders survived all eight assaults, defeated ${kills} enemies, and preserved ${Math.ceil(keep)} of ${Math.ceil(maxKeep)} Keep integrity.`;$('#victory').classList.remove('hidden');sfx.hero()}
$('#continueResearch').onpointerdown=showResearch;$('#victoryAgain').onpointerdown=()=>{$('#victory').classList.add('hidden');reset();started=true;showLevelIntro()};$('#victoryTitle').onpointerdown=()=>{stopMusic();started=false;$('#victory').classList.add('hidden');$('#title').classList.remove('hidden')};
