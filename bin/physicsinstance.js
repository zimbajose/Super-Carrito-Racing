//Uma instancia de física para um veiculo do jogo
class PhysicsInstance {

    

    constructor(traction, acceleration, breakPower, aero, vehicleModel) {
        this.traction = traction;
        this.acceleration = acceleration;
        this.vehicleModel = vehicleModel;
        //Rotação do veiculo possui 16 direções com 1 tomando 
        this.rotation = 0;

        this.breakPower = breakPower;

        this.aero = aero;
        //Velocidade do carro
        this.speed = new THREE.Vector3(0, 0, 0);
        //Deltas de aceleração do carro
        this.deltas = new THREE.Vector3(0, 0, 0);
        //Controles
        this.accelerating = false;
        this.leftTurning = false;
        this.rightTurning = false;
        this.braking = false;
        
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
            if(Math.abs(this.speed.length())<=aeroReduction*2){
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
       
        this.speed.multiplyScalar(100 - this.traction);
        this.speed.addVectors(this.speed, this.deltas);
        this.speed.divideScalar(100 - this.traction + 1);
       

    }

    //Atualiza as posições
    calculateNextPosition() {
            this.calculateNewSpeed();
            this.vehicleModel.position.add(this.speed);
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
    collide(objects) {
        objects.forEach(object => {

        });
    }




    //Converte um número das 16 direções para um angulo
    getAngle(rotation) {
        return rotation * (180 / 16);
    }


}