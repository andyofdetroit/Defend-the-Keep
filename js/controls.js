const dragonKeys={left:false,right:false,up:false,down:false};
"use strict";
function resize(){let r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);canvas.width=r.width*dpr;canvas.height=r.height*dpr;W=r.width;H=r.height;ctx.setTransform(dpr,0,0,dpr,0,0)}window.addEventListener('resize',resize);
function select(t){selected=t;commandMode=null;$$('.unit').forEach(b=>b.classList.toggle('selected',b.dataset.type===t));$$('.strategy').forEach(b=>b.classList.remove('selected'))}
function chooseCommand(c){if(c==='retreatInjured'){retreatInjuredTroops();return}commandMode=c;$$('.strategy').forEach(b=>b.classList.toggle('selected',b.dataset.command===c));$$('.unit').forEach(b=>b.classList.remove('selected'));toast({formation:'FORMATION: tap near your troops',fallback:'FALL BACK: tap near your troops',help:'HELP: tap near a threatened area'}[c])}
function retreatInjuredTroops(){let wounded=units.filter(u=>!u.dragon&&u.type!=='carpenter'&&u.hp>0&&u.hp<u.maxHp&&!u.healing);wounded.forEach(u=>{u.retreating=true;u.commandTarget=null;u.forcedTarget=null;u.commandHold=0});toast(wounded.length?`${wounded.length} WOUNDED TROOPS RETREAT TO THE WALL!`:'NO WOUNDED TROOPS TO RETREAT');sfx.horn();commandMode=null;$$('.strategy').forEach(b=>b.classList.remove('selected'))}
$$('.unit').forEach(b=>b.onpointerdown=e=>{e.preventDefault();ready();select(b.dataset.type)});
$$('.strategy[data-command]').forEach(b=>b.onpointerdown=e=>{e.preventDefault();ready();chooseCommand(b.dataset.command)});
function fmt(s){return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`}
function burst(x,y,color,n=5,blood=false){for(let i=0;i<n;i++)parts.push({x,y,vx:rand(-60,60),vy:rand(-85,20),life:rand(.25,.65),color,size:blood?rand(2,4):3})}
function nearest(from,list,max=Infinity){let best=null,bd=max;for(const o of list){if(o.hp<=0)continue;let d=dist(from,o);if(d<bd){best=o;bd=d}}return best}
function toast(msg){let e=$('#hudUpdate');e.innerHTML=msg;e.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>e.classList.remove('show'),2600)}
function heroize(u){if(u.hero)return;u.hero=true;heroesForged++;u.heroBattles=0;u.name=`Sir ${rnd(NAMES)} the ${rnd(ADJ)}`;u.hp*=1.2;u.maxHp*=1.2;u.damage*=1.2;toast(`A HERO IS FORGED IN BATTLE!<br><b>${u.name}</b><br>3 ENEMIES SLAIN`);sfx.hero();burst(u.x,u.y-10,'#ffe36d',12)}
function snapFortification(x,y){
 let pts=[];
 for(const w of walls){pts.push({x:w.x-w.width/2-4,y:w.y},{x:w.x+w.width/2+4,y:w.y})}
 for(const tw of towers){pts.push({x:tw.x-43,y:tw.y},{x:tw.x+43,y:tw.y})}
 let best=null,bd=28;for(const p of pts){let d=Math.hypot(p.x-x,p.y-y);if(d<bd){best=p;bd=d}}
 return best||{x,y}
}
function deploy(type,x,y){if(ended||levelState!=='battle'||mana<COST[type])return;if(type==='tower'&&towers.some(t=>dist(t,{x,y})<50))return;ready();mana-=COST[type];purseSpent+=COST[type];deployments++;x=clamp(x,23,W-23);y=clamp(y,H*.62,H-57);
if(type==='wall'){
 let s=snapFortification(x,y),wh=250*(devPlayerNation&&playerNation==='france'?1.10:1)*research.keep;
 walls.push({id:nextId++,type:'wall',x:clamp(s.x,44,W-44),y:clamp(s.y,H*.56,H-64),width:78,height:18,hp:wh,maxHp:wh,gateOpen:0,armor:.10});
 toast('WALL SEGMENT RAISED!');
}
else if(type==='tower'){let th=devPlayerNation&&playerNation==='france'?165:150;towers.push({id:nextId++,type,x,y,hp:th,maxHp:th,range:180,rate:.9,damage:18,cool:0,armor:.30});}
else if(type==='dragon'){let d=researchUnit({id:nextId++,type,x,y:H-58,hp:999,maxHp:999,damage:70,speed:92,range:120,rate:1.4,cool:0,kills:0,level:0,gear:[],hero:false,dragon:true,born:elapsed,controlTime:9,anim:0,done:false,facingAngle:-Math.PI/2,facingX:0,facingY:-1});units.push(d);dragonControl=d;toast('DRAGON CONTROL! USE THE ARROW KEYS!');sfx.hero()}
else if(type==='carpenter'){units.push(researchUnit({id:nextId++,type:'carpenter',x:W/2,y:H+18,hp:5,maxHp:5,damage:0,speed:34,range:0,rate:0,cool:0,kills:0,level:0,gear:[],hero:false,recorded:false,born:elapsed,skin:rnd(SKINS),phase:'walking',work:0,anim:0}));toast('A CARPENTER RUSHES TO THE KEEP!')}
else{let u=type==='warrior'?{id:nextId++,type,x,y,hp:18,maxHp:18,damage:5,speed:34,range:19,rate:.72,cool:0}:type==='friendlyBerserker'?{id:nextId++,type,x,y,hp:30,maxHp:30,damage:9,speed:29,range:20,rate:.62,cool:0}:type==='archer'?{id:nextId++,type,x,y,hp:7,maxHp:7,damage:4,speed:25,range:125,rate:1.05,cool:0}:
type==='fireArcher'?{id:nextId++,type,x,y,hp:6,maxHp:6,damage:3.4,speed:23,range:120,rate:.78,cool:0,burnDamage:1.2,burnTime:3,splash:24}:type==='knight'?{id:nextId++,type,x,y,hp:29,maxHp:29,damage:8.8,speed:52,range:24,rate:.82,cool:0}:{id:nextId++,type:'catapult',x,y,hp:12,maxHp:12,damage:18,splash:58,speed:9,range:190,rate:.22,cool:0};Object.assign(u,{kills:0,level:0,gear:[],retreating:false,healing:false,hero:false,recorded:false,born:elapsed,target:null,wander:0,wanderAngle:0,anim:rand(0,1),skin:rnd(SKINS)});
if(devPlayerNation&&playerNation==='england'&&['archer','fireArcher'].includes(u.type))u.range*=1.10;
if(devPlayerNation&&playerNation==='spain'&&['warrior','knight'].includes(u.type))u.damage*=1.10;
if(devPlayerNation&&playerNation==='china'&&u.type==='catapult')u.splash*=1.20;
units.push(researchUnit(u));
if(devPlayerNation&&playerNation==='russia'){russiaDeployCount++;if(russiaDeployCount%10===0){let f=researchUnit({id:nextId++,type:'warrior',x:W/2,y:H-58,hp:18,maxHp:18,damage:5,speed:34,range:19,rate:.72,cool:0,kills:0,level:0,gear:[],retreating:false,healing:false,hero:false,recorded:false,born:elapsed,target:null,wander:0,wanderAngle:0,anim:0,skin:rnd(SKINS)});units.push(f);toast('THE GREAT HOST SENDS A FREE WARRIOR!')}}if(type==='fireArcher')toast('FIRE ARCHER: BURNING SPLASH DAMAGE')}burst(x,y,'#ffe08a',6);updateUI()}
function issueCommand(cmd,x,y){
 const nearby=units.filter(u=>!u.dragon&&u.type!=='carpenter'&&!u.healing&&u.hp>0&&Math.hypot(u.x-x,u.y-y)<=125);
 if(!nearby.length){toast('NO TROOPS CLOSE ENOUGH');return}
 if(cmd==='formation'){
  const melee=nearby.filter(u=>!['archer','fireArcher','catapult'].includes(u.type)),ranged=nearby.filter(u=>['archer','fireArcher','catapult'].includes(u.type));
  const place=(arr,rowY,spacing)=>arr.forEach((u,i)=>{u.commandTarget={x:clamp(x+(i-(arr.length-1)/2)*spacing,18,W-18),y:clamp(rowY,25,H-50)};u.commandHold=5;u.forcedTarget=null});
  place(melee,y-18,25);place(ranged,y+18,30);toast(`${nearby.length} TROOPS FORM RANKS!`);
 }else if(cmd==='fallback'){
  nearby.forEach((u,i)=>{u.commandTarget={x:clamp(W/2+(i-(nearby.length-1)/2)*20,20,W-20),y:H-50};u.commandHold=5;u.forcedTarget=null});toast(`${nearby.length} TROOPS FALL BACK!`);
 }else if(cmd==='help'){
  const threat=nearest({x,y},enemies,150);if(!threat){toast('NO ENEMY NEAR THAT POINT');return}
  nearby.forEach(u=>{u.forcedTarget=threat;u.commandTarget=null;u.commandHold=6});toast(`${nearby.length} TROOPS ANSWER THE CALL!`);
 }
 commandMode=null;$$('.strategy').forEach(b=>b.classList.remove('selected'));select(selected);
}
canvas.onpointerdown=e=>{e.preventDefault();let r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(commandMode)issueCommand(commandMode,x,y);else deploy(selected,x,y);$('#hint').style.opacity=0};

window.addEventListener('keydown',e=>{if(!dragonControl)return;let m={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(m){dragonKeys[m]=true;e.preventDefault()}});
window.addEventListener('keyup',e=>{let m={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(m){dragonKeys[m]=false;e.preventDefault()}});

function updateStanceButton(){let b=$('#stanceToggle');if(!b)return;b.classList.toggle('aggressive',battleStance==='aggressive');b.classList.toggle('defensive',battleStance==='defensive');b.setAttribute('aria-label',`Battle stance: ${battleStance}`)}
$('#stanceToggle').onpointerdown=e=>{e.preventDefault();ready();battleStance=battleStance==='aggressive'?'defensive':'aggressive';updateStanceButton();toast(`STANCE: ${battleStance.toUpperCase()}`)};
