let deck=[],player=[],opp=[],community=[];
let balance=1000,bet=0;
const suits=['♠️','♥️','♦️','♣️'];
const values=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

function newDeck(){deck=[];for(let s of suits)for(let v of values)deck.push({s,v});}
function draw(){return deck.splice(Math.floor(Math.random()*deck.length),1)[0];}
function cardVal(v){return v==='A'?14:v==='K'?13:v==='Q'?12:v==='J'?11:Number(v);}
function evalBest5(cards){
  const vals=cards.map(c=>cardVal(c.v)).sort((a,b)=>a-b);
  const suitsA=cards.map(c=>c.s);
  const counts={};vals.forEach(v=>counts[v]=(counts[v]||0)+1);
  const isFlush=suitsA.every(s=>s===suitsA[0]);
  const isStraight=vals.every((v,i,a)=>i===0||v===a[i-1]+1);
  const freq=Object.values(counts).sort((a,b)=>b-a).join('');
  if(isStraight&&isFlush)return 8;
  if(freq==='4,1')return 7;
  if(freq==='3,2')return 6;
  if(isFlush)return 5;
  if(isStraight)return 4;
  if(freq==='3,1,1')return 3;
  if(freq==='2,2,1')return 2;
  if(freq==='2,1,1,1')return 1;
  return 0;
}
function bestRank(hand){
  const all=[...hand];let ranks=[];
  for(let a=0;a<all.length;a++)
   for(let b=a+1;b<all.length;b++)
    for(let c=b+1;c<all.length;c++)
     for(let d=c+1;d<all.length;d++)
      for(let e=d+1;e<all.length;e++)
        ranks.push(evalBest5([all[a],all[b],all[c],all[d],all[e]]));
  return Math.max(...ranks);
}
function update(){
  document.getElementById('balance').textContent=`Balance: ${balance} credits`;
  document.getElementById('current-bet').textContent=bet;
}
document.querySelectorAll('.chip').forEach(chip=>{
  chip.onclick=()=>{const v=Number(chip.dataset.value);if(balance>=v){bet+=v;balance-=v;update();}};
});

function render(){
  document.getElementById('player-hand').textContent='Your Hand: '+player.map(c=>c.v+c.s).join(' ');
  document.getElementById('community').textContent='Community: '+community.map(c=>c.v+c.s).join(' ');
  document.getElementById('opponent-hand').textContent='Opponent: '+(community.length===5?opp.map(c=>c.v+c.s).join(' '):'?? ??');
}
document.getElementById('deal').onclick=()=>{
  if(bet<=0)return alert('Place a bet!');
  newDeck();player=[draw(),draw()];opp=[draw(),draw()];community=[];
  render();document.getElementById('result').textContent='';
  document.getElementById('flop').disabled=false;
  document.getElementById('turn').disabled=true;
  document.getElementById('river').disabled=true;
  document.getElementById('showdown').disabled=true;
};
document.getElementById('flop').onclick=()=>{community=[draw(),draw(),draw()];render();document.getElementById('flop').disabled=true;document.getElementById('turn').disabled=false;};
document.getElementById('turn').onclick=()=>{community.push(draw());render();document.getElementById('turn').disabled=true;document.getElementById('river').disabled=false;};
document.getElementById('river').onclick=()=>{community.push(draw());render();document.getElementById('river').disabled=true;document.getElementById('showdown').disabled=false;};
document.getElementById('showdown').onclick=()=>{resolve();document.getElementById('showdown').disabled=true;};

function resolve(){
  const playerRank=bestRank([...player,...community]);
  const oppRank=bestRank([...opp,...community]);
  const strat=document.getElementById('poker-strategy').value;
  let mod=0;
  if(strat==='aggressive')mod=Math.random()<0.2?1:-1;
  if(strat==='conservative')mod=Math.random()<0.2?-1:1;
  const adjRank=playerRank+mod;

  const cont=document.querySelector('.game-container');
  cont.classList.remove('flash-win','flash-loss');
  if(adjRank>oppRank){cont.classList.add('flash-win');balance+=bet*2;document.getElementById('result').textContent='You win!';}
  else if(adjRank===oppRank){balance+=bet;document.getElementById('result').textContent='Tie!';}
  else{cont.classList.add('flash-loss');document.getElementById('result').textContent='Opponent wins!';}
  bet=0;update();
  setTimeout(()=>cont.classList.remove('flash-win','flash-loss'),2000);
}
