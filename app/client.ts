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
        r: 10,
        hp: 5,
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
const image = new Image();

image.src = 'gfx/houtou.jpeg';

const state = {
    
    gamestart: false,
    gameOver: false,
    gameComp: false,
    pause: false,

    player: getInitialPlayerState(),
    isADown: false,
    isDDown: false,
    isWDown: false,
    isSDown: false,
    boss: getInitialBossState(), 
    bullets: [] as Bullet[], 
    score: 0,
    ten: 0,
    gt: 0,
    pht: 0,
    minions: [
        {
            x: 100,
            y: 100,
            r: 25,
            dx: 0,
            dy: 0,
            ox: 100,
            oy: 100,
            isReturning: false,
        },
        {
            x: 100,
            y: 700,
            r: 25,
            dx: 0,
            dy: 0,
            ox: 100,
            oy: 700,
            isReturning: false,
        },
        {
            x: 700,
            y: 100,
            r: 25,
            dx: 0,
            dy: 0,
            ox: 700,
            oy: 100,
            isReturning: false,
        },
        {
            x: 700,
            y: 700,
            r: 25,
            dx: 0,
            dy: 0,
            ox: 700,
            oy: 700,
            isReturning: false,
        },
    ],

};

const phase = [
    function(){
        
        const pht = state.pht
        if (state.boss.c <= 0) { 
            if (pht > 0 && pht <= 1300) {
                addPhase1();
                if (pht > 700) {
                    state.boss.c = 25 - (pht - 700)/20
                    
                } else {
                    state.boss.c = 25
                }
            }   
        } else {
            state.boss.c --;
        }
    }, 
    function() {

        const pht = state.pht
        if (state.boss.c <= 0) { 
            
            if (pht > 500 && pht <= 520) {
                
                addPhase2();

            } else if (pht > 530 && pht <= 540) {
                
                addPhase3();

            } else if (pht > 560 && pht <= 580) {
                
                addPhase2();

            } else if (pht > 650 && pht <= 800) {
                
                addPhase4();

                state.boss.c = 25
            } else if (pht > 700 && pht <= 1500) {
                
                addPhase5();
                state.ten++;
                state.boss.c = 5

            } else if (pht > 1500 && pht <= 2600) {
                
                addPhase6();
                state.ten++;
                state.boss.c = 5

            } if (state.boss.c2 <= 0) {
                
                if (pht > 1100 && pht <= 2600) {
                    
                    addPhase7(); 
                    state.boss.c2 = 15
                } 
                if (pht > 700 && pht <= 2600) {
                   
                    addPhase8();
                    state.boss.c2 = 15

                } 
            } else {
                   
                    state.boss.c2 --;
                }

        } else {
               
            state.boss.c --;
           
        }
    },
    
    function() {

        const pht = state.pht
        if (state.boss.c <= 0) {

            addPhase9();
            state.boss.c = 200

        } else {
            state.boss.c --;
        }

        if (state.boss.c2 <= 0) {

            addPhase10();
            state.boss.c2 = 200;

        } else {
            state.boss.c2--;
        }

        for (let i = 0; i < state.minions.length; i++) {

            const minion = state.minions[i];
            // If player is within aggro range pixels, move towards the player at a fixed speed.
            // At some point it will stop chasing and return to its starting point.
            // Then it can aggro again.

            //if (pht >= 500 && pht <=550 && pht >= 1000 && pht <= 1050 && pht >= 1500 && pht <= 1550) {
            if (pht >= 500 && pht <= 750) {
                
                minion.isReturning = true
            
            } else if (pht >= 1250 && pht <= 1500) {

                minion.isReturning = true

            } else {
                
                minion.isReturning = false

            }
            if (minion.isReturning){

                const dx = minion.ox - minion.x
                const dy = minion.oy - minion.y
                //const mag = Math.sqrt(dx * dx + dy * dy)

                minion.x +=  dx / 50
                minion.y +=  dy / 50
                //minion.x = (minion.ox - minion.x) 
                //minion.y = (minion.oy - minion.y) 

            } else {
                
                const dx = state.player.x - minion.x
                const dy = state.player.y - minion.y
                const mag = Math.sqrt(dx * dx + dy * dy)
                // mag = (dx ** 2 + dy ** 2) ** 0.5;

                if (mag > 0 && mag < 420) {

                    minion.x += 0.8 * dx / mag 
                    minion.y += 0.8 * dy / mag 
                }
            }

        }
    },
];



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
    if (state.gameComp) {
        return;
    }

    state.gt++;
    state.pht++;
    state.score++;
    state.player.c--;

    if (state.gt > 0 && state.gt <= 1300) {
        phase[0]();
        if (state.gt === 1300) {
            state.pht = 0
            if (state.player.hp === 5) {
                
                state.score += 2000

            } else if (state.player.hp === 4) {
                
                state.score += 1000
                state.player.hp = 5

            } else {

                state.player.hp = 5

            }
        }
    } else if (state.gt <= 4500) {
        phase[1]();
        if (state.gt === 4500) {
            state.pht = 0
            if (state.player.hp === 5) {
                
                state.score += 2000

            } else if (state.player.hp === 4) {
                
                state.score += 1000
                state.player.hp = 5

            } else {

                state.player.hp = 5
                
            }
        }
    } else if (state.gt <= 6500) {
        phase[2]();
    } else if (state.gt >= 7200) {
        state.gameComp = true
        state.score = state.score + state.player.hp * 1000

    }
    
    if (state.isADown) {
        state.player.x = state.player.x - 5;
    }
    if (state.isDDown) {
        state.player.x = state.player.x + 5;
    }
    if (state.isWDown) {
        state.player.y = state.player.y - 5;
    }
    if (state.isSDown) {
        state.player.y = state.player.y + 5;
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

     /*for (let i = 0; i < state.minions.length; i++){
       
        const minion = state.minions[i];
         
         minion.x = minion.x + minion.dx;
         minion.y = minion.y + minion.dy;
        
        //if the minion touches player, minion disapears

        const l = state.player.r + minion.r * 10
        const dx = state.player.x - minion.x 
        const dy = state.player.y - minion.y

        if (l * l > dx * dx + dy * dy){

            minion.x = (state.player.x - minion.x) / 100
            minion.y = (state.player.y - minion.y) / 100
        }
    }*/

    if (state.player.hp <= 0) {
        state.gameOver = true
    }
    if (state.gameOver) {
            state.player = getInitialPlayerState();
            state.boss = getInitialBossState();
            state.bullets = [];
            
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
    


    if (!state.gameOver) {
        
        const boss = state.boss
        const t = state.gt

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
        } else if (t >= 4000 && t <= 4033) {
                boss.r = 40
            } else if (t <= 4066) {
                boss.r = 30
            } else if (t <= 4099) {
                boss.r = 20
            } else if (t <= 4133) {
                boss.r = 10
            } else if (t <= 4166) {
                boss.r = 0
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
   
   let offset = 1/8 + Math.floor(Math.random());
     for (let i = 0; i < 8; i++){

        state.bullets.push({
        x: state.boss.x,
        y: state.boss.y,
        r: 15,
        dx: Math.cos((i/4 + offset) * Math.PI) * 16,
        dy: Math.sin((i/4 + offset) * Math.PI) * 16,
        c: 'orange'
        });
    }
}

function addPhase3(){

    let offset = Math.floor(Math.random());
     for (let i = 0; i < 8; i++){

        state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 15,
            dx: Math.cos((i/4 + offset) * Math.PI) * 30,
            dy: Math.sin((i/4 + offset) * Math.PI) * 30,
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
            dx: Math.cos((i/1.5 + state.ten/50)* Math.PI) * 5,
            dy: Math.sin((i/1.5 + state.ten/50)* Math.PI) * 5,
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
    addBulletCircle(6, 5, Math.PI * state.ten / 50, {c: 'lightgray', r: 15});
     /*for (let i = 0; i < 6; i++){

        state.bullets.push({
            x: state.boss.x,
            y: state.boss.y,
            r: 15,
            dx: Math.cos((i/3 + state.ten/50)* Math.PI) * 5,
            dy: Math.sin((i/3 + state.ten/50)* Math.PI) * 5,
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
            dx: Math.cos((i/10 + state.ten/1000)* Math.PI) * 2.5,
            dy: Math.sin((i/10 + state.ten/1000)* Math.PI) * 2.5,
            c: 'red'
        });
    }
}

function addPhase9() {

    for (let i = 0; i < 16; i++){

        state.bullets.push({
            x: state.minions[0].x,
            y: state.minions[0].y,
            r: 7.50,
            dx: Math.cos((i/8 + state.ten/1000)* Math.PI) * 1.5,
            dy: Math.sin((i/8 + state.ten/1000)* Math.PI) * 1.5,
            c: 'orange'
        });
    }


    for (let i = 0; i < 16; i++){

        state.bullets.push({
            x: state.minions[1].x,
            y: state.minions[1].y,
            r: 7.50,
            dx: Math.cos((i/8 + state.ten/1000)* Math.PI) * 1.5,
            dy: Math.sin((i/8 + state.ten/1000)* Math.PI) * 1.5,
            c: 'orange'
        });
    }


    for (let i = 0; i < 16; i++){

        state.bullets.push({
            x: state.minions[2].x,
            y: state.minions[2].y,
            r: 7.50,
            dx: Math.cos((i/8 + state.ten/1000)* Math.PI) * 1.5,
            dy: Math.sin((i/8 + state.ten/1000)* Math.PI) * 1.5,
            c: 'orange'
        });
    }

    for (let i = 0; i < 16; i++){

        state.bullets.push({
            x: state.minions[3].x,
            y: state.minions[3].y,
            r: 7.50,
            dx: Math.cos((i/8 + state.ten/1000)* Math.PI) * 1.5,
            dy: Math.sin((i/8 + state.ten/1000)* Math.PI) * 1.5,
            c: 'orange'
        });
    }
}

function addPhase10() {
    
    //let offset = 30 * Math.floor(Math.random() * 8);
    const baseSpeed = 1;
    for (let i = 0; i < 6; i++) {
        state.bullets.push({
            x: 0,
            y: 0 + 30 * Math.floor(Math.random() * 8) + i * 133,
            r: 10,
            dx: baseSpeed + Math.floor(2 * Math.random()) * 1.5,
            dy: 0,
            c: 'red'
        });
    }
    for (let i = 0; i < 6; i++) {

        state.bullets.push({
            x: 800,
            y: 0 + 30 * Math.floor(Math.random() * 8) + i * 133,
            r: 10,
            dx: -baseSpeed - Math.floor(2 * Math.random()) * 1.5,
            dy: 0,
            c: 'red'
        });
    }
    for (let i = 0; i < 6; i++) {

        state.bullets.push({
            x: 0 + 30 * Math.floor(Math.random() * 8) + i * 133,
            y: 0,
            r: 10,
            dx: 0,
            dy: baseSpeed + Math.floor(2 * Math.random()) * 1.5,
            c: 'red'
        });
    }
    for (let i = 0; i < 6; i++) {

        state.bullets.push({
            x: 0 + 30 * Math.floor(Math.random() * 8) + i * 133,
            y: 800,
            r: 10,
            dx: 0,
            dy: -baseSpeed - Math.floor(2 * Math.random()) * 1.5,
            c: 'red'
        });
    }
    /*for (let i = 0; i < 53; i++) {

        state.bullets.push({
            x: 0,
            y: 0 + i * 15,
            r: 7.5,
            dx: 2.5 + Math.random() * 0.5,
            dy: 0,
            c: 'red'
        });
    }
    for (let i = 0; i < 53; i++) {

        state.bullets.push({
            x: 800,
            y: 0 + i * 15,
            r: 7.5,
            dx: -2.5 + Math.random() * 0.5,
            dy: 0,
            c: 'red'
        });
    }
    for (let i = 0; i < 53; i++) {

        state.bullets.push({
            x: 0 + i * 15,
            y: 0,
            r: 7.5,
            dx: 0,
            dy: 2.5 + Math.random() * 0.5,
            c: 'red'
        });
    }
    for (let i = 0; i < 53; i++) {

        state.bullets.push({
            x: 0 + i * 15,
            y: 800,
            r: 7.5,
            dx: 0,
            dy: -2.5 + Math.random() * 0.5,
            c: 'red'
        });
    }*/
}

//setInterval(addBullet, 1000);

function render(context: CanvasRenderingContext2D): void {
    
    
    const gt = state.gt
    // Draw a black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, 800, 800);
    
    //Draw King
    if (state.gt >= 4200) {
        context.fillStyle = 'darkgray';
        context.fillRect(380, 380, 40, 40);
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

    // Draw boss
    context.beginPath();
    context.arc(state.boss.x, state.boss.y, state.boss.r, 0, 2*Math.PI);
    context.fillStyle = 'blue';
    context.fill();

    //Draw minions
    
    if (state.gt > 4200 && state.gt < 6700) {
        for (let i = 0; i < state.minions.length; i++){

            context.beginPath();
            context.arc(state.minions[i].x, state.minions[i].y, state.minions[i].r, 0, 2*Math.PI);
            context.fillStyle = 'purple';
            context.fill();
        }
    }

    //Draw turrets
    if (gt > 2300 && gt <= 3900) {
        context.beginPath();
        context.arc(700, 100, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (gt > 2300 && gt <= 3900) {
        context.beginPath();
        context.arc(100, 700, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (gt > 2300 && gt <= 3900) {
        context.beginPath();
        context.arc(100, 100, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (gt > 2300 && gt <= 3900) {
        context.beginPath();
        context.arc(700, 700, 15, 0, 2*Math.PI);
        context.fillStyle = 'gray';
        context.fill();
    }
    if (gt > 2000 && gt <= 3900) {
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
    if (state.gameComp) {
        context.fillStyle = 'orange';
        context.fillRect(0, 0, 800, 800);
        context.fillStyle = 'white';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '50px sans-serif';
        context.fillText('HOUTOU', 400, 400);
        context.fillStyle = 'white';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '30px sans-serif';
        context.fillText('Score: ' + state.score, 400, 500);
        context.drawImage(image,
            
            0, 0, 252, 200, 
            274, 100, 252, 200
            
        )
    }
    if (state.pause){
        context.fillStyle = 'red';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '50px sans-serif';
        context.fillText('PAUSE', 400, 400);
    }
    
    //score
    if (!state.gameComp) {
        context.fillStyle = 'white';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '40px sans-serif';
        context.fillText('Score: ' + state.score, 105, 100);
    }
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
        state.gt = 0
        state.pht = 0
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