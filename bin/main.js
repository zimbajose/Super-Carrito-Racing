const loopTime = 0.12; // Tempo de loop de jogo

var racetime = 0; //Tempo em milisegundos da corrida



function renderLoop() {
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

async function gameLoop() {

}

setInterval(gameLoop, loopTime);