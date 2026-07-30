"use strict";
const juicePrevPos=new WeakMap();
function addParticle(x,y,color,size=3,vx=0,vy=0,life=.45,gravity=100,shape='square'){
 parts.push({x,y,color,size,vx,vy,life,maxLife:life,gravity,shape});
}
function burst(x,y,color,n=5,blood=false){
 for(let i=0;i<n;i++){
  const angle=rand(-Math.PI*.92,-Math.PI*.08),speed=blood?rand(45,125):rand(25,90);
  addParticle(x+rand(-2,2),y+rand(-3,3),color,blood?rand(2,4):rand(2,4),Math.cos(angle)*speed,Math.sin(angle)*speed,rand(.3,.75),blood?145:115,blood?'drop':'square');
 }
 if(parts.length>520)parts.splice(0,parts.length-520);
}
function sparks(x,y,n=5){for(let i=0;i<n;i++)addParticle(x,y,rnd(['#fff1a8','#ffd35a','#f39b32']),rand(1,3),rand(-105,105),rand(-120,15),rand(.16,.38),190,'spark')}
function dust(x,y,n=3,big=false){for(let i=0;i<n;i++)addParticle(x+rand(-7,7),y+rand(-2,3),rnd(['#bca77d','#a9936d','#8f7c5c']),rand(big?4:2,big?8:5),rand(-25,25),rand(-30,-5),rand(.3,.65),35,'dust')}
function debris(x,y,n=7){for(let i=0;i<n;i++)addParticle(x,y,rnd(['#75604c','#9b8870','#b7a283']),rand(3,6),rand(-115,115),rand(-150,-25),rand(.4,.9),210,'debris')}
function shake(amount=4){cameraShake=Math.max(cameraShake,amount)}
function hitStop(seconds=.035){if(devHitStop)hitStopTimer=Math.max(hitStopTimer,seconds)}
function spawnDeath(o,enemy=false){
 if(o.deathSpawned)return;o.deathSpawned=true;
 deaths.push({x:o.x,y:o.y,type:o.type,enemy,hero:o.hero,skin:o.skin,gear:o.gear||[],life:o.dragon?1.35:.72,maxLife:o.dragon?1.35:.72,vx:rand(-16,16),vy:o.dragon?28:rand(8,20),rot:0,spin:rand(-2.2,2.2)});
 if(o.dragon){shake(9);debris(o.x,o.y+15,15);dust(o.x,o.y+22,12,true)} else dust(o.x,o.y+12,4,false);
}
function impactJuice(t,a,d){
 t.flash=.07;t.recoil=.09;
 if(a){a.recoil=.11;const dx=t.x-a.x,dy=t.y-a.y,len=Math.hypot(dx,dy)||1;const force=a.dragon?8:(a.type==='knight'||a.type==='enemyKnight')?5:(a.type==='catapult'||a.type==='enemyCatapult')?9:2.4;if(!t.anchored&&t.type!=='tower'&&t.type!=='enemyTower'){t.x+=dx/len*force;t.y+=dy/len*force}}
 const armored=['knight','enemyKnight','tower','enemyTower','catapult','enemyCatapult'].includes(t.type);
 if(armored)sparks(t.x,t.y-4,Math.ceil(rand(3,7)));else burst(t.x,t.y-4,'#a9162a',Math.ceil(rand(4,9)),true);
 hitStop(d>=15?.055:d>=8?.042:.028);if(d>=15)shake(3.5);
}
function updateJuice(dt){
 cameraShake=Math.max(0,cameraShake-dt*22);
 for(const o of [...units,...enemies,...towers]){if(o.flash>0)o.flash-=dt;if(o.recoil>0)o.recoil-=dt;const prev=juicePrevPos.get(o);if(prev){const moved=Math.hypot(o.x-prev.x,o.y-prev.y);if(moved>.35&&Math.random()<dt*(o.type==='knight'||o.type==='enemyKnight'?15:5))dust(o.x,o.y+13,o.type==='knight'||o.type==='enemyKnight'?2:1,o.type==='knight'||o.type==='enemyKnight')}juicePrevPos.set(o,{x:o.x,y:o.y})}
 for(const d of deaths){d.life-=dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=42*dt;d.rot+=d.spin*dt}
 deaths=deaths.filter(d=>d.life>0);
 if(devInfiniteMana)mana=Math.max(mana,999);
 updateDevPanel();
}
function drawDeath(d){ctx.save();ctx.globalAlpha=clamp(d.life/.25,0,1);ctx.translate(d.x,d.y);ctx.rotate(d.rot);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(-12,8,24,5);if(d.type==='dragon'||d.type==='enemyDragon'){ctx.fillStyle=d.enemy?'#761d24':'#6c2b84';ctx.fillRect(-24,-8,48,19);ctx.fillStyle='#a94438';ctx.fillRect(18,-14,22,14);ctx.fillStyle='#4c235f';ctx.fillRect(-39,-4,18,8)}else if(d.type==='knight'||d.type==='enemyKnight'){ctx.fillStyle='#8b5c35';ctx.fillRect(-18,-4,30,13);ctx.fillStyle=d.enemy?'#7e2e2e':'#315c9d';ctx.fillRect(-4,-13,13,13);ctx.fillStyle='#d8dbe0';ctx.fillRect(10,-9,14,3)}else{ctx.fillStyle=d.hero?'#6d3d94':d.enemy?'#7e2e2e':'#315c9d';ctx.fillRect(-8,-5,17,13);ctx.fillStyle=d.skin||'#e3aa78';ctx.fillRect(-7,-13,12,8);ctx.fillStyle='#d8dbe0';ctx.fillRect(8,-3,14,3)}ctx.restore()}
function drawJuiceOverlays(){
 for(const d of deaths)drawDeath(d);
 for(const o of [...units,...enemies,...towers])if(o.flash>0){ctx.save();ctx.globalAlpha=clamp(o.flash/.07,0,1)*.8;ctx.fillStyle='#fff';ctx.fillRect(o.x-10,o.y-17,20,30);ctx.restore()}
}
function setDevOpen(open){devOpen=open;$('#devPanel').classList.toggle('hidden',!open)}
function updateDevPanel(){if(!devOpen)return;$('#devFps').textContent=Math.round(devFps);$('#devEnemies').textContent=enemies.length;$('#devUnits').textContent=units.length;$('#devParticles').textContent=parts.length;$('#devDeaths').textContent=deaths.length;$('#devPause').textContent=devPaused?'RESUME':'PAUSE';$('#devCoins').classList.toggle('active',devInfiniteMana);$('#devHitStop').classList.toggle('active',devHitStop)}
function spawnDev(type){if(!started||ended)return;if(type==='hero'){const before=deployments;deployments=99;deploy('warrior',W/2,H*.72);deployments=Math.max(before,deployments);return}if(type==='enemyDragon'){const e0=elapsed;elapsed=Math.max(elapsed,331);const old=Math.random;Math.random=()=>0;spawn();Math.random=old;elapsed=e0;return}const map={raider:[18,5,25,20,.82,1],berserker:[34,10,31,20,.62,3],enemyKnight:[32,8.5,46,24,.78,5],enemyCatapult:[17,15,10,185,.20,7]};const b=map[type]||map.raider;enemies.push({id:nextId++,type,x:W/2+rand(-80,80),y:40,hp:b[0],maxHp:b[0],damage:b[1],speed:b[2],range:b[3],rate:b[4],cool:0,reward:b[5],lastHitBy:null,splash:type==='enemyCatapult'?52:0,anim:0})}
window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='q'&&!e.repeat){e.preventDefault();setDevOpen(!devOpen)}if(e.key==='Escape'&&devOpen)setDevOpen(false)});
window.addEventListener('DOMContentLoaded',()=>{
 $('#devClose').onclick=()=>setDevOpen(false);$('#devPause').onclick=()=>{devPaused=!devPaused;updateDevPanel()};$('#devCoins').onclick=()=>{devInfiniteMana=!devInfiniteMana;if(devInfiniteMana)mana=999;updateDevPanel()};$('#devHitStop').onclick=()=>{devHitStop=!devHitStop;updateDevPanel()};$('#devRaider').onclick=()=>spawnDev('raider');$('#devBerserker').onclick=()=>spawnDev('berserker');$('#devKnight').onclick=()=>spawnDev('enemyKnight');$('#devCatapult').onclick=()=>spawnDev('enemyCatapult');$('#devDragon').onclick=()=>spawnDev('enemyDragon');$('#devHero').onclick=()=>spawnDev('hero');$('#devKill').onclick=()=>{for(const e of enemies){e.hp=0;spawnDeath(e,true)}};$('#devKeep').onclick=()=>{keep=Math.max(0,keep-20);shake(8);debris(W/2,H-35,10);react('wince',1);updateUI()};
});
