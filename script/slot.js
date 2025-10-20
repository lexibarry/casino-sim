const symbols = ["🍒","🍋","🔔","💎","7️⃣","🍀","⭐"];
let balance = 1000, bet = 0;
const reels=[...document.querySelectorAll(".reel")];
const result=document.getElementById("result");
const spinSound=document.getElementById("spinSound");
const winSound=document.getElementById("winSound");
const loseSound=document.getElementById("loseSound");

document.querySelectorAll(".chip").forEach(chip=>{
  chip.onclick=()=>{
    const val=Number(chip.dataset.value);
    if(balance>=val){bet+=val;balance-=val;update();}
  };
});
function update(){
  document.getElementById("balance").textContent=`Balance: ${balance} credits`;
  document.getElementById("current-bet").textContent=bet;
}
document.getElementById("spin").onclick=()=>{
  if(bet<=0){result.textContent="Place a bet!";return;}
  spin();
};
function spin(){
  spinSound.play();
  result.textContent="";
  reels.forEach(r=>r.classList.add("spin"));
  const out=reels.map(()=>symbols[Math.floor(Math.random()*symbols.length)]);
  setTimeout(()=>stop(0,out[0]),800);
  setTimeout(()=>stop(1,out[1]),1200);
  setTimeout(()=>stop(2,out[2]),1600);
  setTimeout(()=>resolve(out),2000);
}
function stop(i,s){reels[i].classList.remove("spin");reels[i].textContent=s;}
function resolve(o){
  const container=document.querySelector(".game-container");
  const allSame=o.every(s=>s===o[0]), twoSame=new Set(o).size===2;
  if(allSame){winSound.play();container.classList.add("flash-win");
    balance+=bet*10;result.textContent=`JACKPOT! Won ${bet*10}!`;
  }else if(twoSame){winSound.play();container.classList.add("flash-win");
    balance+=bet*3;result.textContent=`Matched 2! Won ${bet*3}!`;
  }else{loseSound.play();container.classList.add("flash-loss");
    result.textContent=`Lost ${bet}.`;
  }
  bet=0;update();setTimeout(()=>container.classList.remove("flash-win","flash-loss"),2000);
}
