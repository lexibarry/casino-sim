let balance = 1000, bet = 0;
document.querySelectorAll(".chip").forEach(chip=>{
  chip.onclick=()=>{const v=Number(chip.dataset.value);
    if(balance>=v){bet+=v;balance-=v;update();}
  };
});
function update(){
  document.getElementById('balance').textContent=`Balance: ${balance} credits`;
  document.getElementById('current-bet').textContent=bet;
}

const wheel=document.getElementById('wheel');
const result=document.getElementById('result');
const numberInput=document.getElementById('numberInput');
const betType=document.getElementById('betType');

betType.onchange=()=>{
  numberInput.style.display=betType.value==="number"?"inline-block":"none";
};

document.getElementById('spin').onclick=()=>{
  if(bet<=0)return alert("Place a bet first!");
  const degrees=Math.floor(720+Math.random()*360);
  wheel.style.transform=`rotate(${degrees}deg)`;

  setTimeout(()=>{
    const number=Math.floor(Math.random()*37);
    const color=number===0?"green":number%2===0?"black":"red";
    let win=false,payout=2;
    const type=betType.value;
    if(type==="red"&&color==="red")win=true;
    if(type==="black"&&color==="black")win=true;
    if(type==="even"&&number!==0&&number%2===0)win=true;
    if(type==="odd"&&number%2===1)win=true;
    if(type==="number"){
      const guess=Number(numberInput.value);
      if(number===guess){win=true;payout=36;}
    }
    const cont=document.querySelector('.game-container');
    cont.classList.remove('flash-win','flash-loss');
    if(win){cont.classList.add('flash-win');balance+=bet*payout;result.textContent=`Number: ${number} (${color}) You win ${bet*payout}!`;}
    else{cont.classList.add('flash-loss');result.textContent=`Number: ${number} (${color}) You lose ${bet}.`;}
    bet=0;update();setTimeout(()=>cont.classList.remove('flash-win','flash-loss'),2000);
  },3000);
};
