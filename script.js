(() => {
const arena = document.getElementById('arena');
const player = document.getElementById('player');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const boxesEl = document.getElementById('boxes');
const toast = document.getElementById('toast');

const GAME_SECONDS = 30;
const WIN_SCORE = 45;
const PLAYER_SPEED = 340; // pixels per second
const ITEMS = [
  {name:'Sweetbox', emoji:'🍬', points:15, reward:true, weight:3},
  {name:'TV', emoji:'📺', points:-5, weight:2},
  {name:'Washing machine', emoji:'🧺', points:-7, weight:2},
  {name:'Fridge', emoji:'🧊', points:-8, weight:2},
  {name:'ISRO rocket', emoji:'🚀', points:-12, weight:1.5},
  {name:'Tank', emoji:'🛡️', points:-15, weight:1.5}
];
let score=0, boxes=0, timeLeft=GAME_SECONDS, running=false, lastFrame=0, spawnTimer=0, elapsed=0, items=[], keys=new Set(), toastTimer=0, raf=0;
let playerX=0, pointerMove=false;

function updateHud(){scoreEl.textContent=score;timeEl.textContent=Math.ceil(timeLeft)+'s';boxesEl.textContent=boxes+' 🍬';}
function setPlayerX(x){const max=arena.clientWidth-player.offsetWidth;playerX=Math.max(0,Math.min(max,x));player.style.left=playerX+'px';}
function reset(){items.forEach(i=>i.el.remove());items=[];score=0;boxes=0;timeLeft=GAME_SECONDS;elapsed=0;spawnTimer=.35;keys.clear();updateHud();setPlayerX((arena.clientWidth-player.offsetWidth)/2);}
function showToast(title,detail){toast.querySelector('b').textContent=title;toast.querySelector('span').textContent=detail;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),700);}
function pickItem(){const total=ITEMS.reduce((n,x)=>n+x.weight,0);let r=Math.random()*total;for(const x of ITEMS){r-=x.weight;if(r<=0)return x;}return ITEMS[0];}
function spawn(){const data=pickItem(), el=document.createElement('div');el.className='falling'+(data.reward?' reward':'');el.textContent=data.emoji;el.title=data.name+(data.points>0?' +':' ')+data.points;const x=Math.random()*Math.max(1,arena.clientWidth-58);el.style.left=x+'px';el.style.top='-66px';arena.appendChild(el);items.push({data,el,x,y:-66,size:58,speed:150+Math.random()*100+elapsed*2.0});}
function endGame(won){running=false;cancelAnimationFrame(raf);overlay.classList.remove('hidden');const card=overlay.querySelector('.overlay-card');card.innerHTML=`<div class="big">${won?'🏆':'⏰'}</div><h2>${won?'Sweet victory!':'Time is up!'}</h2><p>${won?'You reached '+score+' points and caught '+boxes+' sweetbox'+(boxes===1?'':'es')+'. Mission complete!':'You scored '+score+' points and caught '+boxes+' sweetbox'+(boxes===1?'':'es')+'. You need '+WIN_SCORE+' points to win.'}</p><button class="btn" id="restart">PLAY AGAIN ↻</button><p style="font-size:.8rem">Your best strategy: collect sweetboxes and dodge the heavy objects.</p>`;document.getElementById('restart').addEventListener('click',begin);}
function begin(){reset();overlay.classList.add('hidden');running=true;lastFrame=performance.now();raf=requestAnimationFrame(loop);}
function loop(now){if(!running)return;const dt=Math.min((now-lastFrame)/1000,.04);lastFrame=now;elapsed+=dt;timeLeft=Math.max(0,timeLeft-dt);
const dx=(keys.has('ArrowRight')||keys.has('d')||keys.has('D')?1:0)-(keys.has('ArrowLeft')||keys.has('a')||keys.has('A')?1:0);if(dx)setPlayerX(playerX+dx*PLAYER_SPEED*dt);
spawnTimer-=dt;if(spawnTimer<=0){spawn();spawnTimer=Math.max(.27,.68-elapsed*.008)+Math.random()*.24;}
const pRect={left:playerX+7,right:playerX+player.offsetWidth-7,top:arena.clientHeight-player.offsetHeight-12,bottom:arena.clientHeight-8};
items=items.filter(item=>{item.y+=item.speed*dt;item.el.style.transform=`translateY(${item.y+66}px)`;const left=item.x,right=item.x+item.size,top=item.y,bottom=item.y+item.size;const hit=right>pRect.left&&left<pRect.right&&bottom>pRect.top&&top<pRect.bottom;
if(hit){score+=item.data.points;if(item.data.reward)boxes++;updateHud();showToast((item.data.points>0?'+':'')+item.data.points+' points',item.data.reward?'Sweetbox secured 🍬':item.data.name+' caught!');item.el.remove();if(score>=WIN_SCORE){endGame(true);}return false;}
if(item.y>arena.clientHeight){item.el.remove();return false;}return true;});
updateHud();if(!running)return;if(timeLeft<=0){endGame(score>=WIN_SCORE);return;}raf=requestAnimationFrame(loop);}
document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key);});
document.addEventListener('keyup',e=>keys.delete(e.key));
window.addEventListener('blur',()=>keys.clear());
function holdButton(id,key){const b=document.getElementById(id);const down=e=>{e.preventDefault();keys.add(key);};const up=e=>{e.preventDefault();keys.delete(key);};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,up));}
holdButton('left','ArrowLeft');holdButton('right','ArrowRight');
arena.addEventListener('pointerdown',e=>{if(!running||e.target.closest('button')||e.target.closest('.overlay'))return;pointerMove=true;const rect=arena.getBoundingClientRect();setPlayerX(e.clientX-rect.left-player.offsetWidth/2);});
arena.addEventListener('pointermove',e=>{if(!pointerMove||!running)return;const rect=arena.getBoundingClientRect();setPlayerX(e.clientX-rect.left-player.offsetWidth/2);});
window.addEventListener('pointerup',()=>pointerMove=false);
window.addEventListener('resize',()=>{if(running)setPlayerX(playerX);else setPlayerX((arena.clientWidth-player.offsetWidth)/2);});
startBtn.addEventListener('click',begin);
setPlayerX((arena.clientWidth-player.offsetWidth)/2);
})();