class Race {

    constructor() {
        //Instancia a cena e camera da corrida da corrida
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();

        //Ultimo tempo de jogo
        this.lastRunned = 0;

        //Instancia de física
        this.examplePhysics = new PhysicsInstance(50, 2)

    }


    //Executa as físicas e jogo

    run(gameTime) {

    }


}