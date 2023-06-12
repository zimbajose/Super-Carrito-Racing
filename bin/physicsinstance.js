//Uma instancia de física para um veiculo do jogo
class Collider{

    constructor(){

    }

}

class PhysicsInstance {


    constructor(stats, vehicleModel,wheels) {
        this.traction = stats.traction;
        this.acceleration = stats.acceleration;
        this.vehicleModel = vehicleModel;
        //Rotação do veiculo possui 16 direções com 1 tomando 
        this.rotation = 0;

        this.breakPower = stats.breakPower;

        this.aero = stats.aero;
        //Velocidade do carro
        this.speed = new THREE.Vector3(0, 0, 0);
        //Deltas de aceleração do carro
        this.deltas = new THREE.Vector3(0, 0, 0);
        //Controles
        this.accelerating = false;
        this.leftTurning = false;
        this.rightTurning = false;
        this.braking = false;

        //Audios do carro
        this.revAudioIdle = new Audio(stats.audio);
        this.revAudioRunning = new Audio(stats.audioHigh);
        this.revAudioIdle.loop = true;
        this.revAudioRunning.loop = true;
        this.revAudioIdle.play();

        this.crashAudio = new Audio(stats.crash);

        this.tireScreech = new Audio(stats.tireScreech);

        
        //Contador de curva, a cada 80 frames ele permite o carro virar mais uma vez.
        this.turnCounter = 60;
        this.vehicleModel.rotations = [
            0,
            Math.PI/8,
            Math.PI/4,
            (Math.PI/180) * 67.5,
            Math.PI/2,
            (Math.PI/180)*112.5,
            (Math.PI/180)*135,
            (Math.PI/180)*157.5,
            Math.PI,
            (Math.PI/180)*202.5,
            (Math.PI/180)*225,
            (Math.PI/180)*247.5,
            (Math.PI/180)*270,
            (Math.PI/180)*290.5,
            (Math.PI/180)*315,
            (Math.PI/180)*337.5,
        ]
        //Centro de velocidade
        this.speedCenter = new THREE.Vector3(0,0,0);

        //Rodas
        this.wheels = wheels;

        //Cria os colisores
        this.createColliders();

        //Vetor pra alguma coisa
        this.positionVector = new THREE.Vector3(0,0,0);
    }


    //Acelera o carro
    accelerate() {
        //Calcula deltas de aceleração
        let deltax = (Math.cos(this.vehicleModel.rotation.z) * (this.acceleration));
        let deltay = (Math.sin(this.vehicleModel.rotation.z) * (this.acceleration));
        this.speed.x+= deltax;
        this.speed.y +=deltay;
            
    }
    calculateDeltas(){
        let truespeed = this.speed.length();
        let deltax = (Math.cos(this.vehicleModel.rotation.z) * (truespeed));
        let deltay = (Math.sin(this.vehicleModel.rotation.z) * (truespeed));
        this.deltas.x = deltax;
        this.deltas.y = deltay;
    }
    
    //Freia o carro
    break () {
        let truespeed = this.speed.length();
        //Calcula deltas de desaceleração
        let deltax = (Math.cos(this.vehicleModel.rotation.z) * (this.breakPower*(1-truespeed)));
        let deltay = (Math.sin(this.vehicleModel.rotation.z) * (this.breakPower*(1-truespeed)));
        this.speed.x-= deltax;
        this.speed.y-=deltay;
        //Os leva para 0 caso o carro freie demais
        /*if(Math.abs(this.speed.length())<=this.breakPower*5){
            this.speed.x =0;
            this.speed.y =0;
        }*/
    }
    //Reduz a velocidade por conta do empuxo do ar do carro
    reduceByAero(){
       
        let aeroReduction = this.aero*Math.pow(this.speed.length(),2)+0.0001;
        
       
        let deltax = (Math.cos(this.vehicleModel.rotation.z) * (aeroReduction));
        let deltay = (Math.sin(this.vehicleModel.rotation.z) * (aeroReduction));
       
       
            this.speed.x-= deltax;
            this.speed.y-=deltay;
            this.speed.x-= deltax;
            this.speed.y-=deltay;
            //Arredonda pra 0 quando o carro está perto de parar
            if(Math.abs(this.speed.length())<=this.acceleration*2 && this.accelerating==false){
                this.speed.x =0;
                this.speed.y =0;
            }
        
    }

    //Calcula novas velocidades x e y
    calculateNewSpeed() {
        //Reduz o contador de virar o carro
        this.turnCounter = this.turnCounter>0? this.turnCounter-1 : 0;
        //Mudança de direção
        if(this.turnCounter==0 && Math.abs(this.speed.length())>=this.acceleration*53){
            if(this.rightTurning){
                this.turnCounter = 60;
                this.turnCar(true);
            }
            else if(this.leftTurning){
                this.turnCounter = 60;
                this.turnCar(false);
            }  
        }
        
        //Calcula aceleração e freio
        if(this.braking){
            this.break();
        }
        else if(this.accelerating){
            this.accelerate();
        }
        
        //Calcula arrasto do ar
        this.reduceByAero();
        //Altera velocidade
        this.calculateDeltas();//Calcula novos deltas
       
        //Adiciona arrasto caso o carro não esteja indo na direção do angulo
        
        //Verifica as diferanças de velocidade do delta e da speed
        let distance = this.speed.distanceToSquared(this.deltas);
       
        if(distance>0+this.acceleration*1.5){
            //Divide o vetor de speed baseado na tração
            this.speed.divideScalar(1+(this.traction/400)/120)
        } 
        
        

        //Calcula a velocidade final
        this.speed.multiplyScalar(400 - this.traction);
        this.speed.addVectors(this.speed, this.deltas);
        this.speed.divideScalar(400 - this.traction + 1);
        

    }

    //Seta os objetos colidiveis
    setCollidableObjects(objects){
        this.collidableObjects = objects;
    }

    //Atualiza as posições
    calculateNextPosition() {
            this.collide();
            this.calculateNewSpeed();
            this.vehicleModel.position.add(this.speed);
            //Rotaciona as rodas
            let length = this.speed.length();
            let rotation;
            if(length>0){
                rotation = -(Math.PI/180)*(length/0.03);
                this.wheels.forEach((wheel)=>{
                    wheel.rotateZ(rotation);
                });
            }
            //Altera o audio
            if(length>this.acceleration*150){
                if(this.revAudioRunning.paused){
                    console.log("memes");
                    this.revAudioRunning.play();
                    this.revAudioIdle.pause();
                }
            }
            else{
                if(this.revAudioIdle.paused){
                    this.revAudioIdle.play();
                    this.revAudioRunning.pause();
                }
            }
        }
        //True para direita false para esquerda
    turnCar(direction) {
        if (!direction) {
            this.rotation = this.rotation == 15 ? 0 : this.rotation + 1;
            this.vehicleModel.rotation.z = this.vehicleModel.rotations[this.rotation];
           
        } else {
            this.rotation = this.rotation == 0 ? 15 : this.rotation - 1;
            this.vehicleModel.rotation.z = this.vehicleModel.rotations[this.rotation];
            
        }
    }

    //Obtem um vetor com objetos proximos e trata uma colisão
    collide() {
        //Procura por uma colisão
        this.colliders.forEach((collider)=>{
            //Posicao do colisor
            collider.object.getWorldPosition(this.positionVector);
            collider.directions.forEach((direction)=>{
                this.raycaster.set(this.positionVector, direction)
                let objects = this.raycaster.intersectObjects(this.collidableObjects);
                //Trata a colisáo caso ocorra
                if(objects.length>0){
                    this.speed.x = -this.speed.x*0.9;
                    this.speed.y = -this.speed.y*0.9;
                    this.crashAudio.play();
                    return;
                }
            });
           
        });
       
    }

    //Converte um número das 16 direções para um angulo
    getAngle(rotation) {
        return rotation * (180 / 16);
    }

    //Cria os sensores de colisão
    createColliders(){
        
        this.collidableObjects = []//Objetos colidiveis
        this.colliders = [];
        
        //Instancia o raycaster
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 6;
        this.raycaster.near = 0.01;
        
        //Vetores de direção
        let left = new THREE.Vector3(0,-1,0);
        let right = new THREE.Vector3(0,1,0);
        let forwards = new THREE.Vector3(1,0,0);
        let backwards = new THREE.Vector3(-1,0,0);


        //Cria os colisores
        //Frente esquerda
        let topLeft = {
            "object" : this.wheels[0],
            "directions" : [forwards]
        }
        //Frente direita
        let topRight = {
            "object" : this.wheels[1],
            "directions" : [forwards]
        }
        //Traseira esquerda
        let bottomLeft = {
            "object" : this.wheels[2],
            "directions" :[backwards]
        }
        //Traseira direita
        let bottomRight = {
            "object" : this.wheels[3],
            "directions" : [backwards]
        }
        
        this.colliders.push(topLeft);
        //this.colliders.push(topRight);
        //this.colliders.push(bottomLeft);
        this.colliders.push(bottomRight);


    }

}

