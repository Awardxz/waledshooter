const main = document.querySelector(".main");
const enemiesContainer = document.createElement("div");
enemiesContainer.classList.add("enemiesContainer");
enemiesContainer.style.height = "100%";
enemiesContainer.style.position = "relative";
main.appendChild(enemiesContainer);

const DeathBox = document.createElement("div");
DeathBox.classList.add("DeathBox");
let heartElement;
let heartCounter = -1;
const heart = document.querySelector(".heart");
function createHearts() {
  for (let i = 0; i < 3; i++) {
    const createHearts = document.createElement("img");
    createHearts.classList.add("hearts");
    if (heartCounter == -1) createHearts.src = "./images/heart.png";
    heart.appendChild(createHearts);
  }
  heartElement = document.querySelectorAll(".hearts");
}
createHearts();

const gun = document.createElement("img");
gun.classList.add("gun");
gun.src = "./guns/gun1.png";

main.appendChild(enemiesContainer);
main.appendChild(gun);
main.appendChild(DeathBox);
const circleBounds = gun.getBoundingClientRect();
const DeathBounds = DeathBox.getBoundingClientRect();

let posXX = 0;
let posYY = 0;
let mouseX = 0;
let mouseY = 0;
let blastX = 0;
let enemy;
let scoreNumber = 0;
let enemiesNumber = 0;
let gameOver = false;
const increaseGameSpeed = (enemiesKilled) =>
  enemiesKilled < 50 ? 1 : enemiesKilled / 50;

const blasting = [
  { transform: "translateY(0px)   rotate(-90deg) " },
  { transform: `translateY(-${2e3}px)  rotate(-90deg)` },
];

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  whoosh();
});

const whoosh1 = new Audio("./soundeffects/swing1.mp3");
const whoosh2 = new Audio("./soundeffects/swing2.mp3");
whoosh1.volume = 0.3;
whoosh2.volume = 0.3;
let prevMouseX = mouseX;

const whoosh = () => {
  if (mouseX < prevMouseX - 5) {
    whoosh1.play();
  } else if (mouseX > prevMouseX + 5) {
    whoosh2.play();
  }
  prevMouseX = mouseX;
};

function moveCursor() {
  if (!gameOver) {
    let ease = 0.1;
    let targetX = mouseX - (circleBounds.left + 35); // Adjusted offset for gun center
    let targetY = mouseY - (circleBounds.top + 16); // Adjusted offset for gun center
    posXX += (targetX - posXX) * ease;
    posYY += (targetY - posYY) * ease;
    gun.style.cursor = "none";
    gun.style.transform = `translate(${posXX}px, 0)
    rotate(-90deg)`;
  }
}
setInterval(moveCursor, 1);

document.addEventListener("click", Shoot);

function Shoot() {
  gun.classList.add("gunAnimation");
  setTimeout(() => {
    gun.classList.remove("gunAnimation");
  }, 100);
  // Create a blast
  const blast = document.createElement("img");
  blast.src = "./energyblasts/blast.png";
  blast.classList.add("blast");

  // Position the blast
  blastX = posXX + 26;
  blast.style.position = "absolute";
  blast.style.left = blastX + "px";
  document.body.appendChild(blast);
  // Add blast to the document
  blast.animate(blasting, { duration: 1200, fill: "forwards" });
  // Sound effect GO BOM BOM BOM BOM
  const sound_effect = new Audio("./soundeffects/soundeffect.mp3");
  sound_effect.play();

  // Remove the blast after a short delay
  setTimeout(() => {
    document.body.removeChild(blast);
  }, 1200); // Adjust the delay as needed
}

function Random() {
  return Math.floor(Math.random() * 101);
}

let enemyIndex = 1;

function Enemy(container) {
  enemy = document.createElement("img");
  enemy.classList.add(`enemy-${enemyIndex++}`);
  enemy.src = "./enemies/enemy.png";
  enemy.style.left = `${Random()}%`;
  enemy.style.top = "0px";

  const enemiesMovementStyle = [
    { transform: "translateY(0px)" },
    { transform: `translateY(+${800 * increaseGameSpeed(enemiesNumber)}px)` },
  ];

  enemy.animate(enemiesMovementStyle, { duration: 12000, fill: "forwards" });
  container.appendChild(enemy);

  //   setTimeout(() => {
  //     enemiesContainer.replaceChildren([])
  //   }, 12000) // Adjust the delay as needed
}

function generateEnemies(container) {
  for (let i = 0; i <= 10; i++) Enemy(container);
}

generateEnemies(enemiesContainer);

function checkCollision(blast, enemy) {
  for (let i = 0; i < blast.length; i++) {
    let blastRect = blast[i].getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (
      blastRect.left < enemyRect.right &&
      blastRect.right > enemyRect.left &&
      blastRect.top < enemyRect.bottom &&
      blastRect.bottom > enemyRect.top
    ) {
      document.body.removeChild(blast[i]);
      return true;
    }
  }

  return false;
}

function checkEnemyCollisionBox(enemy) {
  for (let i = 0; i < enemy.length; i++) {
    let enemyRect = enemy[i].getBoundingClientRect();
    if (
      DeathBounds.left < enemyRect.right &&
      DeathBounds.right > enemyRect.left &&
      DeathBounds.top < enemyRect.bottom &&
      DeathBounds.bottom > enemyRect.top
    ) {
      return true;
    }
  }
  return false;
}

function update() {
  let blast = document.querySelectorAll(".blast");
  let enemies = document.querySelectorAll(`img[class^=enemy-]`);

  for (let i = 0; i < enemies.length; i++) {
    if (blast && enemies[i] && checkCollision(blast, enemies[i])) {
      console.log(enemies[i]);
      Explosion(enemies[i]);
      enemiesContainer.removeChild(enemies[i]); // Remove enemy
      setTimeout(() => {
        Enemy(enemiesContainer);
      }, 1000);
      scoreNumber += 10;
      enemiesNumber++;
      UpdateScore();
    }
    if (checkEnemyCollisionBox(enemies)) {
      enemiesContainer.removeChild(enemies[i]);
      heartCounter++;
      switch (heartCounter) {
        case 0:
          heartElement[heartCounter].src = "./images/heartdestroyed.png";
          break;
        case 1:
          heartElement[heartCounter].src = "./images/heartdestroyed.png";
          break;
        case 2:
          heartElement[heartCounter].src = "./images/heartdestroyed.png";
        default:
          console.log(heartCounter);gameOver = true;

          enemiesContainer.innerHTML = "";
          
            RetryButton();
          break;
      }
    }
  }
}

setInterval(update, 1);

function Explosion(enemy) {
  const video = document.createElement("video");
  video.classList.add("explosion");
  video.src = "./soundeffects/explosion.mp4";
  video.autoplay = true;
  document.body.appendChild(video);

  const explosion = new Audio("./soundeffects/explosion.mp3");
  explosion.volume = 0.3;
  explosion.play();

  const enemyRect = enemy.getBoundingClientRect();

  video.style.position = "absolute";
  video.style.top = enemyRect.top + "px";
  video.style.left = enemyRect.left + "px";

  setTimeout(() => {
    document.body.removeChild(video);
  }, 1200);
}

function UpdateScore() {
  let score = document.getElementById("score");
  let enemies = document.getElementById("enemies");
  enemies.innerText = enemiesNumber + " airships elimnated";
  score.innerText = "SCORE : " + scoreNumber;
}

let button; // Declare button globally
const restart = document.querySelector(".restart");

function RetryButton() {
  button = document.createElement("button");
  button.classList.add("restartStyle");
  button.setAttribute("type", "button");
  button.setAttribute("id", "restart");
  button.innerText = "YOU LOST (click to restart)";
  restart.appendChild(button);
}

function checkGame() {
  if (gameOver) {
    

    document.addEventListener("click", Retry);
  } else if (!gameOver) {
    document.removeEventListener("click", Retry);
  }
}
setInterval(checkGame, 100);

function Retry() {
  restart.innerHTML = "";
  heartCounter = -1;
  enemiesContainer.innerHTML = "";
  heart.innerHTML = "";
  createHearts();
  generateEnemies(enemiesContainer);
  enemiesNumber = 0;
  scoreNumber = 0;
  UpdateScore();
  gameOver = false;
  console.log("Input received");
}
