import { mainContext } from 'app/utils/canvas';
import { initializeGame } from 'app/initialize';

initializeGame();

interface Bullet {
    x: number
    y: number
    r: number
    dx: number
    dy: number
    c?: string
}

function getInitialPlayerState() {
    return {
        x: 400,
        y: 600,
        r: 20,
        hp: 3,
        c: 0,
    };
}
function getInitialBossState() {
    return {
        x: 0,
        y: 30,
        r: 30,
        c: 50,
        p: [
            0,
            1,
            2,
        ]
    };
}
const state = {
    
    gamestart: false,
    gameOver: false,
    pause: false,

    player: getInitialPlayerState(),
    isADown: false,
    isDDown: false,
    isWDown: false,
    isSDown: false,
    boss: getInitialBossState(), 
    //minion1: getInitialMinion1State(), 
    bullets: [] as Bullet[], 
    score: 0
    
};
// @ts-ignore
window['state'] = state;

function update(): void {

    if (state.pause) {
        return;
    }
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
            
            if (state.player.c <= 0) {
                state.player.hp--;
                state.player.c = 37.5
            }     
        }
    }
    if (state.player.hp <= 0) {
        state.gameOver = true
    }
    if (state.gameOver) {
            state.player = getInitialPlayerState();
            state.boss = getInitialBossState();
            state.bullets = [];
            //state.score = 0
    }
    if (state.boss.c <= 0) {
        if (state.score > 0 && state.score <= 1300) {
            addPhase1();
            if (state.score > 700) {
                state.boss.c = 25 - (state.score - 700)/20
                
            } else {
                state.boss.c = 25
            }
        } else if (state.score > 1500 && state.score <= 3000) {
            addPhase2();
        }
    } else {
        state.boss.c --;
    }

    // Delete bullets that go off of the screen.
    state.bullets = state.bullets.filter(b => 
        b.y > -100 && b.y < 900 && b.x > -100 && b.x < 900
    );

    //stopping the player from getting off the screen
    if (state.player.x < 10 + state.player.r) {
        state.player.x = 10 + state.player.r
    }
    if (state.player.x > 790 - state.player.r) {
        state.player.x = 790 - state.player.r
    }
    if (state.player.y < 10 + state.player.r) {
        state.player.y = 10 + state.player.r
    }
    if (state.player.y > 790 - state.player.r) {
        state.player.y = 790 - state.player.r
    }
    state.score = state.score + 1
    state.player.c = state.player.c - 1


    if (!state.gameOver) {
        
        const boss = state.boss
        const t = state.score

        if (t > 0 && t <= 500) {
            boss.x = boss.x + 1.6
        } else if (t <= 600) {
            boss.x = boss.x - 5
        } else if (t <= 700) {
            boss.x = boss.x - 2.5
        } else if (t <= 1000) {
            boss.x = 400
            boss.y = 0
        } else if (t <= 1500) {
            boss.y = boss.y + 10
        } else if (t <= 3000) {
            boss.x = 400
            boss.y = 400
            if (t >= 1500 && t <= 1533) {
                boss.r = 0
            } else if (t <= 1566) {
                boss.r = 10
            } else if (t <= 1599) {
                boss.r = 20
            } else if (t <= 1633) {
                boss.r = 30
            } else if (t <= 1666) {
                boss.r = 40
            } else if (t <= 1700) {
                boss.r = 50
            }
        }
    }
}

function addPhase1(){

    state.bullets.push({
        x: state.boss.x,
        y: state.boss.y,
        r: 15,
        dx: Math.cos(2/3 * Math.PI) * 10,
        dy: Math.sin(2/3 * Math.PI) * 10,
        c: 'orange'
    });
    state.bullets.push({
        x: state.boss.x,
        y: state.boss.y,
        r: 15,
        dx: Math.cos(0.5 * Math.PI) * 10,
        dy: Math.sin(0.5 * Math.PI) * 10,
        c: 'orange'
    });
    state.bullets.push({
        x: state.boss.x,
        y: state.boss.y,
        r: 15,
        dx: Math.cos(1/3 * Math.PI) * 10,
        dy: Math.sin(1/3 * Math.PI) * 10,
        c: 'orange'
    });
    state.bullets.push({
        x: state.boss.x,
        y: state.boss.y,
        r: 10,
        dx: (state.player.x - state.boss.x) / 100,
        dy: (state.player.y - state.boss.y) / 100,
        c: 'green'
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
        x: 700,
        y: 10,
        r: 5,
        dx: -2.5 * 0.7,
        dy: 10 * 0.7,
    });
}

function addPhase2(){
}



//setInterval(addBullet, 1000);

function render(context: CanvasRenderingContext2D): void {
    
    // Draw a black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, 800, 800);
    
     // Draw boss
    context.beginPath();
    context.arc(state.boss.x, state.boss.y, state.boss.r, 0, 2*Math.PI);
    context.fillStyle = 'blue';
    context.fill();
    
    //Draw Bullets
    for (let i = 0; i < state.bullets.length; i++){
       
        context.beginPath();
        context.arc(state.bullets[i].x, state.bullets[i].y, state.bullets[i].r, 0, 2*Math.PI);
        context.fillStyle = state.bullets[i].c || 'white';
        context.fill();
    }
        // Draw hpBar
    for (let i = 0; i < state.player.hp; i++){
        
        context.fillStyle = 'red';
        context.fillRect(700, (i + 1) * 50, 50, 20);

    }
   
    // Draw character
    if (state.player.c <= 0) {
        context.beginPath();
        context.arc(state.player.x, state.player.y, state.player.r, 0, 2*Math.PI);
        context.fillStyle = 'yellow';
        context.fill();
    }else{
        context.beginPath();
        context.arc(state.player.x, state.player.y, state.player.r, 0, 2*Math.PI);
        context.fillStyle = 'blue';
        context.fill();
    }

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
    if (state.pause){
        context.fillStyle = 'red';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '50px sans-serif';
        context.fillText('PAUSE', 400, 400);
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
    if (state.gameOver) {
        return;
    }
    if (state.gamestart) {
        if (event.which === 13) {   // Enter
            if (state.pause) {
                state.pause = false
            } else {
                state.pause = true
            }
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