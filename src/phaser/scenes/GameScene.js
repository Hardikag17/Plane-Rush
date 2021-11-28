import { Scene, Loader } from 'phaser';

class GameScene extends Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  init() {
    this.loaded = false;
    this.score = 0;
    this.ended = 0;
    this.highScore = localStorage.getItem('highScore');
    this.events.once('start-game', ({ url, speed, endGame }) => {
      this.playerSpeed = speed;
      this.startGame(url);
      this.endGame = endGame;
    });
  }
  preload() {
    this.load.image('image', '/assets/block.png');
    this.load.image('background', '/assets/background.png');
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    let image = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'background'
    );
    let scaleX = this.cameras.main.width / image.width;
    let scaleY = this.cameras.main.height / image.height;
    let scale = Math.max(scaleX, scaleY);
    image.setScale(scale).setScrollFactor(0);
    this.keys = this.input.keyboard.addKeys('W,S,A,D');
    this.blockOne = this.createBlock(0);
    this.blockTwo = this.createBlock(this.physics.world.bounds.height);
    this.scoreText = this.add.text(0, 0, `Score: ${this.score}`);
    this.highScoreText = this.add.text(0, 20, `High Score: ${this.highScore}`);
  }
  update() {
    if (this.loaded) {
      if (this.cursors.down.isDown || this.keys.S.isDown) {
        this.player.setVelocityY(400 * this.playerSpeed);
        this.player.setRotation(Math.PI / 4);
      } else if (this.cursors.up.isDown || this.keys.W.isDown) {
        this.player.setVelocityY(-400 * this.playerSpeed);
        this.player.setRotation(-Math.PI / 4);
      } else if (this.cursors.left.isDown || this.keys.A.isDown) {
        this.player.setVelocityX(-100 * this.playerSpeed);
        this.player.setRotation(Math.PI);
      } else if (this.cursors.right.isDown || this.keys.D.isDown) {
        this.player.setVelocityX(100 * this.playerSpeed);
        this.player.setRotation(0);
      } else {
        this.player.setVelocityY(0);
        this.player.setVelocityX(0);
        this.player.setRotation(0);
      }
      if (this.blockOne.x <= 0 || this.blockTwo.x <= 0) {
        this.score += 10;
        this.reflectScore();
        this.resetPosOne();
      }
    }
  }
  reflectScore() {
    this.scoreText.setText(`Score: ${this.score}`);
    if (this.score > this.highScore) this.highScore = this.score;
    this.highScoreText.setText(`High Score: ${this.highScore}`);
  }
  createPlayer() {
    let player = this.physics.add.sprite(
      100,
      this.physics.world.bounds.centerY,
      'player'
    );
    player.setGravityY(10);
    player.setScale(0.2);
    player.setBounce(0.5);
    player.setCollideWorldBounds(true);
    return player;
  }
  createBlock(posY) {
    let platform = this.physics.add.sprite(
      this.physics.world.bounds.width,
      posY,
      'image'
    );
    platform.setBounce(0.5);
    platform.setScale(0.5, 1.1);
    return platform;
  }
  startGame(url) {
    this.load.image('player', url);
    this.load.once(Loader.Events.COMPLETE, () => {
      this.player = this.createPlayer();
      this.addCollider(this.blockOne);
      this.addCollider(this.blockTwo);
      this.blockOne.setGravityX(-4);
      this.blockOne.setVelocityX(-450);
      this.blockTwo.setGravityX(-4);
      this.blockTwo.setVelocityX(-450);
      this.loaded = true;
    });
    this.load.start();
  }
  addCollider(platform) {
    this.physics.add.collider(this.player, platform, () => {
      if (!this.ended) {
        alert('game over');
        this.ended = 1;
        this.endGame(this.score, this.game);
      }
    });
  }
  resetPosOne() {
    const rnd = 0.1 + (Math.random() % 0.7);
    const mx = 2 + rnd * 0.3;
    this.blockOne.setX(this.physics.world.bounds.width);
    this.blockOne.setY(this.physics.world.bounds.height);
    this.blockOne.setScale(0.5, mx * rnd);
    let f = this.blockOne.frame;
    this.blockOne.setSize(f.realWidth, f.realHeight);
    this.blockTwo.setX(this.physics.world.bounds.width);
    this.blockTwo.setY(0);
    this.blockTwo.setScale(0.5, mx * (1 - rnd));
    f = this.blockTwo.frame;
    this.blockTwo.setSize(f.realWidth, f.realHeight);
  }
  resetPosTwo() {
    const rnd = Math.random();
    const mx = 12 + rnd * 2;
    this.blockOne.setX(this.physics.world.bounds.width);
    this.blockOne.setY(this.physics.world.bounds.height);
    this.blockOne.setScale(0.5, mx * rnd);
    let f = this.blockOne.frame;
    this.blockOne.setSize(f.realWidth, f.realHeight);
    this.blockTwo.setX(this.physics.world.bounds.width);
    this.blockTwo.setY(0);
    this.blockTwo.setScale(0.5, mx * (1 - rnd));
    f = this.blockTwo.frame;
    this.blockTwo.setSize(f.realWidth, f.realHeight);
  }
}

export default GameScene;
