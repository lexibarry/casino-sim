let balance=1000,bet=0;

document.querySelectorAll(".chip").forEach(chip=>{
  chip.onclick=()=>{const v=Number(chip.dataset.value);
    if(balance>=v){bet+=v;balance-=v;update();}
  };
});
function update(){
  document.getElementById('balance').textContent=`Balance: ${balance} credits`;
  document.getElementById('current-bet').textContent=bet;
}

document.getElementById("race").onclick=()=>{
  if(bet<=0)return alert("Place a bet!");
  const lanes=document.querySelectorAll(".lane");
  lanes.forEach(l=>l.style.left="0px");
  const chosen=document.getElementById("horse").value;
  const cont=document.querySelector(".game-container");
  cont.classList.remove("flash-win","flash-loss");

  const interval=setInterval(()=>{
    lanes.forEach((lane,i)=>{
      let pos=parseFloat(lane.style.left)||0;
      pos+=Math.random()*20;
      if(pos>=600){finish(i+1);}
      lane.style.left=pos+"px";
    });
  },100);

  function finish(winner){
    clearInterval(interval);
    const result=document.getElementById("result");
    if(Number(chosen)===winner){
      cont.classList.add("flash-win");
      balance+=bet*4;
      result.textContent=`Horse ${winner} wins! You picked correctly!`;
    }else{
      cont.classList.add("flash-loss");
      result.textContent=`Horse ${winner} wins! You lose ${bet}.`;
    }
    bet=0;update();
    setTimeout(()=>cont.classList.remove("flash-win","flash-loss"),2000);
  }
};
