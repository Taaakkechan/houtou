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
        r: 15,
        hp: 15,
        c: 0,
    };
}
function getInitialBossState() {
    return {
        x: 0,
        y: 30,
        r: 30,
        c: 50,
        c2: 0,
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
    score: 0,
    t: 0,
    
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
        state.player.x = state.player.x - 7.5;
    }
    if (state.isDDown) {
        state.player.x = state.player.x + 7.5;
    }
    if (state.isWDown) {
        state.player.y = state.player.y - 7.5;
    }
    if (state.isSDown) {
        state.player.y = state.player.y + 7.5;
    }

    for (let i = 0; i < state.bullets.length; i++){
       
        const bullet = state.bullets[i];
         
         bullet.x = bullet.x + bullet.dx;
         bullet.y = bullet.y + bullet.dy;
        
        //if the bullet touches player, bullet disapears

        const l = state.player.r + bullet.r
        const dx = state.player.x - bullet.x
        const dy = state.player.y - bullet.y

        if (l * l > dx * dx + dy * dy){
            
            state.bullets.splice(i--, 1);
            //state.player.c = 37.5
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
        
        const score = state.score

        if (score > 0 && score <= 1300) {
            addPhase1();
            if (score > 700) {
                state.boss.c = 25 - (score - 700)/20
                
            } else {
                state.boss.c = 25
            }
        } else if (score > 1800 && score <= 1820) {
            addPhase2();
        } else if (score > 1830 && score <= 1840) {
            addPhase3();
        } else if (score > 1860 && score <= 1880) {
            addPhase2();
        } else if (score > 1950 && score <= 2100) {
            addPhase4();
            state.boss.c = 25
        } else if (score > 2000 && score <= 2800) {
            addPhase5();
            state.t++;
            state.boss.c = 5
        } else if (score > 2800 && score <= 3600) {
            addPhase6();
            state.t++;
            state.boss.c = 5
        } if (state.boss.c2 <= 0) {
            if (score > 2400 && score <= 3600) {
                addPhase7(); 
                state.boss.c2 = 15
            } 
            if (score > 2000 && score <= 3600) {
                addPhase8();
                state.boss.c2 = 15
            } 
        } else {
                state.boss.c2 --;
            } 
    } else {
        state.boss.c --;
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
    state.player.c = state.player.c - 1


    if (!state.gameOver) {
        
        const boss = state.boss
        const t = state.score

        if (t > 0 && t <= 500) {
            boss.x = boss.x + 1.6
        } else if (t <= 600) {
            boss.x = boss.x - 5
        } else if (t <= 750) {
            boss.x = boss.x - 2.5
        } else if (t <= 800) {
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

    for (let i = 0; i < 3; i++){
            state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 15,
            dx: Math.cos((i + 2)/6 * Math.PI) * 8,
            dy: Math.sin((i + 2)/6 * Math.PI) * 8,
            c: 'orange'
            });
    }
    state.bullets.push({
        x: state.boss.x,
        y: state.boss.y,
        r: 10,
        dx: (state.player.x - state.boss.x) / 100,
        dy: (state.player.y - state.boss.y) / 100,
        c: 'green'
    });
    for (let i = 0; i < 2; i++){
            state.bullets.push({
            x: 200,
            y: 10,
            r: 5,
            dx: Math.cos((i + 1)/3 * Math.PI) * 10 * (Math.random() + 0.25),
            dy: Math.sin((i + 1)/3 * Math.PI) * 10 * (Math.random() + 0.25),
            });
    }
    for (let i = 0; i < 2; i++){
            state.bullets.push({
            x: 600,
            y: 10,
            r: 5,
            dx: -Math.cos((i + 1)/3 * Math.PI) * 10 * (Math.random() + 0.25),
            dy: Math.sin((i + 1)/3 * Math.PI) * 10 * (Math.random() + 0.25),
            });
    }
}

function addPhase2(){
   
     for (let i = 0; i < 8; i++){

        state.bullets.push({
        x: state.boss.x,
        y: state.boss.y,
        r: 15,
        dx: Math.cos(i/4 * Math.PI) * 16,
        dy: Math.sin(i/4 * Math.PI) * 16,
        c: 'orange'
        });
    }
}

function addPhase3(){

     for (let i = 0; i < 8; i++){

        state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 15,
            dx: Math.cos((i/4 + 1/8)* Math.PI) * 30,
            dy: Math.sin((i/4 + 1/8)* Math.PI) * 30,
            c: 'orange'
        });
    }
}

function addPhase4(){

     for (let i = 0; i < 20; i++){

        state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 5,
            dx: Math.cos((i/10)* Math.PI) * 5 * (Math.random() + 0.25),
            dy: Math.sin((i/10)* Math.PI) * 5 * (Math.random() + 0.25),
        });
    }
}

function addPhase5(){

     for (let i = 0; i < 3; i++){

        state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 15,
            dx: Math.cos((i/1.5 + state.t/50)* Math.PI) * 5,
            dy: Math.sin((i/1.5 + state.t/50)* Math.PI) * 5,
            c: 'lightgray'
        });
    }
}
function addBulletCircle(bulletCount: number, speed = 5, theta = 0, bulletProps: Partial<Bullet> = {}): void {
     for (let i = 0; i < bulletCount; i++) {
        const shotTheta = theta + i / bulletCount * 2 * Math.PI;
        state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 15,
            dx: speed * Math.cos(shotTheta),
            dy: speed * Math.sin(shotTheta),
            ...bulletProps,
        });
    }
}
function addPhase6(){
    addBulletCircle(6, 5, Math.PI * state.t / 50, {c: 'lightgray', r: 15});
     /*for (let i = 0; i < 6; i++){

        state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 15,
            dx: Math.cos((i/3 + state.t/50)* Math.PI) * 5,
            dy: Math.sin((i/3 + state.t/50)* Math.PI) * 5,
            c: 'lightgray'
        });
    }*/
}
function addPhase7(){

     addBulletCircle(8, 2.5, Math.random() * 0.0001, {x: 100, y: 100, c: 'orange', r: 10});
     /*for (let i = 0; i < 8; i++){

        state.bullets.push({
            x: 100,
            y: 100,
            r: 10,
            dx: Math.cos((i/4 + Math.random() * 0.0001)* Math.PI) * 2.5,
            dy: Math.sin((i/4 + Math.random() * 0.0001)* Math.PI) * 2.5,
            c: 'orange'
        });
    }*/
    
    addBulletCircle(8, 2.5, Math.random() * 0.0001, {x: 700, y: 100, r: 10});
    
    addBulletCircle(8, 2.5, Math.random() * 0.0001, {x: 100, y: 700, c: 'green', r: 10});
    
    addBulletCircle(8, 2.5, Math.random() * 0.0001, {x: 700, y: 700, c: 'purple', r: 10});
    
}
function addPhase8(){

     for (let i = 0; i < 20; i++){

        state.bullets.push({
            x: 800 - state.player.x,
            y: 800 - state.player.y,
            r: 10,
            dx: Math.cos((i/10 + state.t/1000)* Math.PI) * 2.5,
            dy: Math.sin((i/10 + state.t/1000)* Math.PI) * 2.5,
            c: 'red'
        });
    }
}

//setInterval(addBullet, 1000);

function render(context: CanvasRenderingContext2D): void {
    
    
    const score = state.score

    // Draw a black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, 800, 800);
    
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

    // Draw boss
    context.beginPath();
    context.arc(state.boss.x, state.boss.y, state.boss.r, 0, 2*Math.PI);
    context.fillStyle = 'blue';
    context.fill();


    //Draw tuurets
    if (score > 2300 && score <= 3600) {
        context.beginPath();
        context.arc(700, 100, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (score > 2300 && score <= 3600) {
        context.beginPath();
        context.arc(100, 700, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (score > 2300 && score <= 3600) {
        context.beginPath();
        context.arc(100, 100, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (score > 2300 && score <= 3600) {
        context.beginPath();
        context.arc(700, 700, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (score > 2000 && score <= 3600) {
        context.beginPath();
        context.arc(800 - state.player.x, 800 - state.player.y, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    } 
    
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