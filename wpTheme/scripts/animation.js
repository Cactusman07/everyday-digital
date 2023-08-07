const elts = {
  text1: document.getElementById("text1"),
  text2: document.getElementById("text2")
};

const backgrounds = [
  document.getElementById("background1"),
  document.getElementById("background2"),
  document.getElementById("background3"),
  document.getElementById("background4"),
  document.getElementById("background5"),
  document.getElementById("background6")
]

const texts = [
  "Digital",
  "Automation",
  "Design",
  "Reliability",
  "Innovation",
  "Mentoring",
  "Strategy"
];

const morphTime = 2;
const cooldownTime = 0.5;

let textIndex = texts.length - 1;
let backgroundIndex = 0;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
  }

  setMorph(fraction);
}

function changeBackground(backgroundIndex){
  backgrounds.map(bg => bg.style.opacity = "0");
  if(backgroundIndex < backgrounds.length){
    backgrounds[backgroundIndex].style.opacity = "1"; 
  }
}

function setMorph(fraction) {
  elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];  
}

function doCooldown() {
  morph = 0;

  elts.text2.style.filter = "";
  elts.text2.style.opacity = "100%";

  elts.text1.style.filter = "";
  elts.text1.style.opacity = "0%";  
}

function animate() {
  requestAnimationFrame(animate);

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 1000;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
      if (shouldIncrementIndex) {
          textIndex++;          
          changeBackground(backgroundIndex);
          backgroundIndex++;
          if (backgroundIndex > backgrounds.length){
            backgroundIndex = 0;
          }
      }

      doMorph();      
  } else {
      doCooldown();
  }
}

animate();