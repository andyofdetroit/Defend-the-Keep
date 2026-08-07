
const NATIONS={
 england:{name:'England',banner:['#f3eee1','#b82d2d'],bonus:'Longbow: +10% archer range'},
 france:{name:'France',banner:['#244f9e','#e4c64c'],bonus:'Fortresses: +10% Keep & tower HP'},
 spain:{name:'Spain',banner:['#b52b2b','#e6b83f'],bonus:'Men-at-Arms: +10% melee damage'},
 hre:{name:'Holy Roman Empire',banner:['#e0bd45','#1d1b18'],bonus:'Field Medicine: +15% healing speed'},
 holland:{name:'Holland',banner:['#e77928','#f0eee0'],bonus:'Commerce: +10% organic Royal Purse'},
 russia:{name:'Russia',banner:['#9f2525','#e2c44b'],bonus:'Great Host: free Warrior every 10 deployments'},
 japan:{name:'Japan',banner:['#eee8d9','#b42d31'],bonus:'Bushido: Heroes earned at 3 kills'},
 china:{name:'China',banner:['#b72c2c','#e7c246'],bonus:'Engineers: +20% catapult splash'}
};
function renderNations(){let g=$('#nationGrid');g.innerHTML=Object.entries(NATIONS).map(([k,n])=>`<button class="nationChoice ${k===playerNation?'selected':''}" data-nation="${k}"><span class="miniFlag flag-${k}"></span><b>${n.name}</b><small>${n.bonus}</small></button>`).join('');$$('.nationChoice').forEach(b=>b.onpointerdown=e=>{e.preventDefault();playerNation=b.dataset.nation;$$('.nationChoice').forEach(x=>x.classList.toggle('selected',x===b))})}
function chooseEnemyNation(){let keys=Object.keys(NATIONS).filter(k=>k!==playerNation);enemyNation=rnd(keys)}
function nationBannerDraw(x,y,nation,flip=false,scale=1){
 let f=Math.floor(elapsed*6)%3,tip=[28,34,31][f],notch=[23,27,25][f],wave=[0,3,-2][f];
 ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);ctx.scale(scale,scale);
 ctx.fillStyle='#4a2d18';ctx.fillRect(0,-41,4,44);ctx.fillStyle='#d0a45b';ctx.fillRect(-2,-42,8,5);
 ctx.save();
 ctx.beginPath();ctx.moveTo(4,-37);ctx.lineTo(tip,-34+wave);ctx.lineTo(notch,-27+wave);ctx.lineTo(tip,-19+wave);ctx.lineTo(4,-22);ctx.closePath();ctx.clip();
 // The field and emblem travel with the same fold, so crosses, suns, eagles,
 // stripes, and stars visibly ripple with the cloth instead of floating still.
 ctx.translate([0,2,-1][f],wave*.45);
 if(nation==='england'){ctx.fillStyle='#eee9dc';ctx.fillRect(4,-38,34,22);ctx.fillStyle='#b52b2f';ctx.fillRect(16,-38,6,22);ctx.fillRect(4,-30,34,6)}
 else if(nation==='france'){ctx.fillStyle='#244f9e';ctx.fillRect(4,-38,34,22);ctx.fillStyle='#e4c64c';ctx.fillRect(11,-33,4,4);ctx.fillRect(21,-29,4,4);ctx.fillRect(16,-22,4,4)}
 else if(nation==='spain'){ctx.fillStyle='#a9282c';ctx.fillRect(4,-38,34,22);ctx.fillStyle='#e1b83d';ctx.fillRect(4,-32,34,11);ctx.fillStyle='#8b241f';ctx.fillRect(10,-30,5,7)}
 else if(nation==='hre'){ctx.fillStyle='#dfbd45';ctx.fillRect(4,-38,34,22);ctx.fillStyle='#1c1b18';ctx.fillRect(16,-35,8,16);ctx.fillRect(10,-30,20,6);ctx.fillRect(12,-37,4,5);ctx.fillRect(24,-37,4,5)}
 else if(nation==='holland'){ctx.fillStyle='#e47627';ctx.fillRect(4,-38,34,7);ctx.fillStyle='#eee9dc';ctx.fillRect(4,-31,34,7);ctx.fillStyle='#31558b';ctx.fillRect(4,-24,34,7)}
 else if(nation==='russia'){ctx.fillStyle='#9e2528';ctx.fillRect(4,-38,34,22);ctx.fillStyle='#e1bd43';ctx.fillRect(17,-36,6,18);ctx.fillRect(10,-30,20,6)}
 else if(nation==='japan'){ctx.fillStyle='#eee9dc';ctx.fillRect(4,-38,34,22);ctx.fillStyle='#ad2930';ctx.fillRect(16,-32,10,10)}
 else{ctx.fillStyle='#b62b2d';ctx.fillRect(4,-38,34,22);ctx.fillStyle='#e3bd3d';ctx.fillRect(11,-34,6,6);ctx.fillRect(23,-27,4,4);ctx.fillRect(27,-33,3,3)}
 // Moving fold bands make the cloth visibly ripple instead of merely changing its outline.
 ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(6+f*3,-37,3,20);
 ctx.fillStyle='rgba(0,0,0,.16)';ctx.fillRect(15+f*2,-36,3,19);
 ctx.restore();
 ctx.fillStyle='#f0c76e';ctx.fillRect(1,-38,3,3);ctx.restore()
}

"use strict";
function updateUI(){$('#mana').textContent=Math.floor(mana);$('#hp').textContent=Math.ceil(keep)+'/'+Math.ceil(maxKeep);$('#kills').textContent=kills;$('#time').textContent=fmt(elapsed);$('#deployed').textContent=levelState==='battle'?`${levelSpawned}/${effectiveEnemyCount()}`:deployments;let pct=clamp(keep/maxKeep*100,0,100),fill=$('#keepFill');fill.style.width=pct+'%';fill.style.background=pct>60?'#54b84a':pct>30?'#d3a937':'#cf3d35';$$('.unit').forEach(b=>b.disabled=mana<COST[b.dataset.type])}
function reset(){spawn.seen={};dragonControl=null;herald=null;russiaDeployCount=0;enemyRussiaCount=0;purseSpent=0;heroesForged=0;runHeroArchive=[];runSaved=false;commandMode=null;battleStance='aggressive';mana=4;maxKeep=100;keep=100;levelIndex=0;levelState='title';levelSpawned=0;levelDefeated=0;carryover=[];research={speed:1,power:1,stamina:1,keep:1};kills=0;elapsed=0;deployments=0;ended=false;crumbling=false;crumbleTime=0;faceMood='normal';faceUntil=0;keepHitBurst=0;manaTick=0;spawnTick=0;battleAct=0;battlePause=0;waveCooldown=0;waveNumber=0;battleBanner='';units=[];enemies=[];towers=[];walls=[];shots=[];parts=[];deaths=[];hitStopTimer=0;cameraShake=0;devPaused=false;last=performance.now();select('warrior');updateUI()}
async function askName(){renderNations();await ready();sfx.title();setTimeout(speakTitle,220);toast('DEFEND THE KEEP!');$('#start').disabled=true;setTimeout(()=>{$('#playerName').value=playerName;$('#nameScreen').classList.remove('hidden');$('#start').disabled=false;setTimeout(()=>$('#playerName').focus(),80)},1450)}function begin(){playerName=($('#playerName').value||'Andy').trim().slice(0,18)||'Andy';localStorage.setItem('defendKeepPlayer',playerName);chooseEnemyNation();localStorage.setItem('defendKeepNation',playerNation);$('#nameScreen').classList.add('hidden');reset();if(devPlayerNation&&playerNation==='france'){maxKeep*=1.10;keep=maxKeep}started=true;$('#title').classList.add('hidden');$('#over').classList.add('hidden');showLevelIntro()}
function scoreValue(s){return (s.kills||0)+(s.stage||0)*120+(s.purseSpent||0)*.6+(s.heroes||0)*45}
function archiveHero(u){if(!u||!u.hero)return;let existing=runHeroArchive.find(h=>h.name===u.name);let data={name:u.name,kills:u.kills||0,battles:u.heroBattles||0,story:`${u.name} served King ${playerName} well, survived ${u.heroBattles||0} battle${(u.heroBattles||0)===1?'':'s'}, and slew ${u.kills||0} enemies!`};if(!existing)runHeroArchive.push(data);else Object.assign(existing,data)}
function saveRunScore(victory=false){if(runSaved)return;units.forEach(archiveHero);carryover.forEach(archiveHero);let best=[...runHeroArchive].sort((a,b)=>b.kills-a.kills||b.battles-a.battles)[0]||null;let stage=victory?LEVELS.length:Math.min(LEVELS.length,levelIndex+1),score={player:playerName,nation:playerNation,kills,stage,stageName:victory?'VICTORY':currentLevel().name,purseSpent:Math.floor(purseSpent),heroes:heroesForged,bestHero:best,date:new Date().toLocaleDateString()};score.score=scoreValue(score);let book=JSON.parse(localStorage.getItem('defendKeepScoresV1')||'[]');book.push(score);book.sort((a,b)=>(b.score||scoreValue(b))-(a.score||scoreValue(a)));localStorage.setItem('defendKeepScoresV1',JSON.stringify(book.slice(0,10)));runSaved=true}
function showHall(){let book=JSON.parse(localStorage.getItem('defendKeepScoresV1')||'[]').sort((a,b)=>(b.score||scoreValue(b))-(a.score||scoreValue(a))).slice(0,10);$('#heroList').innerHTML=book.length?book.map((s,i)=>{let n=NATIONS[s.nation]||NATIONS.england,h=s.bestHero;return `<div class="scoreEntry"><div><div class="scoreFlag flag-${s.nation||'england'}"></div></div><div><div class="scoreTitle">${i+1}. KING ${String(s.player||'UNKNOWN').toUpperCase()} OF ${n.name.toUpperCase()}</div><div class="scoreStats"><span>ENEMIES ${s.kills||0}</span><span>STAGE ${s.stageName||s.stage}</span><span>PURSE SPENT ${s.purseSpent||0}</span><span>HEROES ${s.heroes||0}</span></div><div class="scoreStory">${h?h.story:'No Hero survived long enough to enter the royal chronicle.'}</div></div></div>`}).join(''):'<p>No reign has yet been entered into the Royal Records.</p>';$('#hall').classList.remove('hidden')}
$('#start').onpointerdown=askName;$('#howOpen').onpointerdown=()=>$('#howScreen').classList.remove('hidden');$('#howClose').onpointerdown=()=>$('#howScreen').classList.add('hidden');$('#nameGo').onpointerdown=begin;$('#playerName').addEventListener('keydown',e=>{if(e.key==='Enter')begin()});$('#again').onpointerdown=()=>{ready();reset();started=true;$('#over').classList.add('hidden');showLevelIntro()};$('#backTitle').onpointerdown=()=>{stopMusic();started=false;$('#over').classList.add('hidden');$('#title').classList.remove('hidden')};$('#hallOpen').onpointerdown=()=>{ready();showHall()};$('#hallOver').onpointerdown=showHall;$('#hallClose').onpointerdown=()=>$('#hall').classList.add('hidden');let titleSoundDone=false;$('#title').addEventListener('pointerdown',async()=>{if(!titleSoundDone){await ready();sfx.title();setTimeout(speakTitle,160);titleSoundDone=true}},{once:true});
$('#manaStat').onpointerdown=async()=>{await ready();mana+=100;toast('SECRET TREASURY: +100 COINS');sfx.promote();updateUI()};
$('#musicToggle').onpointerdown=()=>{ready();musicOn=!musicOn;$('#musicToggle').classList.toggle('off',!musicOn);$('#musicToggle').textContent=musicOn?'♫':'♪';if(musicOn&&started&&!ended)startMusic();else stopMusic()};
let lastRenderError='',fpsSmooth=60;function loop(now){let dt=Math.min((now-last)/1000,.035);last=now;fpsSmooth=fpsSmooth*.9+(1/Math.max(dt,.001))*.1;devFps=fpsSmooth;try{if(hitStopTimer>0){hitStopTimer=Math.max(0,hitStopTimer-dt);updateJuice(dt*.25)}else if(!devPaused)update(dt);else updateJuice(dt);draw();lastRenderError=''}catch(err){console.error(err);if(String(err)!==lastRenderError){lastRenderError=String(err);toast('DISPLAY ERROR: '+(err.message||'unknown'))}}requestAnimationFrame(loop)}resize();reset();requestAnimationFrame(loop);
