import { init, loadImage, SpriteSheet, Sprite, GameLoop } from 'https://unpkg.com/kontra@7.1.4/kontra.mjs';

let { canvas, context } = init('game');

// Carga assets
Promise.all([
  loadImage('images/mountains.png'),
  loadImage('images/bamboo.png'),
  loadImage('images/dojo_interior.png'),
  loadImage('images/effects.png'),
  loadImage('images/platform_spritesheet.png'),
]).then(([img1, img2, img3, img4, platformImg]) => {
  let layers = [
    { img: img1, speed: 0.2 },
    { img: img2, speed: 0.4 },
    { img: img3, speed: 0.8 },
    { img: img4, speed: 1.5 },
  ].map(({img, speed}) => Sprite({
    context,
    width: canvas.width * 2,
    height: canvas.height,
    image: img,
    dx: 0,
    dy: 0,
    speed
  }));

  // SpriteSheet de plataforma (2×2)
  let sheet = SpriteSheet({
    image: platformImg,
    frameWidth: platformImg.width/2,
    frameHeight: platformImg.height/2
  });

  let platform = Sprite({
    x: canvas.width/2 - sheet.frameWidth/2,
    y: canvas.height * 0.75 - sheet.frameHeight/2,
    animations: {
      idle: {
        frames: [0,1,2,3],
        frameRate: 4
      }
    }
  });
  platform.playAnimation('idle');

  let loop = GameLoop({
    update() {
      layers.forEach(layer => {
        layer.x = (layer.x - layer.speed) % canvas.width;
      });
      platform.update();
    },
    render() {
      layers.forEach(layer => {
        layer.render();
        context.save();
        context.translate(layer.width/2, 0);
        layer.render();
        context.restore();
      });
      platform.render();
    }
  });

  loop.start();
});
