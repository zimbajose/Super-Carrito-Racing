class Race {

    constructor(loader,carStats,trackData,frequency) {
        //Instancia a cena e camera da corrida da corrida
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera();

        //Adiciona luz a cena
        var light = new THREE.PointLight( 0xffffff,5,99999999);
        light.position.z=500;
        //light.position.x=1000;
        light.position.y=500;
        light.castShadow = true;
       
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 5000000; // default

        this.scene.add(light);

        var luzAmbiente = new THREE.AmbientLight(0x222222);
        this.scene.add(luzAmbiente);

        //Adicionando chão_______________
        const texture = new THREE.TextureLoader().load('bin/resources/Marte.jpg');
        var groundTexture = new THREE.MeshBasicMaterial({ map: texture});
        var groundGeometry = new THREE.BoxGeometry(10000, 10000, 0.1);
        var ground = new THREE.Mesh(groundGeometry, groundTexture);
        //ground.castShadow = true;
        ground.receiveShadow = true;
        ground.position.set(0,0,-10);
        this.scene.add(ground);

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
                child.castShadow = true;
                child.receiveShadow = true;
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
//     if(derrapando){
//     //Valores aleatorios pra usar pra mover as particulas
//     var aleatorios = aleatorios();
//     //Cria uns dois objeto novo
   
//     var particulaDaRoda1 = new Cubo(posicaoroda1+aleatorios);
//     var particulaDaRoda2 = new Cubo(posicaoroda2+aleatorios);

//     //Adiciona os cubos a cena
//     scene.add(particulaDaRoda1);
//     scene.add(particulaDaRoda2);

//     //Frames de vida do cubo
//     var lifetime = 600


//     //Cria um intervalo pra manipular os cubos criados
//     var interval;

//     interval = setInterval(function(){
//         //Remove os dois cubos da cena e limpa o intervalo caso eles cheguem ao tempo limite
//         if(lifetime<=0){
//             scene.remove(particulaDaRoda1);
//             scene.remove(particulaDaRoda2);
//             clearInterval(interval);
//         }

//         //Altera posicao escala e opacidade
//         particulaDaRoda1.position.set(atual+algumvalorfixo);
//         particulaDaRoda2.position.set(atual+algumvalorfixo);

//         particulaDaRoda1.scale.set(atual+algumvalorfixo);
//         particulaDaRoda2.scale.set(atual+algumvalorfixo);

//         particulaDaRoda1.opacity.set(atual - algumvalorfixo);
//         particulaDaRoda2.opacity.set(atual - algumvalorfixo);

//         //Decremente o tempo de vida dos cubos
//         lifetime--;
//     },tempodeumaframe)

// }

    //Carrega a pista do jogo
    async loadTrack(loader, trackData){
        loader.load(trackData.path,(gltf)=>{
            this.track = new THREE.Group();
            this.track.castShadow = true;
            this.track.receiveShadow  = true;
            gltf.scene.children.forEach((child)=>{
                //Adiciona os pedaços da pista para a cena e para a lista de colidiveis
                
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = new THREE.MeshStandardMaterial( {
                    color: 0xff4400, roughness: 0.2, name: 'orange'
                })
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
        this.camera.position.z = this.car.vehicleModel.position.z+900;
        this.camera.position.x = this.car.vehicleModel.position.x+40;
        this.camera.position.y = this.car.vehicleModel.position.y-400;
      
  

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