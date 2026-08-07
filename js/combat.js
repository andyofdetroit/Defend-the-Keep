"use strict";
function spawn(forcedType=null){
 if(levelState!=='battle'||levelSpawned>=effectiveEnemyCount())return;
 let scale=levelEnemyScale(),type=forcedType||campaignEnemyType();
 let base={raider:[18,5,25,20,.82,1],berserker:[34,10,31,20,.62,3],enemyArcher:[11,4,20,115,1.15,2],enemyKnight:[32,8.5,46,24,.78,5],enemyCatapult:[17,15,10,185,.20,7],enemyTower:[42,7,0,155,.65,8],enemyDragon:[95,18,46,70,.8,15]}[type],hp=base[0]*scale;
 if(!spawn.seen)spawn.seen={};if(!spawn.seen[type]&&['enemyTower','enemyKnight','enemyCatapult','enemyDragon'].includes(type)){spawn.seen[type]=true;toast({enemyTower:'ENEMY TOWER DEPLOYED!',enemyKnight:'ENEMY KNIGHTS ARRIVE!',enemyCatapult:'ENEMY CATAPULT SIGHTED!',enemyDragon:'ENEMY DRAGON RAID!'}[type])}
 let roundBoost=Math.pow(1.10,levelIndex);enemies.push({id:nextId++,type,x:rand(22,W-22),y:type==='enemyTower'?rand(35,H*.32):-22,hp,maxHp:hp*roundBoost,damage:base[1]*scale*roundBoost,speed:base[2],range:base[3],rate:base[4]*(1+levelIndex*.025)*roundBoost,cool:rand(0,.5),reward:base[5],lastHitBy:null,splash:type==='enemyCatapult'?52:0,anchored:type==='enemyTower',dragon:type==='enemyDragon',wallAttacking:false,anim:rand(0,1)});
 let ne=enemies.at(-1);
if(devEnemyNation&&enemyNation==='england'&&ne.type==='enemyArcher')ne.range*=1.05;
if(devEnemyNation&&enemyNation==='spain'&&['raider','berserker','enemyKnight'].includes(ne.type))ne.damage*=1.05;
if(devEnemyNation&&enemyNation==='france'&&ne.type==='enemyTower'){ne.hp*=1.05;ne.maxHp*=1.05}
if(devEnemyNation&&enemyNation==='hre'){ne.hp*=1.075;ne.maxHp*=1.075}
if(devEnemyNation&&enemyNation==='japan'&&levelSpawned%10===0){ne.hp*=1.10;ne.maxHp*=1.10;ne.damage*=1.10}
if(devEnemyNation&&enemyNation==='china'&&ne.type==='enemyCatapult')ne.splash*=1.10;
levelSpawned++;
if(devEnemyNation&&enemyNation==='russia'){enemyRussiaCount++;if(enemyRussiaCount%20===0){let save=enemyNation;let bx=rand(22,W-22);let scale2=levelEnemyScale(),b=[18,5,25,20,.82,1],hp2=b[0]*scale2,rb=Math.pow(1.10,levelIndex);enemies.push({id:nextId++,type:'raider',x:bx,y:-28,hp:hp2*rb,maxHp:hp2*rb,damage:b[1]*scale2*rb,speed:b[2],range:b[3],rate:b[4]*(1+levelIndex*.025)*rb,cool:0,reward:b[5],lastHitBy:null,anchored:false,dragon:false,wallAttacking:false,anim:0,bonus:true});toast('RUSSIAN REINFORCEMENTS!')}}
}
function shoot(from,to,damage,enemy=false,kind='arrow',splash=0){
 let d=dist(from,to)||1,sp=kind==='boulder'?145:260;
 shots.push({x:from.x,y:from.y-8,vx:(to.x-from.x)/d*sp,vy:(to.y-from.y)/d*sp,target:to,damage,life:kind==='boulder'?2:1.25,enemy,owner:from,kind,splash});
 if(shots.length>220)shots.splice(0,shots.length-220);
 kind==='boulder'?sfx.rock():sfx.arrow()
}
function damage(t,d,a){if((t.type==='tower'||t.type==='wall')&&t.armor)d*=1-t.armor;let before=t.hp;t.hp-=d;t.lastHitBy=a||null;impactJuice(t,a,d);if(before>0&&t.hp<=0)spawnDeath(t,enemies.includes(t));sfx.hit()}
function heroAura(u){return units.some(h=>h.hero&&h.hp>0&&!h.healing&&h!==u&&dist(h,u)<=92)?1.10:1}
function promote(u){let th=[1,2,5,10,20],next=th[u.level]??20*Math.pow(2,u.level-4);while(u.kills>=next){u.level++;u.damage*=1.05;u.maxHp*=1.05;u.hp=Math.min(u.maxHp,u.hp*1.05+u.maxHp*.05);let avail=GEAR.filter(g=>!u.gear.includes(g));u.gear.push(rnd(avail.length?avail:GEAR));sfx.promote();toast(`${u.hero?u.name:'A veteran'} advanced!<br>${u.kills} kills · ${u.gear.at(-1)}`);next=th[u.level]??20*Math.pow(2,u.level-4)}}
function heroPortrait(u){let skin=u.skin||'#e3aa78',helmet=u.gear.includes('helmet')||u.gear.includes('plume'),cape=u.gear.includes('cape'),boots=u.gear.includes('boots'),medal=u.gear.includes('medal');let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" shape-rendering="crispEdges"><rect width="72" height="72" fill="#18301d"/><rect x="4" y="4" width="64" height="64" fill="#78925b"/><rect x="20" y="37" width="32" height="25" fill="#6d3d94"/>${cape?'<rect x="13" y="39" width="9" height="25" fill="#b62933"/>':''}<rect x="24" y="20" width="24" height="20" fill="${skin}"/><rect x="22" y="16" width="28" height="7" fill="${helmet?'#d8bf67':'#4f276f'}"/>${u.gear.includes('plume')?'<rect x="33" y="7" width="7" height="11" fill="#e74848"/>':''}<rect x="27" y="28" width="5" height="4" fill="#20130d"/><rect x="40" y="28" width="5" height="4" fill="#20130d"/><rect x="51" y="30" width="5" height="30" fill="${u.gear.includes('jeweled weapon')?'#7eeaff':'#d8dbe0'}"/>${medal?'<rect x="34" y="42" width="6" height="6" fill="#ffe36d"/>':''}${boots?'<rect x="20" y="60" width="13" height="6" fill="#d2aa45"/><rect x="40" y="60" width="13" height="6" fill="#d2aa45"/>':''}</svg>`;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function record(u,cause='the northern horde'){if(!u.hero||u.recorded)return;u.recorded=true;let alive=Math.max(0,elapsed-u.born),gear=u.gear.length?u.gear.join(', '):'plain armor',story=u.kills===0?`${u.name} entered battle with tremendous confidence and was almost immediately defeated by ${cause}.`:u.kills<10?`${u.name} defended the Keep for ${fmt(alive)}, slew ${u.kills} foes, and fell to ${cause} before earning lasting glory.`:`${u.name} defended the Keep for ${fmt(alive)}. Wearing ${gear}, ${u.name} slew ${u.kills} enemies before falling to ${cause}.`;story+=` ${u.name} proudly served King ${playerName}.`;let portrait=heroPortrait(u),book=JSON.parse(localStorage.getItem('defendKeepHeroesV02')||'[]');book.push({name:u.name,kills:u.kills,story,date:new Date().toLocaleDateString(),portrait,king:playerName});book.sort((a,b)=>(b.kills||0)-(a.kills||0));localStorage.setItem('defendKeepHeroesV02',JSON.stringify(book.slice(0,10)))}
function update(dt){if(ended||!started||levelState!=='battle')return;if(crumbling){crumbleTime+=dt;for(let i=0;i<Math.ceil(dt*45);i++)burst(rand(0,W),H-rand(12,55),'#766657',rand(2,5));if(crumbleTime>1.8){crumbling=false;ended=true;sfx.over();$('#summary').textContent=`You held for ${fmt(elapsed)}, defeated ${kills} enemies, and deployed ${deployments} defenders.`;$('#over').classList.remove('hidden')}return}elapsed+=dt;manaTick+=dt;let purseInterval=devPlayerNation&&playerNation==='holland'?4/1.10:4;while(manaTick>=purseInterval){mana++;manaTick-=purseInterval;sfx.mana()}updateBattleDirector(dt)
for(const w of walls){w.gateOpen=Math.max(0,(w.gateOpen||0)-dt);if(units.some(u=>u.hp>0&&Math.abs(u.x-w.x)<18&&Math.abs(u.y-w.y)<28))w.gateOpen=.35}
for(const u of units){u.cool-=dt;u.anim+=dt;if(u.commandHold>0)u.commandHold-=dt;if(u.entering){u.y-=u.speed*.55*dt;if(u.y<=H-58){u.y=H-58;u.entering=false;burst(u.x,u.y,'#ffe08a',5)}continue}
 if(u.type==='carpenter'){
  if(u.phase==='walking'){let tx=W/2,ty=H-47,d=Math.hypot(tx-u.x,ty-u.y);if(d>3){u.x+=(tx-u.x)/d*u.speed*dt;u.y+=(ty-u.y)/d*u.speed*dt}else{u.phase='working';u.work=0}}
  else if(u.phase==='working'){u.work+=dt;if(Math.random()<dt*3)sfx.sword();if(u.work>=2.2){keep=Math.min(maxKeep,keep+5);u.phase='leaving';toast('THE CARPENTER REPAIRED 5 KEEP HEALTH');sfx.promote()}}
  else{u.y+=u.speed*dt;if(u.y>H+25)u.done=true}
  continue
 }
 if(u.dragon){u.controlTime=(u.controlTime??9)-dt;let controlled=dragonControl===u&&u.controlTime>0;if(controlled){let dx=(dragonKeys.right?1:0)-(dragonKeys.left?1:0),dy=(dragonKeys.down?1:0)-(dragonKeys.up?1:0);if(dx||dy){u.facingAngle=Math.atan2(dy,dx);u.facingX=dx;u.facingY=dy}u.x=clamp(u.x+dx*u.speed*1.55*dt,28,W-28);u.y=clamp(u.y+dy*u.speed*1.55*dt,45,H-62)}else{if(dragonControl===u)dragonControl=null;u.facingAngle=-Math.PI/2;u.facingX=0;u.facingY=-1;u.y-=u.speed*1.6*dt}u.breathing=Math.floor(elapsed*5)%2===0;if(u.cool<=0){let victims=enemies.filter(e=>dist(e,u)<=u.range);victims.forEach(e=>damage(e,u.damage,u));burst(u.x,u.y,'#ff7b22',20);sfx.fire();u.cool=1/u.rate}continue}
 if(!u.retreating&&!u.healing&&u.hp<=u.maxHp*.1){u.retreating=true;u.target=null;toast(`${u.hero?u.name:'A veteran'} is retreating!`)}
 if(u.retreating){let home=H-49,d=Math.abs(home-u.y);u.y+=Math.sign(home-u.y)*u.speed*1.35*dt;if(d<4){u.retreating=false;u.healing=true;u.y=home;u.healerX=W/2;u.healerY=H+18;u.healerReady=false}continue}
 if(u.healing){let hx=u.x,hy=u.y+20,hd=Math.hypot(hx-(u.healerX??W/2),hy-(u.healerY??H+18));if(hd>3){u.healerX+=(hx-u.healerX)/hd*42*dt;u.healerY+=(hy-u.healerY)/hd*42*dt}else u.healerReady=true;u.hp=Math.min(u.maxHp,u.hp+u.maxHp*(u.healerReady?.075:.018)*dt*(devPlayerNation&&playerNation==='hre'?1.15:1));if(Math.random()<dt*.4)sfx.heal();if(u.hp>=u.maxHp){u.healing=false;u.wander=rand(.1,.8);burst(u.x,u.y,'#8ef08a',7);toast(`${u.hero?u.name:'A soldier'} returns to battle!`)}continue}
 if(u.commandTarget){let cd=Math.hypot(u.commandTarget.x-u.x,u.commandTarget.y-u.y);if(cd>5){u.x+=(u.commandTarget.x-u.x)/cd*u.speed*dt;u.y+=(u.commandTarget.y-u.y)/cd*u.speed*dt;continue}else if(u.commandHold>0)continue;else u.commandTarget=null}
 let forced=(u.forcedTarget&&u.forcedTarget.hp>0&&u.commandHold>0)?u.forcedTarget:null;
 const armyStillArriving=levelSpawned<currentLevel().count;
 const holdY=battleStance==='defensive'?H*.67:Math.max(100,H*.34);
 const rangedEnemy=e=>['enemyArcher','enemyCatapult','enemyTower'].includes(e.type);
 let target=forced;
 if(!target){
  if(u.type==='catapult')target=nearest(u,enemies,Infinity);
  else if(['archer','fireArcher'].includes(u.type))target=nearest(u,enemies,u.range);
  else if(armyStillArriving){
   let nearby=nearest(u,enemies,battleStance==='defensive'?48:62);
   let rangedAhead=enemies.filter(e=>e.hp>0&&rangedEnemy(e)&&e.y<=u.y+145);
   target=nearby||nearest(u,rangedAhead,battleStance==='defensive'?95:165);
  }else target=nearest(u,enemies,Infinity);
 }
 if(!target){
  let phase=(elapsed*.65+u.id*.7),tx=W/2+Math.sin(phase)*Math.min(W*.28,190),ty=holdY+Math.sin(phase*2)*34,dd=Math.hypot(tx-u.x,ty-u.y);
  if(dd>3){u.x+=(tx-u.x)/dd*u.speed*.38*dt;u.y+=(ty-u.y)/dd*u.speed*.38*dt}else u.y=ty;
  continue
 }
 let d=dist(u,target);
 if(d<=u.range){if(u.cool<=0){
 let aura=heroAura(u);if(u.type==='archer')shoot(u,target,u.damage*aura);
 else if(u.type==='fireArcher')shoot(u,target,u.damage*aura,false,'fire',u.splash||24);
 else if(u.type==='catapult'){let aim={x:target.x,y:target.y+target.speed*.55,hp:1,maxHp:1};shoot(u,aim,u.damage*aura,false,'boulder',u.splash);shots.at(-1).impactTarget=target;}
 else{let md=u.damage*aura;if(u.type==='knight'&&['enemyArcher'].includes(target.type))md*=1.5;damage(target,md,u);sfx.sword()}
 u.cool=1/u.rate
}}
 else{u.x+=(target.x-u.x)/d*u.speed*dt;u.y+=(target.y-u.y)/d*u.speed*dt}

}
for(const t of towers){t.cool-=dt;let target=nearest(t,enemies,t.range);if(target&&t.cool<=0){let aura=heroAura(t);shoot(t,target,t.damage*aura);t.cool=1/(t.rate*aura)}}
for(const e of enemies){e.cool-=dt;e.anim=(e.anim||0)+dt;
 if(e.burning>0){e.burning-=dt;e.hp-=e.burnDps*dt;e.lastHitBy=e.burnOwner||e.lastHitBy;if(Math.random()<dt*2.5)burst(e.x+rand(-5,5),e.y+rand(-10,5),'#ff8b22',1)}if(e.dragon){e.y+=e.speed*dt;if(e.cool<=0){let victims=[...units,...towers,...walls].filter(v=>v.hp>0&&Math.abs(v.y-e.y)<e.range);victims.forEach(v=>damage(v,e.damage,e));burst(e.x,e.y+28,'#ff6b1e',20);sfx.fire();e.cool=1/e.rate}if(e.y>H-38){let dealt=e.damage*dt*.175;keep-=dealt;keepHitBurst+=dealt;}if(keepHitBurst>4){react('wince',1);keepHitBurst=0}continue}let liveTowers=towers.filter(t=>t.hp>0),liveWalls=walls.filter(w=>w.hp>0),troopTargets=units.filter(u=>!u.healing&&u.hp>0&&!u.dragon&&u.type!=='carpenter'),ranged=['enemyArcher','enemyCatapult','enemyTower'].includes(e.type),engageRange=ranged?e.range:46,nearTroop=nearest(e,troopTargets,engageRange);
 let blockingWall=null;
 for(const w of liveWalls){
  if(e.y<w.y+30&&e.y>w.y-75&&Math.abs(e.x-w.x)<w.width/2+10){blockingWall=w;break}
 }
 let target=nearTroop;
 if(!target&&blockingWall){
  let leftGap=blockingWall.x-blockingWall.width/2,rightGap=blockingWall.x+blockingWall.width/2;
  let canLeft=leftGap>24,canRight=rightGap<W-24;
  let chainCoverage=liveWalls.filter(w=>Math.abs(w.y-blockingWall.y)<24).reduce((a,w)=>a+w.width,0);
  if(chainCoverage>W*.55||(!canLeft&&!canRight)||Math.abs(e.y-blockingWall.y)<30)target=blockingWall;
  else{
   let tx=canLeft&&canRight?(Math.abs(e.x-leftGap)<Math.abs(e.x-rightGap)?leftGap-14:rightGap+14):(canLeft?leftGap-14:rightGap+14);
   e.x+=Math.sign(tx-e.x)*e.speed*.75*dt;
  }
 }
 if(!target)target=liveTowers.length?nearest(e,liveTowers,e.range):nearest(e,troopTargets,e.range);
 if(target){
  let td=dist(e,target),isRanged=['enemyArcher','enemyCatapult','enemyTower'].includes(e.type);
  if(target.type==='wall'&&!isRanged&&td>e.range+8){
   let tx=clamp(e.x,target.x-target.width/2+8,target.x+target.width/2-8),ty=target.y-18,dd=Math.hypot(tx-e.x,ty-e.y)||1;
   e.x+=(tx-e.x)/dd*e.speed*dt;e.y+=(ty-e.y)/dd*e.speed*dt;e.wallAttacking=false;continue
  }
  if(e.wallAttacking&&target.type!=='wall'){e.wallAttacking=false;e.cool=Math.max(e.cool,.20)}
  if(target.type==='wall'&&!isRanged)e.wallAttacking=true;
  if(e.cool<=0){if(['enemyArcher','enemyTower'].includes(e.type))shoot(e,target,e.damage,true);else if(e.type==='enemyCatapult')shoot(e,target,e.damage*(target.type==='wall'||target.type==='tower'?1.5:1),true,'boulder',e.splash);else{let ed=e.damage;if(e.type==='enemyKnight'&&['archer','fireArcher'].includes(target.type))ed*=1.5;damage(target,ed,e);sfx.sword()}e.cool=1/e.rate}
 }else if(!e.anchored){
  const ranged=['enemyArcher','enemyCatapult'].includes(e.type),wallY=ranged?H-135:H-49;
  if(e.y<wallY){e.y=Math.min(wallY,e.y+e.speed*dt);e.wallAttacking=false}
  else{e.y=wallY;e.wallAttacking=true;if(e.cool<=0){let mult=e.type==='berserker'?1.25:e.type==='enemyCatapult'?1.5:1;let dealt=e.damage*mult*.5;keep-=dealt;keepHitBurst+=dealt;stoneImpact(e.x,H-38,e.type==='enemyCatapult'?10:5);shake(e.type==='enemyCatapult'?7:2.5);hitStop(e.type==='enemyCatapult'?.055:.025);react('wince',1);e.cool=1/e.rate}}
 }
}
for(const p of shots){
 p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
 if(p.target&&p.target.hp>0&&dist(p,p.target)<15){
  if(p.kind==='boulder'){
   let victims=p.enemy?[...units,...towers,...walls]:enemies,impact=p.impactTarget&&p.impactTarget.hp>0?p.impactTarget:p.target;
   for(const v of victims)if(v.hp>0&&dist(v,impact)<=p.splash)damage(v,p.damage,p.owner);
   debris(impact.x,impact.y,14);dust(impact.x,impact.y+8,10,true);shake(8);hitStop(.065);sfx.rock()
  }else if(p.kind==='fire'){
   let impact=p.target,victims=enemies.filter(v=>v.hp>0&&dist(v,impact)<=p.splash);
   for(const v of victims){damage(v,p.damage,p.owner);v.burning=Math.max(v.burning||0,3);v.burnDps=Math.max(v.burnDps||0,1.2);v.burnOwner=p.owner}
   burst(impact.x,impact.y,'#ff8b22',10);sfx.fire()
  }else damage(p.target,p.damage,p.owner);
  p.life=0
 }else if(p.kind==='boulder'&&p.life<=0){
  let victims=p.enemy?[...units,...towers,...walls]:enemies,impact=p.impactTarget&&p.impactTarget.hp>0?p.impactTarget:p;
  for(const v of victims)if(v.hp>0&&dist(v,impact)<=p.splash)damage(v,p.damage,p.owner);
  debris(impact.x,impact.y,14);dust(impact.x,impact.y+8,10,true);shake(8);hitStop(.065);sfx.rock()
 }
}
for(const e of enemies)if(e.hp<=0&&!e.dead){spawnDeath(e,true);e.dead=true;if(e.lastHitBy&&units.includes(e.lastHitBy)){e.lastHitBy.kills++;promote(e.lastHitBy);if(!e.lastHitBy.hero&&e.lastHitBy.kills>=(devPlayerNation&&playerNation==='japan'?3:4)&&!e.lastHitBy.dragon&&e.lastHitBy.type!=='carpenter')heroize(e.lastHitBy)}kills++;levelDefeated++;mana+=e.reward;react('smile',.7);burst(e.x,e.y,'#9d1d24',10,true);sfx.death()}
for(const u of units)if(u.hp<=0&&!u.dead){spawnDeath(u,false);u.dead=true;record(u,u.lastHitBy?.type==='enemyArcher'?'an enemy archer':'the northern horde');archiveHero(u);sfx.death()}
units=units.filter(u=>!u.dead&&!u.done&&(!u.dragon||u.y>-80));for(const t of towers)if(t.hp<=0&&!t.deathSpawned){spawnDeath(t,false);debris(t.x,t.y,12);shake(6)}towers=towers.filter(t=>t.hp>0);for(const w of walls)if(w.hp<=0&&!w.deathSpawned){w.deathSpawned=true;debris(w.x,w.y,16);shake(5)}walls=walls.filter(w=>w.hp>0);enemies=enemies.filter(e=>!e.dead&&e.y<H+30);shots=shots.filter(p=>p.life>0);for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.gravity??100)*dt;p.life-=dt}parts=parts.filter(p=>p.life>0);if(parts.length>360)parts.splice(0,parts.length-360);
updateJuice(dt);if(levelFinished())finishLevel();if(keep<=0&&!crumbling){keep=0;crumbling=true;crumbleTime=0;units.forEach(u=>record(u,'the fall of the Keep'));saveRunScore(false);stopMusic();sfx.crumble()}updateUI()}
