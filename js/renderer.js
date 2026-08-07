"use strict";
function bar(o,w=24){if(o.hp>=o.maxHp)return;ctx.fillStyle='#28150f';ctx.fillRect(o.x-w/2,o.y-21,w,4);ctx.fillStyle=['raider','berserker','enemyArcher'].includes(o.type)?'#d44':'#69c66d';ctx.fillRect(o.x-w/2,o.y-21,w*clamp(o.hp/o.maxHp,0,1),4)}
function unitDraw(o,enemy=false){let x=Math.round(o.x),y=Math.round(o.y),frame=Math.floor((o.anim||0)*6)%2,attackFrame=enemy&&o.wallAttacking?Math.floor((o.anim||0)*8)%2:0,moving=!o.healing&&!o.retreating;if(enemy&&!o.wallAttacking&&!o.anchored&&!o.dragon){y+=frame?1:0;}
if(o.type==='dragon'||o.type==='enemyDragon'){
 ctx.save();ctx.translate(x,y);if(o.type==='dragon'&&Number.isFinite(o.facingAngle))ctx.rotate(o.facingAngle);let flap=Math.floor((o.anim||0)*6)%2;
 ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(-35,20,70,7);
 ctx.fillStyle=enemy?'#761d24':'#6c2b84';ctx.fillRect(-23,-8,43,25);
 ctx.fillStyle=enemy?'#a9322c':'#a94438';ctx.fillRect(15,-17,25,18);
 ctx.fillStyle='#d76d35';ctx.fillRect(34,-12,13,8);
 ctx.fillStyle='#e6a34a';ctx.fillRect(44,-9,8,4);
 ctx.fillStyle='#4a1018';ctx.fillRect(26,-19,5,5);ctx.fillRect(36,-19,5,5);
 ctx.fillStyle='#f4d45d';ctx.fillRect(38,-16,3,3);
 ctx.fillStyle=enemy?'#4e1218':'#4c235f';ctx.fillRect(-33,-3,12,10);
 ctx.fillStyle='#d85231';ctx.fillRect(-31,1,10,5);
 ctx.fillStyle=enemy?'#8f2730':'#56306f';
 ctx.beginPath();
 if(flap){ctx.moveTo(-10,-7);ctx.lineTo(-42,-34);ctx.lineTo(-8,-18);ctx.lineTo(5,-7)}
 else{ctx.moveTo(-10,-7);ctx.lineTo(-44,8);ctx.lineTo(-7,1);ctx.lineTo(5,-7)}
 ctx.fill();
 ctx.beginPath();
 if(flap){ctx.moveTo(8,-7);ctx.lineTo(39,-31);ctx.lineTo(18,-11)}
 else{ctx.moveTo(8,-7);ctx.lineTo(42,7);ctx.lineTo(18,-1)}
 ctx.fill();
 ctx.fillStyle='#5c1520';ctx.fillRect(-10,11,7,12);ctx.fillRect(8,11,7,12);
 ctx.fillStyle='#dfb44f';ctx.fillRect(-9,19,8,4);ctx.fillRect(9,19,8,4);
 ctx.fillStyle='#d7b04b';ctx.fillRect(-5,-19,12,11);
 ctx.fillStyle=o.skin||'#c58f68';ctx.fillRect(-2,-25,8,7);
 ctx.fillStyle='#4b2a1c';ctx.fillRect(-6,-28,14,4);
 ctx.fillStyle='#d7d9dc';ctx.fillRect(2,-32,3,8);
 if(o.breathing){for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#ffd24a':'#ff6c24';ctx.fillRect(46+i*7+rand(-2,2),-9+rand(-5,5),8,7)}}
 ctx.restore();return}if(o.type==='carpenter'){ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(-9,10,18,5);ctx.fillStyle='#7b5633';ctx.fillRect(-7,-4,14,15);ctx.fillStyle=o.skin||'#c58f68';ctx.fillRect(-6,-13,12,9);ctx.fillStyle='#d7b04b';ctx.fillRect(-7,-15,14,4);let swing=Math.floor(o.anim*5)%2;ctx.save();ctx.translate(8,-2);ctx.rotate(swing?-.7:.25);ctx.fillStyle='#8b613a';ctx.fillRect(-2,-2,14,4);ctx.fillStyle='#b8b8b8';ctx.fillRect(9,-5,7,10);ctx.restore();ctx.fillStyle='#34241b';
 if(moving&&frame){ctx.fillRect(-8,11,4,5);ctx.fillRect(3,10,4,6)}
 else{ctx.fillRect(-6,11,4,5);ctx.fillRect(2,11,4,5)}ctx.restore();bar(o,24);return}if(o.type==='catapult'){ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(-22,14,44,5);ctx.fillStyle='#3a271a';ctx.fillRect(-19,7,13,13);ctx.fillRect(7,7,13,13);ctx.fillStyle='#9a6737';ctx.fillRect(-17,-2,34,12);ctx.fillStyle='#c29657';ctx.fillRect(-14,0,28,5);ctx.fillStyle='#5a391f';ctx.fillRect(-5,-18,8,25);ctx.save();ctx.rotate(o.wallAttacking?(attackFrame?-.18:-1.02):-.62);ctx.fillStyle='#b98242';ctx.fillRect(-3,-3,42,7);ctx.fillStyle='#d0aa67';ctx.fillRect(30,-6,12,13);ctx.restore();ctx.strokeStyle='#d3b278';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,-2);ctx.lineTo(4,-19);ctx.lineTo(16,-1);ctx.stroke();ctx.fillStyle='#74695d';ctx.fillRect(25,-27,13,13);ctx.fillStyle='#b9a37e';ctx.fillRect(-3,-7,6,6);ctx.restore();bar(o,38);return}ctx.save();ctx.translate(x,y);let b=['berserker','friendlyBerserker'].includes(o.type),a=['archer','fireArcher','enemyArcher','enemyTower'].includes(o.type),k=['knight','enemyKnight'].includes(o.type);if(k){ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(-17,12,34,6);ctx.fillStyle='#8b5c35';ctx.fillRect(-15,0,29,14);ctx.fillRect(9,-7,11,13);ctx.fillStyle='#33251c';let step=Math.floor(o.anim*7)%2;if(step===0){ctx.fillRect(-14,12,5,9);ctx.fillRect(7,12,5,6);ctx.fillRect(12,16,5,5)}else{ctx.fillRect(-10,12,5,6);ctx.fillRect(-15,16,5,5);ctx.fillRect(9,12,5,9)}if(enemy&&o.wallAttacking){ctx.rotate(attackFrame?-.10:.08)}ctx.fillStyle=o.hero?'#6d3d94':enemy?'#7e2e2e':'#315c9d';ctx.fillRect(-5,-14,13,15);ctx.fillStyle=o.skin||'#e3aa78';ctx.fillRect(-4,-17,11,5);ctx.fillStyle='#d8bf67';ctx.fillRect(-6,-19,15,4);ctx.save();ctx.translate(12,-6);if(enemy&&o.wallAttacking)ctx.rotate(attackFrame?1.12:.18);ctx.fillStyle='#e8e8e8';ctx.fillRect(-2,-10,4,19);ctx.restore();ctx.restore();bar(o,34);heroLabel(o);return}ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(-9,10,18,5);if(o.healing){ctx.translate(0,5);ctx.rotate(-.12)}ctx.fillStyle=o.hero?'#6d3d94':o.type==='fireArcher'?'#9a4a22':enemy?'#7e2e2e':'#315c9d';ctx.fillRect(-7,-4,14,15);ctx.fillStyle=b?'#d8895a':'#e3aa78';ctx.fillRect(-6,-13,12,9);ctx.fillStyle=enemy?'#541f22':o.hero?'#4f276f':'#203d70';ctx.fillRect(-7,-15,14,4);ctx.fillStyle='#34241b';
 if(moving&&frame){ctx.fillRect(-8,10,4,6);ctx.fillRect(3,12,4,4)}
 else if(moving){ctx.fillRect(-5,12,4,4);ctx.fillRect(3,10,4,6)}
 else{ctx.fillRect(-6,11,4,5);ctx.fillRect(2,11,4,5)}if(a){
 let af=enemy&&o.wallAttacking?attackFrame:frame,bx=af?12:8,by=af?-4:-1;
 ctx.strokeStyle='#d6b06a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,7,-Math.PI/2,Math.PI/2);ctx.stroke();
 ctx.fillStyle='#8b613a';ctx.fillRect(af?3:0,af?-5:-2,12,2);
 if(enemy&&o.wallAttacking&&af){ctx.fillStyle='#d8dbe0';ctx.fillRect(14,-5,9,2)}
 if(o.type==='fireArcher'){ctx.fillStyle='#ff8a28';ctx.fillRect(af?14:10,af?-7:-4,4,4);ctx.fillStyle='#ffd45b';ctx.fillRect(af?15:11,af?-8:-5,2,2)}
}else{ctx.save();ctx.translate(9,-2);if(enemy&&o.wallAttacking)ctx.rotate(attackFrame?1.15:.12);ctx.fillStyle=o.gear?.includes('jeweled weapon')?'#8df0ff':'#d8dbe0';ctx.fillRect(-1,-8,3,13);ctx.fillStyle='#8b613a';ctx.fillRect(-2,4,5,3);ctx.restore()}if(b){ctx.fillStyle='#cf3f31';ctx.fillRect(-10,-8,4,13);ctx.fillRect(6,-8,4,13)}if(o.gear){if(o.gear.includes('cape')){ctx.fillStyle='#b62933';ctx.fillRect(-10,-3,4,14)}if(o.gear.includes('helmet')){ctx.fillStyle='#d8bf67';ctx.fillRect(-7,-17,14,5)}if(o.gear.includes('plume')){ctx.fillStyle='#e74848';ctx.fillRect(-2,-23,4,7)}if(o.gear.includes('boots')){ctx.fillStyle='#d2aa45';ctx.fillRect(-7,12,5,4);ctx.fillRect(2,12,5,4)}if(o.gear.includes('cuffs')){ctx.fillStyle='#e4c75e';ctx.fillRect(-10,1,3,5);ctx.fillRect(7,1,3,5)}if(o.gear.includes('medal')){ctx.fillStyle='#ffe36d';ctx.fillRect(-2,1,4,4)}}ctx.restore();bar(o,b?30:24);heroLabel(o)}

function heroLabel(o){if(!o.hero)return;ctx.save();ctx.font='bold 8px ui-monospace';ctx.textAlign='center';let w=Math.min(150,ctx.measureText(o.name).width+8),y=o.y-31;ctx.fillStyle='rgba(28,15,8,.78)';ctx.fillRect(o.x-w/2,y-9,w,11);ctx.fillStyle='#fff0a7';ctx.fillText(o.name,o.x,y);ctx.restore()}
function heroAuraDraw(o){if(!o.hero||o.healing)return;ctx.save();ctx.strokeStyle='rgba(255,224,112,.32)';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(o.x,o.y,92+Math.sin(elapsed*3+o.id)*2,0,Math.PI*2);ctx.stroke();ctx.restore()}

function wallDraw(w){
 let x=Math.round(w.x),y=Math.round(w.y),open=(w.gateOpen||0)>0,half=w.width/2,gate=14;
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='rgba(0,0,0,.24)';ctx.fillRect(-half,12,w.width,6);
 // Draw the stone in two halves so an open gate exposes the battlefield turf behind it.
 ctx.fillStyle='#75624f';ctx.fillRect(-half,-10,half-gate,24);ctx.fillRect(gate,-10,half-gate,24);
 ctx.fillStyle='#a08b70';
 for(let bx=-half;bx<-gate;bx+=14){ctx.fillRect(bx,-13,10,7);ctx.fillStyle='#665341';ctx.fillRect(bx+3,-3,11,3);ctx.fillStyle='#a08b70'}
 for(let bx=gate;bx<half;bx+=14){ctx.fillRect(bx,-13,10,7);ctx.fillStyle='#665341';ctx.fillRect(bx+3,-3,11,3);ctx.fillStyle='#a08b70'}
 // Stone arch and gate mechanism.
 ctx.fillStyle='#4c3b2d';ctx.fillRect(-gate-3,-12,4,27);ctx.fillRect(gate-1,-12,4,27);ctx.fillRect(-gate-3,-12,gate*2+6,4);
 if(open){
  ctx.fillStyle='#8b6a42';ctx.fillRect(-gate+2,-16,gate*2-4,4);
  ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(-gate+3,-7,2,16);
 }else{
  ctx.fillStyle='#2d241c';ctx.fillRect(-gate,-8,gate*2,22);
  ctx.fillStyle='#8b6a42';for(let gx=-gate+3;gx<gate;gx+=6)ctx.fillRect(gx,-8,2,22);
  ctx.fillRect(-gate,0,gate*2,2);
 }
 ctx.restore();bar(w,Math.min(54,w.width*.7))
}
function towerDraw(t){let x=Math.round(t.x),y=Math.round(t.y);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x-15,y+14,30,6);ctx.fillStyle='#826b55';ctx.fillRect(x-12,y-15,24,31);ctx.fillStyle='#b9a37e';ctx.fillRect(x-15,y-20,8,8);ctx.fillRect(x-4,y-20,8,8);ctx.fillRect(x+7,y-20,8,8);ctx.fillStyle='#392a21';ctx.fillRect(x-4,y+3,8,13);ctx.fillStyle='#233d68';ctx.fillRect(x-2,y-25,4,13);ctx.fillStyle='#d9bc53';ctx.fillRect(x+2,y-25,11,6);bar(t,30)}

function drawKingFace(){let x=27,y=23,damage=100-keep,m=elapsed<faceUntil?faceMood:'normal';fctx.clearRect(0,0,54,48);fctx.fillStyle='#20150e';fctx.fillRect(2,1,50,46);fctx.fillStyle='#d2aa55';fctx.fillRect(5,4,44,40);fctx.fillStyle='#d8a071';fctx.fillRect(10,12,34,28);fctx.fillStyle='#7c4b29';fctx.fillRect(10,12,34,6);fctx.fillRect(7,17,5,18);fctx.fillRect(42,17,5,18);fctx.fillStyle='#f1cf63';fctx.fillRect(11,5,32,7);fctx.fillRect(14,1,6,7);fctx.fillRect(24,0,7,9);fctx.fillRect(36,1,6,7);fctx.fillStyle='#20130d';if(m==='wince'){fctx.fillRect(15,23,9,3);fctx.fillRect(31,23,9,3)}else{fctx.fillRect(17,22,5,5);fctx.fillRect(33,22,5,5)}if(damage>25){fctx.fillStyle='#493a5f';fctx.fillRect(29,19,12,10)}fctx.fillStyle='#5b241c';if(m==='smile'){fctx.fillRect(18,34,18,3);fctx.fillRect(21,37,12,3)}else if(m==='wince'){fctx.fillRect(18,37,18,3);fctx.fillRect(21,34,12,3)}else fctx.fillRect(20,35,14,3);if(damage>55){fctx.fillStyle='#fff0bb';fctx.fillRect(21,35,5,5);fctx.fillRect(31,35,5,5);fctx.fillStyle='#5b241c';fctx.fillRect(30,35,5,5)}if(damage>80){fctx.fillStyle='#9d1d24';fctx.fillRect(8,31,4,6)}$('#kingLabel').textContent='KING '+playerName.toUpperCase().slice(0,8)}
function draw(){ctx.clearRect(0,0,W,H);ctx.save();let sx=cameraShake?rand(-cameraShake,cameraShake):0,sy=cameraShake?rand(-cameraShake*.65,cameraShake*.65):0;ctx.translate(sx,sy);let pal={dawn:['#b88759','#8b7650','#c9a36d'],morning:['#73a95b','#65964f','#a88f63'],'late-morning':['#78ad58','#68974d','#ac9368'],noon:['#82b65a','#71a04f','#b69c70'],afternoon:['#a89c55','#8d8549','#b59a66'],evening:['#ad7547','#8e6540','#a87f58'],dusk:['#765c6f','#5f5262','#82705f'],night:['#25374c','#263d43','#4c4a48']}[currentLevel?.().className]||['#6d9e55','#628f4b','#9b835b'];ctx.fillStyle=pal[0];ctx.fillRect(0,0,W,H);ctx.fillStyle=pal[1];for(let y=20;y<H;y+=48)for(let x=(y/48%2)*20;x<W;x+=40)ctx.fillRect(x,y,3,7);ctx.fillStyle=pal[2];ctx.fillRect(W*.32,0,W*.36,H);ctx.fillStyle='#aa9367';for(let y=15;y<H;y+=34)for(let x=W*.34;x<W*.66;x+=26)ctx.fillRect(x+((y/34)%2)*8,y,10,4);ctx.fillStyle='rgba(58,87,151,.14)';ctx.fillRect(0,H*.61,W,H*.39);ctx.fillStyle='#514235';ctx.fillRect(0,H-31,W,31);ctx.fillStyle='#8e7a64';for(let x=0;x<W;x+=36)ctx.fillRect(x,H-39,24,13);ctx.fillStyle='#2a211b';ctx.fillRect(W/2-22,H-31,44,31);ctx.fillStyle='#bf954a';ctx.fillRect(W/2-4,H-31,8,31);if(crumbling){let p=clamp(crumbleTime/1.8,0,1);ctx.fillStyle='#17100b';ctx.globalAlpha=p*.75;ctx.fillRect(0,H-45*p,W,45*p);ctx.globalAlpha=1;for(let i=0;i<35;i++){let rx=(i*47+crumbleTime*90)%W,ry=H-8-((i*31)%40)*p;ctx.fillStyle=i%2?'#756553':'#9b8870';ctx.fillRect(rx,ry,rand(5,13),rand(4,9))}}walls.forEach(wallDraw);towers.forEach(towerDraw);units.filter(u=>u.hero).forEach(heroAuraDraw);units.forEach(u=>unitDraw(u));for(const u of units.filter(q=>q.healing)){let x=u.healerX??u.x,y=u.healerY??u.y+20,sway=u.healerReady?Math.sin(elapsed*7+u.id)*3:0;ctx.save();ctx.translate(x+sway,y);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(-8,10,16,4);ctx.fillStyle='#f0ead8';ctx.fillRect(-7,-4,14,15);ctx.fillStyle=u.skin||'#c58f68';ctx.fillRect(-6,-13,12,9);ctx.fillStyle='#e7e7e7';ctx.fillRect(-7,-15,14,4);ctx.fillStyle='#c7252d';ctx.fillRect(-2,-2,4,10);ctx.fillRect(-5,1,10,4);ctx.fillStyle='#34241b';let healerStep=Math.floor(elapsed*5+u.id)%2;
 if(!u.healerReady&&healerStep){ctx.fillRect(-8,11,4,5);ctx.fillRect(3,10,4,6)}
 else{ctx.fillRect(-6,11,4,5);ctx.fillRect(2,11,4,5)}ctx.restore()}enemies.forEach(e=>unitDraw(e,true));for(const p of shots){if(p.kind==='boulder'){ctx.fillStyle='#675b51';ctx.fillRect(p.x-6,p.y-6,12,12)}else{ctx.strokeStyle=p.kind==='fire'?'#ff7b22':p.enemy?'#51241c':'#f4e1a0';ctx.lineWidth=p.kind==='fire'?3:2;ctx.beginPath();ctx.moveTo(p.x-p.vx*.025,p.y-p.vy*.025);ctx.lineTo(p.x,p.y);ctx.stroke();if(p.kind==='fire'){ctx.fillStyle='#ffd45b';ctx.fillRect(p.x-2,p.y-2,4,4)}}}for(const p of parts){ctx.globalAlpha=clamp(p.life*3,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size)}ctx.globalAlpha=1;drawJuiceOverlays();ctx.restore();nationBannerDraw(35,H-54,playerNation);nationBannerDraw(W-38,H-54,playerNation,true);
if(dragonControl&&dragonControl.hp>0){ctx.save();ctx.strokeStyle='rgba(255,110,35,.55)';ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(dragonControl.x,dragonControl.y,dragonControl.range,0,Math.PI*2);ctx.stroke();ctx.restore()}
if(herald){herald.t+=1/60;herald.x+=5.1;if(herald.x<W+85){let hf=Math.floor(herald.t*9)%2;ctx.save();ctx.translate(Math.round(herald.x),Math.round(herald.y));ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-24,19,48,5);ctx.fillStyle='#5a351f';ctx.fillRect(-21,-1,38,15);ctx.fillRect(13,-8,12,10);ctx.fillStyle='#c99363';ctx.fillRect(17,-12,7,6);ctx.fillStyle='#372117';ctx.fillRect(21,-14,6,5);ctx.fillStyle='#6b4327';if(hf){ctx.fillRect(-17,13,6,13);ctx.fillRect(8,8,6,18)}else{ctx.fillRect(-10,8,6,18);ctx.fillRect(14,13,6,13)}ctx.fillStyle='#d0d5d8';ctx.fillRect(-4,-15,10,14);ctx.fillStyle=NATIONS[enemyNation].banner[0];ctx.fillRect(-6,-6,14,14);ctx.fillStyle='#6f482b';ctx.fillRect(-3,-19,4,14);ctx.restore();nationBannerDraw(herald.x+2,herald.y-8,enemyNation,false,1.15)}else herald=null}
drawKingFace()}
