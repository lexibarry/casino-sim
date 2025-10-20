let deck=[],player=[],dealer=[];
let balance=1000,bet=0;

const suits=['♠️','♥️','♦️','♣️'];
const values=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function newDeck(){
  deck=[];
  for(let i=0;i<6;i++)for(let s of suits)for(let v of values)deck.push({s,v});
}
function draw(){return deck.splice(Math.floor(Math.random()*deck.length),1)[0];}
function val(hand){
  let total=0,aces=0;
  for(let c of hand){
    if(['J','Q','K'].includes(c.v))total+=10;
    else if(c.v==='A'){total+=11;aces++;}
    else total+=Number(c.v);
  }
  while(total>21&&aces){total-=10;aces--;}
  return total;
}
function render(){
  document.getElementById('dealer').textContent='Dealer: '+dealer.map(c=>c.v+c.s).join(' ');
  document.getElementById('player').textContent='Player: '+player.map(c=>c.v+c.s).join(' ');
}
function update(){
  document.getElementById('balance').textContent=`Balance: ${balance} credits`;
  document.getElementById('current-bet').textContent=bet;
}
document.querySelectorAll('.chip').forEach(chip=>{
  chip.onclick=()=>{const v=Number(chip.dataset.value);if(balance>=v){bet+=v;balance-=v;update();}};
});

document.getElementById('deal').onclick=()=>{
  if(bet<=0)return alert("Place a bet!");
  newDeck();
  player=[draw(),draw()];
  dealer=[draw(),draw()];
  render();
  document.getElementById('message').textContent='';
};

document.getElementById('hit').onclick=()=>{
  player.push(draw());render();
  if(val(player)>21)endRound('loss');
};

document.getElementById('stand').onclick=()=>{
  const strat=document.getElementById('strategy').value;
  let standValue=strat==='aggressive'?18:strat==='conservative'?15:17;
  while(val(dealer)<standValue)dealer.push(draw());
  render();
  const p=val(player),d=val(dealer);
  if(p>21)endRound('loss');
  else if(d>21||p>d)endRound('win');
  else if(p===d)endRound('push');
  else endRound('loss');
};

function endRound(res){
  const cont=document.querySelector('.game-container');
  cont.classList.remove('flash-win','flash-loss');
  if(res==='win'){cont.classList.add('flash-win');balance+=bet*2;document.getElementById('message').textContent='You win!';}
  else if(res==='loss'){cont.classList.add('flash-loss');document.getElementById('message').textContent='You lose!';}
  else {balance+=bet;document.getElementById('message').textContent='Push.';}
  bet=0;update();
  setTimeout(()=>cont.classList.remove('flash-win','flash-loss'),2000);
}
