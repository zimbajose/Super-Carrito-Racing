//Uma instancia de física para um veiculo do jogo
class PhysicsInstance {



    constructor(traction, acceleration, maxspeed, breakPower, aero, position = new THREE.Vector3(1, 0, 0), direction) {
        this.traction = traction;
        this.acceleration = acceleration;
        this.maxspeed = maxspeed;

        //Posição do carro se não definida é tomada como 0
        this.position = position;
        //Rotação do veiculo possui 16 direções com 1 tomando 
        this.rotation = 0;

        this.breakPower = breakPower;

        this.aero = aero;
        //Velocidade do carro
        this.speed = new THREE.Vector3(0, 0, 0);

        //Deltas de aceleração do carro
        this.deltas = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(1, 0, 0);
    }


    //Acelera o carro
    accelerate() {
            let angle = getAngle(this.rotation)

            let deltax = (Math.cos(angle) * (this.speed.x + this.acceleration));
            let deltay = (Math.sin(angle) * (this.speed.y + this.acceleration));
            this.deltas.x = deltax;
            this.deltas.y = deltay;
        }
        //Freia o carro
    break () {
        let angle = getAngle(this.rotation)

        let deltax = (Math.cos(angle) * this.breakPower);
        let deltay = (Math.sin(angle) * this.breakPower);
        this.deltas.x = -deltax;
        this.deltas.y = -deltay;
    }

    //Calcula novas velocidades x e y
    calculateNewSpeed() {
        //Calcula aceleração e freio

        //Calcula mudança de direção

        //Calcula arrasto do ar

        //Altera velocidade
        this.speed.multiplyScalar(100 - this.traction);
        this.speed.addScalar(this.speed, this.deltas);
        this.speed.divideScalar(100 - this.traction + 1);
        this.position.add(this.speed);

    }

    //Atualiza as posições
    calculateNextPos() {
            this.position.x += this.speed.x;
            this.position.y += this.speed.y;
            this.position.z += this.speed.z;
        }
        //True para direita false para esquerda
    turnCar(direction = true) {
        if (direction) {
            this.rotation = this.rotation == 16 ? 1 : this.rotation + 1;
        } else {
            this.rotation = this.rotation == 1 ? 16 : this.rotation - 1;
        }
    }

    //Obtem um vetor com objetos proximos e trata uma colisão
    collide(objects) {
        objects.forEach(object => {

        });
    }




    //Converte um número das 16 direções para um angulo
    static getAngle(rotation) {
        return rotation * (360 / 17);
    }


}