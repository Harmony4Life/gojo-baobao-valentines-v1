// Gojo-themed Valentine site interactions
// No frameworks, just vibes.

const qs = (sel) => document.querySelector(sel);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const stage = qs("#stage");

const btnRed = qs("#btnRed");
const btnBlue = qs("#btnBlue");
const btnPurple = qs("#btnPurple");
const btnYes = qs("#btnYes");

const buttonRow = qs("#buttonRow");

const gojoRed = qs("#gojoRed");
const gojoBlue = qs("#gojoBlue");
const cracks = qs("#cracks");
const flash = qs("#flash");

const orbRed = qs("#orbRed");
const orbBlue = qs("#orbBlue");
const orbPurple = qs("#orbPurple");

const final = qs("#final");
const confettiLayer = qs("#confettiLayer");
const heartsLayer = qs("#heartsLayer");

let redChosen = false;
let blueChosen = false;
let purpleDone = false;
let celebrationStarted = false;

function showCinematic(imgEl){
  imgEl.classList.add("is-visible");
  // remove after animation ends so it can be reused if needed
  imgEl.addEventListener("animationend", () => imgEl.classList.remove("is-visible"), { once: true });
}

function activateOrb(orbEl){
  orbEl.classList.add("is-active");
}

function removeButton(btnEl){
  btnEl.style.opacity = "0";
  btnEl.style.pointerEvents = "none";
  btnEl.style.transform = "translateY(6px) scale(.98)";
  setTimeout(() => btnEl.remove(), 380);
}

function maybeRevealPurple(){
  if(redChosen && blueChosen){
    // Hide row container if still present
    buttonRow.style.pointerEvents = "none";
    cracks.classList.add("is-visible");
    btnPurple.classList.add("is-visible");
  }
}

btnRed.addEventListener("click", async () => {
  if(redChosen) return;
  redChosen = true;

  removeButton(btnRed);

  showCinematic(gojoRed);
  await delay(320);
  activateOrb(orbRed);

  // Let cinematic play a bit, then ensure only orb remains
  await delay(1600);
  maybeRevealPurple();
});

btnBlue.addEventListener("click", async () => {
  if(blueChosen) return;
  blueChosen = true;

  removeButton(btnBlue);

  showCinematic(gojoBlue);
  await delay(320);
  activateOrb(orbBlue);

  await delay(1600);
  maybeRevealPurple();
});

btnPurple.addEventListener("click", async () => {
  if(purpleDone) return;
  if(!(redChosen && blueChosen)) return;

  purpleDone = true;
  btnPurple.style.pointerEvents = "none";
  btnPurple.style.opacity = "0";

  stage.classList.add("is-shaking");
  await delay(550);
  stage.classList.remove("is-shaking");

  // Fly orbs to center
  orbRed.classList.add("fly-center");
  orbBlue.classList.add("fly-center");
  await delay(900);

  // Replace with orbiting pair (cleaner orbit animation)
  const orbitWrap = document.createElement("div");
  orbitWrap.className = "orbit-wrap is-orbiting";
  orbitWrap.setAttribute("aria-hidden", "true");

  const r = document.createElement("img");
  r.src = orbRed.getAttribute("src");
  r.className = "orbit-child red";
  r.alt = "";

  const b = document.createElement("img");
  b.src = orbBlue.getAttribute("src");
  b.className = "orbit-child blue";
  b.alt = "";

  orbitWrap.appendChild(r);
  orbitWrap.appendChild(b);
  stage.appendChild(orbitWrap);

  // Hide the original orbs during orbit
  orbRed.style.opacity = "0";
  orbBlue.style.opacity = "0";
  orbRed.classList.remove("is-active");
  orbBlue.classList.remove("is-active");

  await delay(3000);

  // Merge: remove orbiting, pop purple orb
  orbitWrap.remove();

  orbPurple.classList.add("is-active");
  // Overlay cracks on purple orb vibe (keep cracks visible but soften)
  cracks.style.opacity = ".55";

  await delay(450);

  // Explosion flashbang
  flash.classList.add("is-flashing");
  await delay(1100);
  flash.classList.remove("is-flashing");

  // Reveal final state
  stage.classList.add("is-purple");
  cracks.classList.remove("is-visible");
  orbPurple.style.opacity = "0";
  orbPurple.classList.remove("is-active");
  await delay(120);

  final.classList.add("is-visible");
  final.setAttribute("aria-hidden", "false");
});

btnYes.addEventListener("click", async () => {
  if(celebrationStarted) return;
  celebrationStarted = true;

  btnYes.style.transform = "translateY(-2px) scale(1.02)";
  btnYes.style.filter = "brightness(1.05)";
  await delay(120);
  btnYes.style.transform = "";

  burstConfetti(170);
  startHearts(34);

  // Keep spawning lightly for a few seconds
  for(let i=0;i<4;i++){
    await delay(450);
    burstConfetti(60);
  }
});

function burstConfetti(count){
  const colors = ["#ff2b2b", "#2b6bff", "#a13bff"];
  const w = window.innerWidth;

  for(let i=0;i<count;i++){
    const piece = document.createElement("div");
    piece.className = "confetti";

    const left = Math.random() * w;
    const sizeW = 6 + Math.random() * 10;
    const sizeH = 10 + Math.random() * 14;
    const dur = 1.6 + Math.random() * 1.9;
    const delayMs = Math.random() * 220;
    const drift = (Math.random() * 2 - 1) * 160;

    piece.style.left = `${left}px`;
    piece.style.width = `${sizeW}px`;
    piece.style.height = `${sizeH}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${dur}s`;
    piece.style.animationDelay = `${delayMs}ms`;
    piece.style.borderRadius = `${Math.random() < 0.35 ? 999 : 2}px`;
    piece.style.transform = `translateX(${drift}px) rotate(${Math.random()*180}deg)`;

    confettiLayer.appendChild(piece);

    piece.addEventListener("animationend", () => piece.remove());
  }
}

function startHearts(count){
  const w = window.innerWidth;
  for(let i=0;i<count;i++){
    spawnHeart(w, i * 120);
  }
}

function spawnHeart(w, delayMs){
  const img = document.createElement("img");
  img.className = "heart";
  img.src = "assets/heart.png";
  img.alt = "";

  const left = Math.random() * (w - 80);
  const dur = 3.2 + Math.random() * 2.2;
  const size = 36 + Math.random() * 64;
  const spin = (Math.random() * 2 - 1) * 35;

  img.style.left = `${left}px`;
  img.style.width = `${size}px`;
  img.style.animationDuration = `${dur}s`;
  img.style.animationDelay = `${delayMs}ms`;
  img.style.transform = `rotate(${spin}deg)`;

  heartsLayer.appendChild(img);
  img.addEventListener("animationend", () => img.remove());
}

// Quality-of-life: allow keyboard triggers
document.addEventListener("keydown", (e) => {
  if(e.key === "Enter" || e.key === " "){
    const active = document.activeElement;
    if(active && active.tagName === "BUTTON") return;
  }
});
