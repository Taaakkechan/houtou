import { mainContext } from 'app/utils/canvas';
import { initializeGame } from 'app/initialize';

initializeGame();

interface Bullet {
    x: number
    y: number
}

const state = {
    player: {
        x: 400,
        y: 600,
        r: 20,
    },
    
    isADown: false,
    isDDown: false,
    isWDown: false,
    isSDown: false,
    EnemyX: 400,
    EnemyY: 200,
    bullets: [] as Bullet[],
    cooldown: 0,
    
};
// @ts-ignore
window['state'] = state;

function update(): void {
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

        state.bullets[i].y = state.bullets[i].y + 10;
    }


   if (state.cooldown <= 0) {
        addBullet();
        state.cooldown = 25;
   }else {
        state.cooldown --;
   }

    // Delete bullets that go off of the screen.
    state.bullets = state.bullets.filter(b => 
        b.y > -100 && b.y < 900 && b.x > -100 && b.x < 900
    );

    //stoping the player from getting off the screen
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
}

function addBullet(){

     state.bullets.push({
        x: 400,
        y: 200,
    });
}



//setInterval(addBullet, 1000);

function render(context: CanvasRenderingContext2D): void {
    
    // Draw a black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, 800, 800);
    
     // Draw enemy
    context.beginPath();
    context.arc(state.EnemyX, state.EnemyY, 30, 0, 2*Math.PI);
    context.fillStyle = 'red';
    context.fill();
    
    //Draw Bullets
    for (let i = 0; i < state.bullets.length; i++){
       
        context.beginPath();
        context.arc(state.bullets[i].x, state.bullets[i].y, 5, 0, 2*Math.PI);
        context.fillStyle = 'white';
        context.fill();
    }
   
    // Draw character
    context.beginPath();
    context.arc(state.player.x, state.player.y, state.player.r, 0, 2*Math.PI);
    context.fillStyle = 'yellow';
    context.fill();

   
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
    
    //console.log(event.which)
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

