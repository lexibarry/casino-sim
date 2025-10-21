let balance = 1000, bet = 0, point = null;

document.querySelectorAll(".chip").forEach(chip=>{
  chip.onclick=()=>{const v=Number(chip.dataset.value);
    if(balance>=v){bet+=v;balance-=v;update();}
  };
});

function update(){
  document.getElementById('balance').textContent=`Balance: ${balance} credits`;
  document.getElementById('current-bet').textContent=bet;
}

document.getElementById("roll").onclick=()=>{
  if(bet<=0)return alert("Place a bet first!");
  const d1=document.getElementById("die1"),d2=document.getElementById("die2");
  d1.classList.add("roll-anim");d2.classList.add("roll-anim");
  setTimeout(()=>{
    d1.classList.remove("roll-anim");d2.classList.remove("roll-anim");
    const n1=Math.ceil(Math.random()*6),n2=Math.ceil(Math.random()*6),sum=n1+n2;
    d1.textContent=n1;d2.textContent=n2;
    resolve(sum);
  },1000);
};

function resolve(sum){
  const r=document.getElementById("result");
  const cont=document.querySelector(".game-container");
  cont.classList.remove("flash-win","flash-loss");
  if(point===null){
    if(sum===7||sum===11){win("Natural! You win!");}
    else if(sum===2||sum===3||sum===12){lose("Craps! You lose.");}
    else{point=sum;r.textContent=`Point is set to ${point}. Roll again.`;}
  }else{
    if(sum===point){win(`You rolled your point (${point})! You win!`);point=null;}
    else if(sum===7){lose("Seven out! You lose.");point=null;}
    else{r.textContent=`You rolled ${sum}. Point still ${point}.`;}
  }

  function win(msg){cont.classList.add("flash-win");r.textContent=msg;balance+=bet*2;bet=0;update();reset();}
  function lose(msg){cont.classList.add("flash-loss");r.textContent=msg;bet=0;update();reset();}
  function reset(){setTimeout(()=>cont.classList.remove("flash-win","flash-loss"),2000);}
}
