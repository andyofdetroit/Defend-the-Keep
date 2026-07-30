"use strict";
function react(mood,d=1){faceMood=mood;faceUntil=elapsed+d}
function speakTitle(){
 if(!audio)return;
 const now=audio.currentTime+.03;
 const syllables=[
  {f:150,d:.22,v:[['sawtooth',1],['square',.35]],noise:.09},   // de-
  {f:118,d:.28,v:[['sawtooth',1],['square',.28]],noise:.07},   // fend
  {f:165,d:.18,v:[['sawtooth',1],['square',.25]],noise:.05},   // the
  {f:105,d:.42,v:[['sawtooth',1],['square',.42]],noise:.1}     // keep
 ];
 let offset=0;
 for(const syl of syllables){
  for(const [type,mix] of syl.v){
   const o=audio.createOscillator(),g=audio.createGain(),bp=audio.createBiquadFilter();
   o.type=type;o.frequency.setValueAtTime(syl.f,now+offset);o.frequency.exponentialRampToValueAtTime(syl.f*.82,now+offset+syl.d);
   bp.type='bandpass';bp.frequency.setValueAtTime(type==='square'?1200:700,now+offset);bp.Q.value=3.5;
   g.gain.setValueAtTime(.0001,now+offset);g.gain.exponentialRampToValueAtTime(.09*mix,now+offset+.025);g.gain.exponentialRampToValueAtTime(.0001,now+offset+syl.d);
   o.connect(bp).connect(g).connect(audio.destination);o.start(now+offset);o.stop(now+offset+syl.d);
  }
  noise(syl.d*.65,syl.noise,offset+.02);
  offset+=syl.d*.88;
 }
 tone(95,.16,.025,-25,offset-.03,'square')
}

async function ready(){if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')await audio.resume();return audio}
function tone(f=220,d=.08,v=.04,slide=0,delay=0,type='square'){if(!audio)return;let t=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(35,f+slide),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+d)}
function noise(d=.06,v=.03,delay=0){if(!audio)return;let n=Math.max(1,audio.sampleRate*d),b=audio.createBuffer(1,n,audio.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;let s=audio.createBufferSource(),g=audio.createGain(),t=audio.currentTime+delay;s.buffer=b;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(g).connect(audio.destination);s.start(t)}
const sfx={slam(){noise(.16,.11);tone(85,.18,.1,-35);tone(55,.2,.07,-15,.03)},sword(){noise(.035,.025);tone(310,.045,.035,-120)},arrow(){tone(850,.09,.025,-500,0,'sine');noise(.025,.012)},hit(){noise(.045,.035);tone(120,.04,.022,-45)},death(){tone(180,.18,.035,-110,0,'sawtooth');noise(.07,.02,.04)},heal(){tone(520,.08,.018,120,0,'sine')},promote(){[520,660,820].forEach((f,i)=>tone(f,.11,.035,40,i*.07))},hero(){[260,390,520,780].forEach((f,i)=>tone(f,.16,.05,50,i*.1))},mana(){tone(740,.05,.012,90,0,'sine')},title(){[[262,0],[330,.08],[392,.16],[523,.27],[659,.39],[784,.52]].forEach(([f,d])=>{tone(f,.24,.065,35,d,'square');tone(f/2,.25,.025,10,d,'triangle')})},over(){[[330,0],[277,.23],[220,.46],[165,.69]].forEach(([f,d])=>{tone(f,.34,.065,-55,d,'sawtooth');tone(f/2,.38,.025,-20,d,'triangle')})},rock(){tone(95,.17,.06,-40,0,'square');noise(.11,.055)},fire(){noise(.18,.05);tone(180,.22,.04,-100,0,'sawtooth')},crumble(){noise(.45,.09);tone(75,.45,.08,-35,0,'square')}};
const melody=[523,659,784,659,587,698,880,698,659,784,988,784,587,698,880,698,523,659,784,988];
function musicPulse(){if(!audio||!musicOn||!started||ended||crumbling)return;let f=melody[musicStep%melody.length];tone(f,.12,.015,-8,0,'square');tone(f*2,.045,.006,-25,.025,'square');if(musicStep%2===0)tone(f/2,.15,.009,-5,0,'triangle');musicStep++}
function startMusic(){stopMusic();musicStep=0;if(musicOn)musicTimer=setInterval(musicPulse,235)}
function stopMusic(){if(musicTimer){clearInterval(musicTimer);musicTimer=null}}
