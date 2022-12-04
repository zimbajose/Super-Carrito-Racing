import carStats from "/bin/carritos/truemeno/stats.json" assert {type:'json'};
import trackData from "/bin/tracks/asphaltroad/specs.json" assert{type:'json'};

const loopTime = 0.15; // Tempo de loop de jogo

var listener = new window.keypress.Listener() //Leitor de teclas
var keyScope = this;

//Carregador de modelos
const gltfLoader = new THREE.GLTFLoader();



var render = new THREE.WebGLRenderer({ antialias: true });

//Camera e cenas para o menu
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();

render.setSize(window.innerWidth, window.innerHeight);
var canvas = render.domElement;

document.body.appendChild(canvas);

//Se 0 esta carregando se 1 esta em progresso se 2 esta pausada
var raceState  = 0;

//Loop de renderizacao
function renderLoop() {
    render.render(scene,camera)
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

var keyboard_events;
//Inicia loop de execução
setInterval(executionLoop,loopTime);
//Loop de execução
async function executionLoop()
{
    if(raceState==1){
        race.loop();
    }
    else if(raceState==0){
        if(race.loaded()){
            var car = race.startRace();
            
            keyboard_events = listener.register_many([
                {
                    "keys" : "w",
                    "is_exclusive" : true,
                    //Acelera o carro
                    "on_keydown": function(){
                        car.accelerating = true;
                    },
                    "on_keyup" : function(){
                        car.accelerating = false;
                    },
                    "this": keyScope
                },
                {
                    "keys" : "s",
                    "is_exclusive" : true,
                    //Acelera o carro
                    "on_keydown": function(){
                        car.braking = true;
                    },
                    "on_keyup" : function(){
                        car.braking = false;
                    },
                    "this": keyScope
                },
                {
                    "keys" : "a",
                    "is_exclusive" : true,
                    //Acelera o carro
                    "on_keydown": function(){
                        car.leftTurning = true;
                    },
                    "on_keyup" : function(){
                        car.leftTurning = false;
                    },
                    "this": keyScope
                },
                {
                    "keys" : "d",
                    "is_exclusive" : true,
                    //Acelera o carro
                    "on_keydown": function(){
                        car.rightTurning = true;
                    },
                    "on_keyup" : function(){
                        car.rightTurning = false;
                    },
                    "this": keyScope
                }
            ]);
            scene = race.scene;
            camera = race.camera;
            raceState =1;
        }
    }
}


//Cria nova corrida
var race = new Race(gltfLoader,carStats,trackData,loopTime);

//Eventos de teclado


  

