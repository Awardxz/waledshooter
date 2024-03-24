const gun = document.createElement('img');
gun.src = './gun4.png';
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
const blasting = [{transform: 'translateY(0px)   rotate(-90deg)'/* Starting position */},{ transform : 'translateY(-2000px)  rotate(-90deg)' /* Ending position */ }]

document.addEventListener('mousemove', setCoords);

function setCoords(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
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

document.addEventListener('click',Shoot)

function Shoot() {
    // Apply knockback
    let knockbackX = posXX - 100;
    let knockbackY = posYY - 100;
    
    gun.style.transform = `translate3d(${posXX}px, ${posYY += 100}px, 0) rotate(-90deg)`;

    // Create a blast
    const blast = document.createElement('img');
    blast.src = './blast.png';
    blast.classList.add('blast');// Apply the blast class to trigger the animation


    // Position the blast
    blastX = posXX + 25;
    blastY = posYY  - 100;
    blast.style.position = 'absolute';
    blast.style.left = blastX + 'px';
    blast.style.top = blastY + 'px';
    document.body.appendChild(blast);
    // Add blast to the document
    blast.animate(blasting,{duration:1200,fill:"forwards"});
    // Sound effect GO BOM BOM BOM BOM
    const sound_effect = new Audio("soundeffect.mp3")
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
    enemy.src = './enemy.png'
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

    // Check collision between blast and enemy
    let blast = document.querySelectorAll('.blast');
    let enemy = document.querySelector('.enemy');
    if (blast && enemy) {
        if (checkCollision(blast, enemy)) {
            document.body.removeChild(enemy); // Remove enemy
            Enemy();
            scoreNumber+= 10;
            UpdateScore();
        }
    }
  
    
}

setInterval(update,1)

function UpdateScore() {
    let score = document.getElementById('score');
    score.innerText = "SCORE : " + scoreNumber;
    console.log(scoreNumber)
}




