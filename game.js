


const gun = document.createElement('img');
gun.src = './guns/gun1.png';
gun.classList.add('gun');
document.body.appendChild(gun);
const circleBounds = gun.getBoundingClientRect();

let posXX = 0;
let posYY = 0;
let mouseX = 0;
let mouseY = 0;
let blastY = 0;
let blastX = 0;
let enemy;
let scoreNumber = 0;
let enemiesNumber = 0;
const blasting = [{transform: 'translateY(0px)   rotate(-90deg) '},{ transform : 'translateY(-2000px)  rotate(-90deg)'}] 

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    whoosh();
});


const whoosh1 = new Audio('./soundeffects/swing1.mp3');
const whoosh2 = new Audio('./soundeffects/swing2.mp3');
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
}




function moveCursor() {
    let ease =0.1;
    let targetX = mouseX - (circleBounds.left + 35); // Adjusted offset for gun center
    let targetY = mouseY - (circleBounds.top + 16); // Adjusted offset for gun center
    posXX += (targetX - posXX) * ease;
    posYY += (targetY - posYY) * ease;
    gun.style.cursor = 'none';
    gun.style.transform = `translate3d(${posXX}px, ${posYY}px, 0)
    rotate(-90deg)`;
}
setInterval(moveCursor, 1);

document.addEventListener('click',Shoot);

function Shoot() {

    gun.style.transform = `translate3d(${posXX}px, ${posYY += 100}px, 0) rotate(-90deg)`;

    // Create a blast
    const blast = document.createElement('img');
    blast.src = './energyblasts/blast.png';
    blast.classList.add('blast');// Apply the blast class to trigger the animation


    // Position the blast
    blastX = posXX + 26;
    blastY = posYY  - 50;
    blast.style.position = 'absolute';
    blast.style.left = blastX + 'px';
    blast.style.top = blastY + 'px';
    document.body.appendChild(blast);
    // Add blast to the document
    blast.animate(blasting,{duration:1200,fill:"forwards"});
    // Sound effect GO BOM BOM BOM BOM
    const sound_effect = new Audio("./soundeffects/soundeffect.mp3")
    sound_effect.play();


    // Remove the blast after a short delay
    setTimeout(() => {
        document.body.removeChild(blast);
    }, 1200); // Adjust the delay as needed

}

function Random() {
    return Math.floor(Math.random() * 800)
}

function Enemy () {

    enemy = document.createElement('img')
    enemy.classList.add('enemy');
    enemy.src = './enemies/enemy.png'
    const enemyRect = enemy.getBoundingClientRect();
    enemy.style.left = Random() + 'px';
    enemy.style.top = Random() + 'px';
    document.body.appendChild(enemy);


}

Enemy()

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
            return true; 
        }
    }
    
    return false; 
}


function update() {

    let blast = document.querySelectorAll('.blast');
    let enemy = document.querySelector('.enemy');
    if (blast && enemy) {
        if (checkCollision(blast, enemy)) {
            Explosion(); 
            document.body.removeChild(enemy); // Remove enemy
            Enemy();
            scoreNumber += 10;
            enemiesNumber++;
            UpdateScore();
        }
    }
}

setInterval(update,1)

function Explosion() {
    const video = document.createElement('video');
    video.classList.add('explosion');
    video.src = "./soundeffects/explosion.mp4";
    video.autoplay = true;
    document.body.appendChild(video)

    const explosion = new Audio('./soundeffects/explosion.mp3');
    explosion.volume = 0.3;
    explosion.play()

    const enemyRect = enemy.getBoundingClientRect();
    console.log(enemyRect)
    
    video.style.position = 'absolute';
    video.style.top = enemyRect.top + 'px';
    video.style.left = enemyRect.left + 'px';

    setTimeout(() => {
        document.body.removeChild(video);
    }, 1200)
}

function UpdateScore() {
    let score = document.getElementById('score');
    let enemies = document.getElementById('enemies');

    enemies.innerText = enemiesNumber + " airships elimnated";
    score.innerText = "SCORE : " + scoreNumber;
    console.log(scoreNumber)
}

