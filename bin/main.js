import carStats from "/bin/carritos/truemeno/stats.json" assert {type:'json'};
console.log(carStats);
const loopTime = 0.12; // Tempo de loop de jogo

var racetime = 0; //Tempo em milisegundos da corrida

var listener = new window.keypress.Listener() //Leitor de teclas
var keyScope = this;

//Carregador de modelos
const gltfLoader = new THREE.GLTFLoader();



var carTexture = new THREE.MeshBasicMaterial({ color: 0xffaa10 }); //Chassi
var car = new THREE.Group();


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight);
var render = new THREE.WebGLRenderer({antialiasing:true});

//Ajusta posicao da camera
camera.position.z = 200;
camera.rotation.z = (Math.PI/180)*30;
camera.rotation.x = (Math.PI/180)*30;

render.setSize(window.innerWidth, window.innerHeight);
var canvas = render.domElement;





const light = new THREE.AmbientLight(0xFFFFFF); // soft white light
scene.add(light);
document.body.appendChild(canvas);

function renderLoop() {
    render.render(scene,camera)
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);



//Eventos de teclado

//Cubo aleatorio
/*var randomCube = chassi;
randomCube.position.x=10;
randomCube.position.y=10;
randomCube.scale.x = 4;
randomCube.scale.y = 4;
scene.add(randomCube);
*/
var cubeGeometry = new THREE.BoxGeometry(500,500,1);
var cube = new THREE.Mesh(cubeGeometry,carTexture);
cube.position.z = -2;
scene.add(cube);

var phyi = {
    "calculateNextPosition" : function(){

    }
}
var car = new THREE.Group();
var chassiUrl = "bin/carritos/truemeno/"+carStats.chassi;
var wheelUrl = "bin/carritos/truemeno/"+carStats.wheel;
var chassi = new THREE.Group();
//Carrega o modelo do carro
gltfLoader.load(chassiUrl,(gltf)=>{
    gltf.scene.children.forEach((child)=>{
        chassi.add(child);
    })
    car.add(chassi);
    chassi.rotation.x =Math.PI/2;
    chassi.rotation.y = Math.PI/2;
    car.position.set(0,0,0);
    car.scale.set(5,5,5);
    phyi = new PhysicsInstance(carStats,car);
    scene.add(car);
});

//Carrega o modelo da roda
var wheels = []; //Vetor com rodas
gltfLoader.load(wheelUrl,(gltf)=>{
    gltf.scene.children.forEach((child)=>{
        //Posiciona as rodas no carro
        
        let topLeft = child.clone();
        topLeft.position.y = carStats.wheelOffset.y;
        topLeft.position.y = -carStats.wheelOffset.x;
        car.add(topLeft);

        let topRight = child.clone();
        topRight.position.y = carStats.wheelOffset.y;
        topRight.position.y = carStats.wheelOffset.x;
        car.add(topRight);

        let bottomRight = child.clone();
        bottomRight.position.y = -carStats.wheelOffset.y;
        bottomRight.position.y = carStats.wheelOffset.x;
        car.add(bottomRight);

        let bottomLeft = child.clone();
        bottomLeft.position.y = -carStats.wheelOffset.y;
        bottomLeft.position.y = -carStats.wheelOffset.x;
        car.add(bottomLeft);

        //Adiciona as rodas a um vetor
        wheels.push(topLeft);
        wheels.push(topRight);
        wheels.push(bottomLeft);
        wheels.push(bottomRight);
    })
    car.add(chassi);
    chassi.rotation.x =Math.PI/2;
    chassi.rotation.y = Math.PI/2;
    car.position.set(0,0,0);
    car.scale.set(5,5,5);
    phyi = new PhysicsInstance(carStats,car,wheels);
    scene.add(car);
});

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
        //Faz com que a camera siga o carro
        camera.position.x = phyi.vehicleModel.position.x+40;
        camera.position.y = phyi.vehicleModel.position.y-300+200;
}

setInterval(gameLoop, loopTime);

