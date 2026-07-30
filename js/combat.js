"use strict";
function spawn(){
 let scale=1+elapsed/75,r=Math.random(),type='raider';
 if(elapsed>330&&r<.012)type='enemyDragon';
 else if(elapsed>260&&r<.035)type='enemyCatapult';
 else if(elapsed>210&&r<.08)type='enemyKnight';
 else if(elapsed>170&&r<.105)type='enemyTower';
 else if(elapsed>22&&r<Math.min(.18+elapsed/1200,.29))type='enemyArcher';
 else if(r<Math.min(.30+elapsed/900,.43))type='berserker';
 let base={raider:[18,5,25,20,.82,1],berserker:[34,10,31,20,.62,3],enemyArcher:[11,4,20,115,1.15,2],enemyKnight:[32,8.5,46,24,.78,5],enemyCatapult:[17,15,10,185,.20,7],enemyTower:[42,7,0,155,.65,8],enemyDragon:[95,18,46,70,.8,15]}[type],hp=base[0]*scale;
 if(!spawn.seen)spawn.seen={};if(!spawn.seen[type]&&['enemyTower','enemyKnight','enemyCatapult','enemyDragon'].includes(type)){spawn.seen[type]=true;toast({enemyTower:'ENEMY TOWER DEPLOYED!',enemyKnight:'ENEMY KNIGHTS ARRIVE!',enemyCatapult:'ENEMY CATAPULT SIGHTED!',enemyDragon:'ENEMY DRAGON RAID!'}[type])}
 enemies.push({id:nextId++,type,x:rand(22,W-22),y:type==='enemyTower'?rand(35,H*.32):-22,hp,maxHp:hp,damage:base[1]*Math.min(scale,2.8),speed:base[2]*(1+elapsed/900),range:base[3],rate:base[4],cool:rand(0,.5),reward:base[5],lastHitBy:null,splash:type==='enemyCatapult'?52:0,anchored:type==='enemyTower',dragon:type==='enemyDragon'});
}
function shoot(from,to,damage,enemy=false,kind='arrow',splash=0){
 let d=dist(from,to)||1,sp=kind==='boulder'?145:260;
 shots.push({x:from.x,y:from.y-8,vx:(to.x-from.x)/d*sp,vy:(to.y-from.y)/d*sp,target:to,damage,life:kind==='boulder'?2:1.25,enemy,owner:from,kind,splash});
 if(shots.length>220)shots.splice(0,shots.length-220);
 kind==='boulder'?sfx.rock():sfx.arrow()
}
function damage(t,d,a){let before=t.hp;t.hp-=d;t.lastHitBy=a||null;impactJuice(t,a,d);if(before>0&&t.hp<=0)spawnDeath(t,enemies.includes(t));sfx.hit()}
function promote(u){let th=[1,2,5,10,20],next=th[u.level]??20*Math.pow(2,u.level-4);while(u.kills>=next){u.level++;u.damage*=1.05;u.maxHp*=1.05;u.hp=Math.min(u.maxHp,u.hp*1.05+u.maxHp*.05);let avail=GEAR.filter(g=>!u.gear.includes(g));u.gear.push(rnd(avail.length?avail:GEAR));sfx.promote();toast(`${u.hero?u.name:'A veteran'} advanced!<br>${u.kills} kills · ${u.gear.at(-1)}`);next=th[u.level]??20*Math.pow(2,u.level-4)}}
function heroPortrait(u){let skin=u.skin||'#e3aa78',helmet=u.gear.includes('helmet')||u.gear.includes('plume'),cape=u.gear.includes('cape'),boots=u.gear.includes('boots'),medal=u.gear.includes('medal');let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" shape-rendering="crispEdges"><rect width="72" height="72" fill="#18301d"/><rect x="4" y="4" width="64" height="64" fill="#78925b"/><rect x="20" y="37" width="32" height="25" fill="#6d3d94"/>${cape?'<rect x="13" y="39" width="9" height="25" fill="#b62933"/>':''}<rect x="24" y="20" width="24" height="20" fill="${skin}"/><rect x="22" y="16" width="28" height="7" fill="${helmet?'#d8bf67':'#4f276f'}"/>${u.gear.includes('plume')?'<rect x="33" y="7" width="7" height="11" fill="#e74848"/>':''}<rect x="27" y="28" width="5" height="4" fill="#20130d"/><rect x="40" y="28" width="5" height="4" fill="#20130d"/><rect x="51" y="30" width="5" height="30" fill="${u.gear.includes('jeweled weapon')?'#7eeaff':'#d8dbe0'}"/>${medal?'<rect x="34" y="42" width="6" height="6" fill="#ffe36d"/>':''}${boots?'<rect x="20" y="60" width="13" height="6" fill="#d2aa45"/><rect x="40" y="60" width="13" height="6" fill="#d2aa45"/>':''}</svg>`;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function record(u,cause='the northern horde'){if(!u.hero||u.recorded)return;u.recorded=true;let alive=Math.max(0,elapsed-u.born),gear=u.gear.length?u.gear.join(', '):'plain armor',story=u.kills===0?`${u.name} entered battle with tremendous confidence and was almost immediately defeated by ${cause}.`:u.kills<10?`${u.name} defended the Keep for ${fmt(alive)}, slew ${u.kills} foes, and fell to ${cause} before earning lasting glory.`:`${u.name} defended the Keep for ${fmt(alive)}. Wearing ${gear}, ${u.name} slew ${u.kills} enemies before falling to ${cause}.`;story+=` ${u.name} proudly served King ${playerName}.`;let portrait=heroPortrait(u),book=JSON.parse(localStorage.getItem('defendKeepHeroesV02')||'[]');book.push({name:u.name,kills:u.kills,story,date:new Date().toLocaleDateString(),portrait,king:playerName});book.sort((a,b)=>(b.kills||0)-(a.kills||0));localStorage.setItem('defendKeepHeroesV02',JSON.stringify(book.slice(0,10)))}
function update(dt){if(ended||!started)return;if(crumbling){crumbleTime+=dt;for(let i=0;i<Math.ceil(dt*45);i++)burst(rand(0,W),H-rand(12,55),'#766657',rand(2,5));if(crumbleTime>1.8){crumbling=false;ended=true;sfx.over();$('#summary').textContent=`You held for ${fmt(elapsed)}, defeated ${kills} enemies, and deployed ${deployments} defenders.`;$('#over').classList.remove('hidden')}return}elapsed+=dt;manaTick+=dt;while(manaTick>=2){mana++;manaTick-=2;sfx.mana()}let interval=Math.max(.38,1.75-elapsed/110);spawnTick+=dt;while(spawnTick>=interval){spawn();spawnTick-=interval;if(elapsed>65&&Math.random()<Math.min((elapsed-65)/500,.28))spawn()}
for(const u of units){u.cool-=dt;u.anim+=dt;if(u.commandHold>0)u.commandHold-=dt;
 if(u.type==='carpenter'){
  if(u.phase==='walking'){let tx=W/2,ty=H-47,d=Math.hypot(tx-u.x,ty-u.y);if(d>3){u.x+=(tx-u.x)/d*u.speed*dt;u.y+=(ty-u.y)/d*u.speed*dt}else{u.phase='working';u.work=0}}
  else if(u.phase==='working'){u.work+=dt;if(Math.random()<dt*3)sfx.sword();if(u.work>=2.2){keep=Math.min(100,keep+5);u.phase='leaving';toast('THE CARPENTER REPAIRED 5 KEEP HEALTH');sfx.promote()}}
  else{u.y+=u.speed*dt;if(u.y>H+25)u.done=true}
  continue
 }
 if(u.dragon){u.y-=u.speed*dt;u.breathing=Math.floor(elapsed*5)%2===0;if(u.cool<=0){let victims=enemies.filter(e=>Math.abs(e.y-u.y)<u.range);victims.forEach(e=>damage(e,u.damage,u));burst(u.x,u.y-35,'#ff7b22',20);sfx.fire();u.cool=1/u.rate}continue}
 if(!u.retreating&&!u.healing&&u.hp<=u.maxHp*.1){u.retreating=true;u.target=null;toast(`${u.hero?u.name:'A veteran'} is retreating!`)}
 if(u.retreating){let home=H-49,d=Math.abs(home-u.y);u.y+=Math.sign(home-u.y)*u.speed*1.35*dt;if(d<4){u.retreating=false;u.healing=true;u.y=home;u.healerX=W/2;u.healerY=H+18;u.healerReady=false}continue}
 if(u.healing){let hx=u.x,hy=u.y+20,hd=Math.hypot(hx-(u.healerX??W/2),hy-(u.healerY??H+18));if(hd>3){u.healerX+=(hx-u.healerX)/hd*42*dt;u.healerY+=(hy-u.healerY)/hd*42*dt}else u.healerReady=true;u.hp=Math.min(u.maxHp,u.hp+u.maxHp*(u.healerReady?.075:.018)*dt);if(Math.random()<dt*.4)sfx.heal();if(u.hp>=u.maxHp){u.healing=false;u.wander=rand(.1,.8);burst(u.x,u.y,'#8ef08a',7);toast(`${u.hero?u.name:'A soldier'} returns to battle!`)}continue}
 if(u.commandTarget){let cd=Math.hypot(u.commandTarget.x-u.x,u.commandTarget.y-u.y);if(cd>5){u.x+=(u.commandTarget.x-u.x)/cd*u.speed*dt;u.y+=(u.commandTarget.y-u.y)/cd*u.speed*dt;continue}else if(u.commandHold>0)continue;else u.commandTarget=null}
 let target=(u.forcedTarget&&u.forcedTarget.hp>0&&u.commandHold>0)?u.forcedTarget:(u.type==='catapult'?nearest(u,enemies,Infinity):nearest(u,enemies,(u.type==='archer'||u.type==='fireArcher')?u.range:Infinity));if(!target){u.y-=u.speed*dt*.35;continue}let d=dist(u,target);
 if(d<=u.range){if(u.cool<=0){
 if(u.type==='archer')shoot(u,target,u.damage);
 else if(u.type==='fireArcher')shoot(u,target,u.damage,false,'fire',u.splash||24);
 else if(u.type==='catapult'){let aim={x:target.x,y:target.y+target.speed*.55,hp:1,maxHp:1};shoot(u,aim,u.damage,false,'boulder',u.splash);shots.at(-1).impactTarget=target;}
 else{damage(target,u.damage,u);sfx.sword()}
 u.cool=1/u.rate
}}
 else{u.x+=(target.x-u.x)/d*u.speed*dt;u.y+=(target.y-u.y)/d*u.speed*dt}

}
for(const t of towers){t.cool-=dt;let target=nearest(t,enemies,t.range);if(target&&t.cool<=0){shoot(t,target,t.damage);t.cool=1/t.rate}}
for(const e of enemies){e.cool-=dt;
 if(e.burning>0){e.burning-=dt;e.hp-=e.burnDps*dt;e.lastHitBy=e.burnOwner||e.lastHitBy;if(Math.random()<dt*2.5)burst(e.x+rand(-5,5),e.y+rand(-10,5),'#ff8b22',1)}if(e.dragon){e.y+=e.speed*dt;if(e.cool<=0){let victims=[...units,...towers].filter(v=>v.hp>0&&Math.abs(v.y-e.y)<e.range);victims.forEach(v=>damage(v,e.damage,e));burst(e.x,e.y+28,'#ff6b1e',20);sfx.fire();e.cool=1/e.rate}if(e.y>H-38)keep-=e.damage*dt*.35;keepHitBurst+=e.damage*dt*.35;if(keepHitBurst>4){react('wince',1);keepHitBurst=0}continue}let targets=[...units.filter(u=>!u.healing&&u.hp>0),...towers.filter(t=>t.hp>0)],target=nearest(e,targets,e.range);
 if(target&&e.cool<=0){if(['enemyArcher','enemyTower'].includes(e.type))shoot(e,target,e.damage,true);else if(e.type==='enemyCatapult')shoot(e,target,e.damage,true,'boulder',e.splash);else{damage(target,e.damage,e);sfx.sword()}e.cool=1/e.rate}
 else if(!e.anchored){e.y+=e.speed*dt;if(e.y>H-38){keep-=e.damage*dt*.75;keepHitBurst+=e.damage*dt*.75;if(keepHitBurst>4){react('wince',1);keepHitBurst=0}if(Math.random()<dt*8)burst(e.x,H-25,'#9d1d24',2,true)}}
}
for(const p of shots){
 p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
 if(p.target&&p.target.hp>0&&dist(p,p.target)<15){
  if(p.kind==='boulder'){
   let victims=p.enemy?[...units,...towers]:enemies,impact=p.impactTarget&&p.impactTarget.hp>0?p.impactTarget:p.target;
   for(const v of victims)if(v.hp>0&&dist(v,impact)<=p.splash)damage(v,p.damage,p.owner);
   debris(impact.x,impact.y,14);dust(impact.x,impact.y+8,10,true);shake(8);hitStop(.065);sfx.rock()
  }else if(p.kind==='fire'){
   let impact=p.target,victims=enemies.filter(v=>v.hp>0&&dist(v,impact)<=p.splash);
   for(const v of victims){damage(v,p.damage,p.owner);v.burning=Math.max(v.burning||0,3);v.burnDps=Math.max(v.burnDps||0,1.2);v.burnOwner=p.owner}
   burst(impact.x,impact.y,'#ff8b22',10);sfx.fire()
  }else damage(p.target,p.damage,p.owner);
  p.life=0
 }else if(p.kind==='boulder'&&p.life<=0){
  let victims=p.enemy?[...units,...towers]:enemies,impact=p.impactTarget&&p.impactTarget.hp>0?p.impactTarget:p;
  for(const v of victims)if(v.hp>0&&dist(v,impact)<=p.splash)damage(v,p.damage,p.owner);
  debris(impact.x,impact.y,14);dust(impact.x,impact.y+8,10,true);shake(8);hitStop(.065);sfx.rock()
 }
}
for(const e of enemies)if(e.hp<=0&&!e.dead){spawnDeath(e,true);e.dead=true;if(e.lastHitBy&&units.includes(e.lastHitBy)){e.lastHitBy.kills++;promote(e.lastHitBy)}kills++;mana+=e.reward;react('smile',.7);burst(e.x,e.y,'#9d1d24',10,true);sfx.death()}
for(const u of units)if(u.hp<=0&&!u.dead){spawnDeath(u,false);u.dead=true;record(u,u.lastHitBy?.type==='enemyArcher'?'an enemy archer':'the northern horde');sfx.death()}
units=units.filter(u=>!u.dead&&!u.done&&(!u.dragon||u.y>-80));for(const t of towers)if(t.hp<=0&&!t.deathSpawned){spawnDeath(t,false);debris(t.x,t.y,12);shake(6)}towers=towers.filter(t=>t.hp>0);enemies=enemies.filter(e=>!e.dead&&e.y<H+30);shots=shots.filter(p=>p.life>0);for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.gravity??100)*dt;p.life-=dt}parts=parts.filter(p=>p.life>0);if(parts.length>360)parts.splice(0,parts.length-360);
updateJuice(dt);if(keep<=0&&!crumbling){keep=0;crumbling=true;crumbleTime=0;units.forEach(u=>record(u,'the fall of the Keep'));stopMusic();sfx.crumble()}updateUI()}
