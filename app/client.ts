import { mainContext } from 'app/utils/canvas';
import { initializeGame } from 'app/initialize';

initializeGame();

const state = {
    horizontal: 400,
    vertical: 600,
    isADown: false
    isDDown: false
    isWDown: false
    isSDown: false
};

function update(): void {
    if (state.isADown) {
        state.horizontal = state.horizontal - 10;
    }
    if (state.isDDown) {
        state.horizontal = state.horizontal + 10;
    }
    if (state.isWDown) {
        state.vertical = state.vertical - 10;
    }
    if (state.isSDown) {
        state.vertical = state.vertical + 10;
    }
}

function render(context: CanvasRenderingContext2D): void {
    
    // Draw a black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, 800, 800);
    
    // Draw character
    context.beginPath();
    context.arc(state.horizontal, state.vertical, 20, 0, 2*Math.PI);
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