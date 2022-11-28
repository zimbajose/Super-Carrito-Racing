
const loopTime = 0.12; // Tempo de loop de jogo

var racetime = 0; //Tempo em milisegundos da corrida

var listener = new window.keypress.Listener() //Leitor de teclas
var keyScope = this;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight);
var render = new THREE.WebGLRenderer({antialiasing:true});
camera.position.z = 400;
var chassiGeometry = new THREE.BoxGeometry(4, 2, 0.7);
var carTexture = new THREE.MeshBasicMaterial({ color: 0xffaa10 }); //Chassi
var chassi = new THREE.Mesh(chassiGeometry, carTexture);
var chassi2 = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 0.7), carTexture);
chassi2.position.x = 2;
render.setSize(window.innerWidth, window.innerHeight);
var canvas = render.domElement;
var car = new THREE.Group();
car.add(chassi);
car.add(chassi2);

scene.add(car);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
document.body.appendChild(canvas);

function renderLoop() {
    render.render(scene,camera)
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

var phyi = new PhysicsInstance(0.1,0.002,0.003,0.0025,car);
//Eventos de teclado
var keyboard_events = listener.register_many([
    {
        "keys" : "w",
        "is_exclusive" : true,
        //Acelera o carro
        "on_keydown": function(){
            phyi.accelerating = true;
        },
        "on_keyup" : function(){
            phyi.accelerating = false;
        },
        "this": keyScope
    },
    {
        "keys" : "s",
        "is_exclusive" : true,
        //Acelera o carro
        "on_keydown": function(){
            phyi.braking = true;
        },
        "on_keyup" : function(){
            phyi.braking = false;
        },
        "this": keyScope
    },
    {
        "keys" : "a",
        "is_exclusive" : true,
        //Acelera o carro
        "on_keydown": function(){
            phyi.leftTurning = true;
        },
        "on_keyup" : function(){
            phyi.leftTurning = false;
        },
        "this": keyScope
    },
    {
        "keys" : "d",
        "is_exclusive" : true,
        //Acelera o carro
        "on_keydown": function(){
            phyi.rightTurning = true;
        },
        "on_keyup" : function(){
            phyi.rightTurning = false;
        },
        "this": keyScope
    }
]);


async function gameLoop() {
    phyi.calculateNextPosition();
}

setInterval(gameLoop, loopTime);

