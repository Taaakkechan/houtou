import { mainContext } from 'app/utils/canvas';
import { initializeGame } from 'app/initialize';

initializeGame();

interface Bullet {
    x: number
    y: number
    r: number
    dx: number
    dy: number
}

function getInitialPlayerState() {
    return {
        x: 400,
        y: 600,
        r: 20,
        hp: 3,
    };
}
function getInitialEnemyState() {
    return {
        x: 400,
        y: 10,
        r: 30,
        c: 100,
    };
}
const state = {
    
    gamestart: false,
    gameOver: false,

    player: getInitialPlayerState(),
    isADown: false,
    isDDown: false,
    isWDown: false,
    isSDown: false,
    enemy: getInitialEnemyState(),
    bullets: [] as Bullet[], 
    score: 0
    
};
// @ts-ignore
window['state'] = state;

function update(): void {

    if (!state.gamestart) {
        return;
    }
    if (state.gameOver) {
        return;
    }
    if (state.isADown) {
        state.player.x = state.player.x - 10;
    }
    if (state.isDDown) {
        state.player.x = state.player.x + 10;
    }
    if (state.isWDown) {
        state.player.y = state.player.y - 10;
    }
    if (state.isSDown) {
        state.player.y = state.player.y + 10;
    }

    for (let i = 0; i < state.bullets.length; i++){
       
        const bullet = state.bullets[i];
         
         bullet.x = bullet.x + bullet.dx;
         bullet.y = bullet.y + bullet.dy;
        
        //if the bullet touches player, bullet disapears

        const l = state.player.r + bullet.r
        const dx = state.player.x - bullet.x
        const dy = state.player.y - bullet.y

        if (l * l >= dx * dx + dy * dy){
            state.bullets.splice(i--, 1);
            state.player.hp--;
        }
    }
    if (state.player.hp <= 0) {
        state.gameOver = true
    }
    if (state.gameOver) {
            state.player = getInitialPlayerState();
            state.enemy = getInitialEnemyState();
            state.bullets = [];
            //state.score = 0
    }
    if (state.enemy.c <= 0) {
        addBullet();
        state.enemy.c = 25;
    }else {
        state.enemy.c --;
    }

    // Delete bullets that go off of the screen.
    state.bullets = state.bullets.filter(b => 
        b.y > -100 && b.y < 900 && b.x > -100 && b.x < 900
    );

    //stopping the player from getting off the screen
    if (state.player.x < 0 + state.player.r) {
        state.player.x = 0 + state.player.r
    }
    if (state.player.x > 800 - state.player.r) {
        state.player.x = 800 - state.player.r
    }
    if (state.player.y < 0 + state.player.r) {
        state.player.y = 0 + state.player.r
    }
    if (state.player.y > 800 - state.player.r) {
        state.player.y = 800 - state.player.r
    }
    state.score = state.score + 1
    if (!state.gamestart) {
    }
}

function addBullet(){

    state.bullets.push({
        x: 400,
        y: 10,
        r: 5,
        dx: 2.5,
        dy: 5,
    });
    state.bullets.push({
        x: 400,
        y: 10,
        r: 5,
        dx: 0,
        dy: 10,
    });
    state.bullets.push({
        x: 400,
        y: 10,
        r: 5,
        dx: -2.5,
        dy: 5,
    });
    state.bullets.push({
        x: 200,
        y: 10,
        r: 5,
        dx: 2.5 * 1.1,
        dy: 5 * 1.1,
    });
    state.bullets.push({
        x: 200,
        y: 10,
        r: 5,
        dx: -1 * 1.2,
        dy: 10 * 1.2,
    });
    state.bullets.push({
        x: 600,
        y: 10,
        r: 5,
        dx: -2.5 * 1.3,
        dy: 5 * 1.3,
    });
    state.bullets.push({
        x: 600,
        y: 10,
        r: 5,
        dx: 1 * 0.9,
        dy: 10 * 0.9,
    });
    state.bullets.push({
        x: 100,
        y: 10,
        r: 5,
        dx: 2.5 * 0.8,
        dy: 10 * 0.8,
    });
    state.bullets.push({
        x: 65,
        y: 10,
        r: 25,
        dx: 0,
        dy: 2,
    });
    state.bullets.push({
        x: 700,
        y: 10,
        r: 5,
        dx: -2.5 * 0.7,
        dy: 10 * 0.7,
    });
    state.bullets.push({
        x: 735,
        y: 10,
        r: 25,
        dx: 0,
        dy: 2,
    });
    state.bullets.push({
        x: 400,
        y: 10,
        r: 10,
        dx: (state.player.x - 400) / 100,
        dy: (state.player.y - 0) / 100,
    });
    state.bullets.push({
        x: 735,
        y: 800,
        r: 25,
        dx: 0,
        dy: -2,
    });
    state.bullets.push({
        x: 65,
        y: 800,
        r: 25,
        dx: 0,
        dy: -2,
    });
}




//setInterval(addBullet, 1000);

function render(context: CanvasRenderingContext2D): void {
    
    // Draw a black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, 800, 800);

    // Draw hpBar
    for (let i = 0; i < state.player.hp; i++){
        
        context.fillStyle = 'red';
        context.fillRect(700, (i + 1) * 50, 50, 20);

    }
    
     // Draw enemy
    context.beginPath();
    context.arc(state.enemy.x, state.enemy.y, state.enemy.r, 0, 2*Math.PI);
    context.fillStyle = 'blue';
    context.fill();
    
    //Draw Bullets
    for (let i = 0; i < state.bullets.length; i++){
       
        context.beginPath();
        context.arc(state.bullets[i].x, state.bullets[i].y, state.bullets[i].r, 0, 2*Math.PI);
        context.fillStyle = 'white';
        context.fill();
    }
   
    // Draw character
    context.beginPath();
    context.arc(state.player.x, state.player.y, state.player.r, 0, 2*Math.PI);
    context.fillStyle = 'yellow';
    context.fill();

    if (!state.gamestart) {
        context.fillStyle = 'blue';
        context.fillRect(0, 0, 800, 800);
        context.fillStyle = 'white';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '50px sans-serif';
        context.fillText('PRESS SPACE TO START', 400, 400);
    }
    if (state.gameOver) {
        context.fillStyle = 'blue';
        context.fillRect(0, 0, 800, 800);
        context.fillStyle = 'white';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '50px sans-serif';
        context.fillText('GAME OVER', 400, 400);
        context.fillStyle = 'white';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '30px sans-serif';
        context.fillText('PRESS SPACE TO START OVER', 400, 500);
    }

    //score
    context.fillStyle = 'white';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.font = '40px sans-serif';
    context.fillText('Score: ' + state.score, 100, 100);
   
}

function renderLoop(): void {
    try {
        window.requestAnimationFrame(renderLoop);
        render(mainContext);
    } catch (e) {
        console.log(e);
        debugger;
    }
}
renderLoop();
setInterval(update, 20);

document.addEventListener('keydown', event => {
    
    console.log(event.which)
    if (event.which === 65) {   // A    Change here
        state.isADown = true    
    }
    if (event.which === 68) {   // D
        state.isDDown = true
    }
    if (event.which === 87) {   // W
        state.isWDown = true
    }
    if (event.which === 83) {   // S
        state.isSDown = true
    }
    if (event.which === 32) {   // Space
        state.gamestart = true
    }
    if (state.gameOver) {
        
        if (event.which === 32) {   // Space
        state.gameOver = false
        state.score = 0
        } 
    }
})

document.addEventListener('keyup', event => {
    
    if (event.which === 65) {   // A    
        state.isADown = false    
    }
    if (event.which === 68) {   // D   
        state.isDDown = false    
    }
    if (event.which === 87) {   // W   
        state.isWDown = false    
    }
    if (event.which === 83) {   // S   
        state.isSDown = false    
    }
})