const CATS=[
{n:"Historia",e:"🏛️",c:"#e63946",q:[
["¿En qué año llegó Colón a América?",["1492","1453","1519","1607"],0],
["¿Quién lideró el Cruce de los Andes?",["Belgrano","San Martín","Sarmiento","Rosas"],1],
["¿Qué civilización construyó Machu Picchu?",["Azteca","Maya","Inca","Olmeca"],2],
["¿En qué año cayó el Muro de Berlín?",["1979","1989","1991","1969"],1],
["¿Quién fue el primer presidente de EE. UU.?",["Lincoln","Jefferson","Adams","Washington"],3]]},
{n:"Ciencia",e:"🔬",c:"#2a9d8f",q:[
["¿Qué planeta es el más grande del sistema solar?",["Saturno","Júpiter","Neptuno","Tierra"],1],
["¿Cuál es el símbolo químico del oro?",["Ag","Go","Au","Or"],2],
["¿Cuántos huesos tiene un adulto?",["206","180","250","300"],0],
["¿Qué gas respiramos principalmente?",["Oxígeno","Nitrógeno","CO₂","Helio"],1],
["¿Quién formuló la gravedad universal?",["Einstein","Newton","Galileo","Tesla"],1]]},
{n:"Geografía",e:"🌎",c:"#f4a261",q:[
["¿Cuál es la capital de Australia?",["Sídney","Melbourne","Canberra","Perth"],2],
["¿Cuál es el río más largo de Sudamérica?",["Paraná","Amazonas","Orinoco","Uruguay"],1],
["¿En qué continente está Egipto?",["Asia","Europa","África","Oceanía"],2],
["¿Cuál es el país más grande del mundo?",["China","Canadá","EE. UU.","Rusia"],3],
["¿Qué montaña es la más alta de América?",["Aconcagua","Everest","Chimborazo","Denali"],0]]},
{n:"Deportes",e:"⚽",c:"#4361ee",q:[
["¿Cada cuántos años se juega el Mundial de fútbol?",["2","3","4","5"],2],
["¿Cuántos jugadores tiene un equipo de básquet en cancha?",["5","6","7","11"],0],
["¿Qué país ganó el Mundial 2022?",["Francia","Brasil","Argentina","Croacia"],2],
["¿En qué deporte se usa una raqueta y un volante?",["Tenis","Bádminton","Squash","Pádel"],1],
["¿Cuánto mide una maratón (aprox.)?",["21 km","32 km","42 km","50 km"],2]]},
{n:"Arte",e:"🎨",c:"#9b5de5",q:[
["¿Quién pintó la Mona Lisa?",["Picasso","Van Gogh","Da Vinci","Dalí"],2],
["¿Quién pintó 'La noche estrellada'?",["Monet","Van Gogh","Goya","Rembrandt"],1],
["¿Quién escribió 'Don Quijote de la Mancha'?",["Cervantes","Borges","Lope de Vega","Neruda"],0],
["¿Cuántas cuerdas tiene una guitarra clásica?",["4","5","6","7"],2],
["¿Qué movimiento artístico lideró Picasso?",["Cubismo","Barroco","Impresionismo","Gótico"],0]]},
{n:"Entretenimiento",e:"🎬",c:"#06b6d4",q:[
["¿Cómo se llama el mago de las películas de J. K. Rowling?",["Merlín","Harry Potter","Gandalf","Percy"],1],
["¿Qué superhéroe es 'el hombre murciélago'?",["Superman","Flash","Batman","Thor"],2],
["¿Cuántos anillos hay en la bandera olímpica?",["4","5","6","7"],1],
["¿De qué color es Pikachu?",["Rojo","Azul","Amarillo","Verde"],2],
["¿Qué instrumento toca Lisa en Los Simpson?",["Piano","Saxofón","Violín","Trompeta"],1]]}
];
const $=id=>document.getElementById(id);
let score,streak,lives,best=0,rot=0,cur,tId,used={};
try{best=+localStorage.getItem("trivia_best")||0}catch(e){}
$("best").textContent=best;

// etiquetas de la ruleta
CATS.forEach((c,i)=>{const a=i*60+30,d=document.createElement("div");d.className="lbl";
d.style.transform=`rotate(${a}deg) translateY(-92px) rotate(${-a}deg)`;d.innerHTML=`<span>${c.e}</span>`;$("wheel").appendChild(d)});

function show(id){["start","spin","quiz","end"].forEach(s=>$(s).classList.toggle("hide",s!==id))}
function hud(){$("score").textContent=score;$("streak").textContent=streak;$("lives").textContent="❤️".repeat(lives)+"🖤".repeat(3-lives)}
function newGame(){score=0;streak=0;lives=3;used={};hud();show("spin");$("spinBtn").disabled=false}

$("playBtn").onclick=newGame;$("again").onclick=newGame;

$("spinBtn").onclick=()=>{
  $("spinBtn").disabled=true;
  rot+=1800+Math.floor(Math.random()*360);
  $("wheel").style.transform=`rotate(${rot}deg)`;
  setTimeout(()=>{const ang=(360-rot%360)%360;ask(Math.floor(ang/60)%6)},4200);
};

function ask(i){
  cur=CATS[i];
  const pool=cur.q.map((_,k)=>k).filter(k=>!(used[i]||[]).includes(k));
  if(!pool.length)used[i]=[];
  const p=pool.length?pool:cur.q.map((_,k)=>k);
  const k=p[Math.floor(Math.random()*p.length)];
  (used[i]=used[i]||[]).push(k);
  const [q,opts,ok]=cur.q[k];
  const list=opts.map((t,j)=>({t,ok:j===ok})).sort(()=>Math.random()-.5);
  $("cat").textContent=`${cur.e} ${cur.n}`;$("cat").style.background=cur.c;
  $("q").textContent=q;$("opts").innerHTML="";
  list.forEach(o=>{const b=document.createElement("button");b.className="opt";b.textContent=o.t;b.dataset.ok=o.ok;b.onclick=()=>answer(b);$("opts").appendChild(b)});
  show("quiz");
  let t=20;$("bar").style.transition="none";$("bar").style.width="100%";
  setTimeout(()=>{$("bar").style.transition="width 1s linear"},50);
  clearInterval(tId);
  tId=setInterval(()=>{t--;$("bar").style.width=(t/20*100)+"%";if(t<=0)answer(null)},1000);
}

function answer(btn){
  clearInterval(tId);
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.ok==="true")b.classList.add("ok")});
  const good=btn&&btn.dataset.ok==="true";
  if(good){streak++;score+=10+Math.min(streak,5)*2}
  else{if(btn)btn.classList.add("bad");streak=0;lives--}
  hud();
  setTimeout(()=>{
    if(lives<=0)return finish();
    show("spin");$("spinBtn").disabled=false;
  },1400);
}

function finish(){
  const rec=score>best;
  if(rec){best=score;try{localStorage.setItem("trivia_best",best)}catch(e){}}
  $("best").textContent=best;$("final").textContent=score+" pts";
  $("msg").textContent=rec?"🎉 ¡Nuevo récord!":"Récord actual: "+best;
  show("end");
}
