class Race {

    constructor() {
        //Instancia a cena e camera da corrida da corrida
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera();

        

        //Ultimo tempo de jogo
        this.lastRunned = 0;


    }

    loadCar(){
        chassiLoaded = false;
        wheelsLoaded = false;

    }


    loadTrack(){

    }


    loop(){

    }

}