class Race {

    constructor(loader,carStats,trackData,frequency) {
        //Instancia a cena e camera da corrida da corrida
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera();

        //Adiciona luz a cena
        var light = new THREE.PointLight(0xffffff);
        light.position.z=200;
        light.position.x=25;
        this.scene.add(light);

        //Ajusta a posição da camera
        this.camera.position.z = 400+trackData.height;
        this.camera.rotation.z = (Math.PI/180)*30;
        this.camera.rotation.x = (Math.PI/180)*30;

        //Obtem a posicao inicial do carro
        this.startingPosition = trackData.startPosition;

        this.raceTime =0;//Tempo em milisegundos desde o inicio da corrida

        this.lastRunned = 0;
        this.loadTrack(loader,trackData);
        this.loadCar(loader,carStats);
        

        this.loadedCar = false;
        this.loadedTrack = false;

        this.frequency = frequency;

        this.carStats = carStats;
        this.trackData = trackData;

        //Instancia vetor dos colidiveis
        this.collidables = [];
    }

    async loadCar(loader,carStats){
        var car = new THREE.Group();
        let chassiLoaded = false;
        let wheelsLoaded = false;

        var chassi = new THREE.Group();
        var wheels = []; //Vetor com rodas
        let chassiUrl = "bin/carritos/truemeno/"+carStats.chassi;
        //Carrega os modelos do carro
        loader.load(chassiUrl,(gltf)=>{
            gltf.scene.children.forEach((child)=>{
                chassi.add(child);
            })
            car.add(chassi);
            chassiLoaded = true;
            if(wheelsLoaded&&chassiLoaded){
                this.loadedCar = true;
                chassi.rotation.x =Math.PI/2;
                chassi.rotation.y = Math.PI/2;
                car.position.set(0,0,3.7);
                car.scale.set(5,5,5);
                this.car= new PhysicsInstance(carStats,car,wheels);
            }
        });

        //Carrega o modelo da roda
       
        let wheelUrl = "bin/carritos/truemeno/"+carStats.wheel;
        loader.load(wheelUrl,(gltf)=>{
            let wheel = new THREE.Group();
            //Carrega todos os modelos da roda e coloca dentro de um grupo
            gltf.scene.children.forEach((child)=>{
                wheel.add(child);
            })
            //Posiciona as rodas no carro
            wheel.rotation.x = Math.PI/2;
            let scale = carStats.wheelData.scale;
            wheel.position.z = carStats.wheelData.offsetZ;
            wheel.scale.set(scale,scale,scale);
        
            let topLeft = wheel.clone();
            topLeft.position.y = carStats.wheelData.positions.topLeft.y;
            topLeft.position.x = carStats.wheelData.positions.topLeft.x;
            car.add(topLeft);
            
            let topRight = wheel.clone();
            topRight.position.y = carStats.wheelData.positions.topRight.y;
            topRight.position.x = carStats.wheelData.positions.topRight.x;
            car.add(topRight);
        
            let bottomRight = wheel.clone();
            bottomRight.position.y = carStats.wheelData.positions.bottomRight.y;
            bottomRight.position.x = carStats.wheelData.positions.bottomRight.x;
            car.add(bottomRight);
        
            let bottomLeft = wheel.clone();
            bottomLeft.position.y = carStats.wheelData.positions.bottomLeft.y;
            bottomLeft.position.x = carStats.wheelData.positions.bottomLeft.x;
            car.add(bottomLeft);
            
        
            //Adiciona as rodas a um vetor
            wheels.push(topLeft);
            wheels.push(topRight);
            wheels.push(bottomLeft);
            wheels.push(bottomRight);
        
            wheelsLoaded = true;
            if(wheelsLoaded&&chassiLoaded){
                this.loadedCar = true;
                chassi.rotation.x =Math.PI/2;
                chassi.rotation.y = Math.PI/2;
                car.position.set(0,0,3.7);
                car.scale.set(5,5,5);
                this.car= new PhysicsInstance(carStats,car,wheels);
            }
        });
      
        

    }

    //Carrega a pista do jogo
    async loadTrack(loader, trackData){
        loader.load(trackData.path,(gltf)=>{
            this.track = new THREE.Group();
            gltf.scene.children.forEach((child)=>{
                //Adiciona os pedaços da pista para a cena e para a lista de colidiveis
                this.collidables.push(child);
                this.track.add(child);
            });
            this.loadedTrack = true;
        });
    }

    //Realiza o processamento de um frame
    loop(){
        this.car.calculateNextPosition();
        //Faz com que a camera siga o carro
        this.camera.position.z = this.car.vehicleModel.position.z+400
        this.camera.position.x = this.car.vehicleModel.position.x+40;
        this.camera.position.y = this.car.vehicleModel.position.y-300;
        
        //Incremente o timer
        this.raceTime+=this.frequency;
    }

    //Faz os preparativos e adiciona os modelos a cena, e também adiciona os objetos colisiveis ao carro
    startRace(){
        //retorna falso caso o carregamento nao tenha sido concluido
        if(!this.loaded()){
            return false;
        }
        this.scene.add(this.car.vehicleModel);
        console.log(this.track);
        //Reduz modelo da pista para escala
        let scale = this.trackData.scale;
        this.track.scale.set(scale,scale,scale)
        //Rotaciona a pista para a posicao correta
        this.track.rotateX(Math.PI/2);
        this.scene.add(this.track);

        ///Altera a posição do carro para a inicial
        this.car.vehicleModel.position.set(this.startingPosition.x,this.startingPosition.y,this.startingPosition.z);
        //this.car.vehicleModel.rotation.z = this.startingPosition.angle;

        //Adicionar os colisiveis para o carro
        this.car.setCollidableObjects(this.collidables);

        //Retorna o carro para fazer o binding de teclas
        return this.car;
    }

    //Retorna verdadeiro se o carregamento já foi realizado
    loaded(){
        return this.loadedCar && this.loadedTrack;
    }
}