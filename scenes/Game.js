// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    
    super("main");
  }

  init() {
  }

  preload() {
    //cargamos los assets
   // se importa el cielo
   this.load.image("Cielo", "../public/assets/Cielo.webp");
    //importamos plataforma
    this.load.image("platform", "../public/assets/platform.png");
    //importamos el personaje
    this.load.image("personaje", "../public/assets/Ninja.png");
    //importamos los recolectables
    this.load.image("triangle", "../public/assets/triangle.png")
    this.load.image("square", "../public/assets/square.png")
    this.load.image("diamond", "../public/assets/diamond.png")


  }

  create() {
    //se generan los assets
    this.Cielo = this.add.image(400, 300, "Cielo");
    this.Cielo.setScale(2)
    //genero plataforma
    this.platform = this.physics.add.staticGroup();
     this.platform.create(400, 565, "platform").setScale(2).refreshBody();
     this.platform.create(400, 400, "platform")

     //genero el personaje
     this.personaje = this.physics.add.sprite(400, 300, "personaje")
     this.personaje.setScale(0.1);
     this.personaje.setCollideWorldBounds(true);
      //agregar colision entre personaje y plataforma
     this.physics.add.collider(this.personaje, this.platform);
      //crear teclas
     this.cursor = this.input.keyboard.createCursorKeys(); 

     //genero grupo de los recolectables
    this.recolectables = this.physics.add.group(); 
    this.physics.add.collider(this.personaje, this.recolectables)
    this.physics.add.collider(this.recolectables, this.recolectables)
    //hago que caigan aleatoriamente cada 1 segundo
    this.time.addEvent({
      delay: 1000,
    callback: this.onSecond,
    callbackScope: this,
    loop: true,
  });
  }
  onSecond() {
    //crear reecolectable

    const tipos = ["triangle", "square", "diamond"]
    const tipo = Phaser.Math.RND.pick(tipos);

    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
    recolectable.setVelocity(0, 100);
  }


  update() {
    //movimiento
    if(this.cursor.left.isDown) {
      this.personaje.setVelocityX(-200);
    }
    else if(this.cursor.right.isDown) {
      this.personaje.setVelocityX(200);
    }
    else {
      this.personaje.setVelocityX(0);
    } 
    if (this.cursor.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330)
  }
}
}
  
