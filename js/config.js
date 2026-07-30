"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],canvas=$('#game'),ctx=canvas.getContext('2d'),faceCanvas=$('#faceCanvas'),fctx=faceCanvas.getContext('2d');
const COST={warrior:1,archer:2,fireArcher:5,knight:6,tower:10,catapult:12,dragon:100,carpenter:10},NAMES=['John','Robert','William','Thomas','Henry','Edward','Arthur','Geoffrey','Richard','Edmund','Nigel','Cedric','Alfred','Hugh','Walter','Stephen','Roland','Percival','Godfrey','Oswald'],ADJ=['Bald','Smelly','Brave','Loud','Sleepy','Tiny','Crooked','Magnificent','Unwashed','Forgetful','Angry','Glorious','Nervous','Polite','Round','Lucky','Grim','Red','Stubborn','Merry'],GEAR=['cuffs','cape','helmet','jeweled weapon','boots','plume','shield badge','medal','gold trim','scar'];
let W=0,H=0,dpr=1,selected='warrior',commandMode=null,mana=4,keep=100,kills=0,elapsed=0,deployments=0,ended=false,started=false,crumbling=false,crumbleTime=0,last=performance.now(),manaTick=0,spawnTick=0,nextId=1;
let units=[],enemies=[],towers=[],shots=[],parts=[],deaths=[],audio=null,timer,musicOn=true,musicTimer=null,musicStep=0,playerName=localStorage.getItem('defendKeepPlayer')||'Andy',faceMood='normal',faceUntil=0,keepHitBurst=0;
const SKINS=['#e3aa78','#e3aa78','#e3aa78','#e3aa78','#d9b08c','#b9784e','#75452f','#4b2d21'];
const rnd=a=>a[Math.floor(Math.random()*a.length)],rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

let hitStopTimer=0,cameraShake=0,devPaused=false,devInfiniteMana=false,devHitStop=true,devOpen=false,devFps=60;
