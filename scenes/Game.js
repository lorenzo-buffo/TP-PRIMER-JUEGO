// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    this.gameOver = false;
    this.timer = 20;
    this.score = 0;
    this.shapes = {
      "triangle": {points: 10, count: 0},
      "square": {points: 20, count: 0},
      "diamond": {points: 30, count:0},
      "bomb": {  points: -10, count:0},
    };
    
}
  preload() {
  //cargar assets

  //import Cielo
    this.load.image("Cielo", "./public/assets/Cielo.webp");

    //import plataforma
    this.load.image("platform", "./public/assets/platform.png");

    //import pj
    this.load.image("personaje", "./public/assets/Ninja.png")

    //import recolectable
    this.load.image("triangle", "./public/assets/triangle.png")
    this.load.image("square", "./public/assets/square.png")
    this.load.image("diamond", "./public/assets/diamond.png")
    this.load.image("bomb", "./public/assets/bomb.webp")

    
}
create() {
  
    //Crear elemnto
  
    this.Cielo = this.add.image(400, 300, "Cielo");
    this.Cielo.setScale(2)
  
    //Crear pltaforma
    this.platforms = this.physics.add.staticGroup();
  
    //al grupo de plataformas agregar plataforma
    this.platforms.create(400, 565, "platform").setScale(2).refreshBody();
  
    this.platforms.create(400, 400, "platform")
  
    //Crear pj
    this.personaje = this.physics.add.sprite(400, 300, "personaje")
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);
  
    //agregar colision entre pj y plataforma
    this.physics.add.collider(this.personaje, this.platforms);
  
    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys(); 
  
    //una tecla a la vez
    //this.w = this.input.kayboard.addKey(Phaser.Input.Keyboard.keyCodes.W);
  
    //crear grupo recolectables
    this.recolectables = this.physics.add.group(); 
    this.physics.add.collider(this.recolectables, this.recolectables)
  
    this.physics.add.collider(this.personaje, this.recolectables, this.pj, null, this)
    
    this.physics.add.collider(this.platforms, this.recolectables, this.onRecolectableBounced, null, this)
  
  
    //add tecla r
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  
    //evento 1 segundo
    this.time.addEvent({
      delay: 700,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  
    //agregar texto de timer en la esquina superior derecha
  
    this.timerText = this.add.text(10, 10, `tiempo restante: ${this.timer}`, {
  
      fontSize: "32px",
  
      fill: "#fff"
  
    });
  
    //timer de 1 seg
    this.time.addEvent({ 
      delay: 1000,
      callback: this.handlerTimer, 
      callbackScope: this, 
      loop: true,
    })
  
    this.scoreText = this.add.text(10, 50, `puntaje: ${this.score}
    / T: ${this.shapes["triangle"].count}
    / S: ${this.shapes["square"].count}
    / D: ${this.shapes["diamond"].count}`)

    const cumplePuntos = this.score >= 100;
    const cumpleFiguras =
      this.shapes["triangle"].count >= 2 &&
      this.shapes["square"].count >= 2 &&
      this.shapes["diamond"].count >= 2;

    if (cumplePuntos % cumpleFiguras) {
      console.log("Ganaste");
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver
      })}
  
  }

  pj(personaje, recolectables){
    const nombreFig = recolectables.texture.key;
    //const puntoFig = this.shapes[nombreFig].point;
    this.score += recolectables.getData("points");
    this.shapes[nombreFig].count += 1;
    console.table(this.shapes);
    console.log("score", this.score);
    console.log("recolectado");
    recolectables.destroy();

    this.scoreText.setText(
      `puntaje: ${this.score} 
      / T: ${this.shapes["triangle"].count} 
      / S: ${this.shapes["square"].count}  
      / D: ${this.shapes["diamond"].count}`
    );
    const cumplePuntos = this.score >= 100;
    const cumpleFiguras = 
    this.shapes["triangle"].count >= 2 &&
    this.shapes["square"].count >= 2 &&
    this.shapes["diamond"].count >= 2;

    if (cumplePuntos && cumpleFiguras) {
      console.log("Ganaste");
      this.scene.start("end",{score:this.score, gameOver: this.gameOver})
  }
}
  
  floor(platforms, recolectables){
    recolectables.disableBody(true,true)
    }
    onSecond() {
      //crear recolectable
  
      const tipos = ["triangle", "square", "diamond", "bomb"];
      const tipo = Phaser.Math.RND.pick(tipos);
  
      let recolectable = this.recolectables.create(
          Phaser.Math.Between(10, 790),
          0,
          tipo
      );
      if(tipo=="bomb"){
        recolectable.setScale(0.1)
      }
      recolectable.setVelocity(0, 100);

      this.physics.add.collider(recolectable, this.recolectables)
      const rebote = Phaser.Math.FloatBetween(0.4, 0.8);
      recolectable.setBounceY(rebote);
      
      // Configurar datos del recolectable
      recolectable.setData("points", this.shapes[tipo].points);
      recolectable.setData("tipo", tipo);
      recolectable.setData("rebotes", 0); // Inicializar el contador de rebotes
      recolectable.setData("maxRebotes", 5); // Establecer el máximo de rebotes permitidos
  }
  onRecolectableBounced(platforms, recolectable) {
    console.log("recolectable rebote",recolectable);
    let points = recolectable.getData("points");
    points -= 5;
    console.log(points)
    recolectable.setData("points", points);
    if (points <= 0) {
      recolectable.destroy();
    }
  }
  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer === 0) {
        this.gameOver = true;
        this.scene.start("end", {
            score: this.score,
            gameOver: this.gameOver,
        });
    }
}  
    update() {
      if (this.cursor.left.isDown) {
        this.personaje.setVelocityX(-160)
      } else if (this.cursor.right.isDown) {
        this.personaje.setVelocityX(160)
      } else this.personaje.setVelocityX(0) 
  
      if (this.cursor.up.isDown && this.personaje.body.touching.down){
        this.personaje.setVelocityY(-330); 
      }
      if( this.r.isDown){
        console.log("reincia")
        this.scene.restart(GAME);  
      }
      if(this.gameOver){
          this.physics.pause();
          this.timerText.setText("Game Over");
          return;
      }
    }  
  }