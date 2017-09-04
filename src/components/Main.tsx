import * as PIXI from 'pixi.js';
import * as React from 'react';

import 'styles/main.scss';
declare function require(name: string);
const rendererWidth = 800;
let rendererHeight = 600;

const frameWidth = 10;
const frameHeight = 10;
const frameMargin = 0;
const xOffest = frameWidth + frameMargin;
const yOffest = frameHeight + frameMargin;
const maxSpeed = 40;
const DEFAULT_IMG = 'http://davidguan.me/book.jpg';

const pixiAPP = new PIXI.Application({ backgroundColor: 0xffffff, width: rendererWidth, height: rendererHeight });
pixiAPP.renderer.autoResize = true;
pixiAPP.stage.interactive = true;
const Particles: Particle[] = [];

class Particle {
  private speedX = 0;
  private speedY = 0;
  private sprite: PIXI.Sprite;

  constructor(private posX: number, private posY: number, private scale: number, baseTexture: PIXI.BaseTexture) {
    this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));
    this.sprite.scale.set(scale, scale);

    this.sprite.texture.frame = new PIXI.Rectangle(
      posX / scale,
      posY / scale,
      frameWidth / scale,
      frameHeight / scale,
    );
    this.sprite.x = Math.random() * rendererWidth;
    this.sprite.y = Math.random() * rendererHeight;

    pixiAPP.stage.addChild(this.sprite);
  }

  update(mouseX: number, mouseY: number) {
    this.speedX = (this.posX - this.sprite.x) / rendererWidth * maxSpeed;
    this.speedY = (this.posY - this.sprite.y) / rendererHeight * maxSpeed;

    const distance = Math.sqrt(Math.pow(mouseX - this.sprite.x, 2) + Math.pow(mouseY - this.sprite.y, 2));
    if (distance < 50) {
      const accX = (mouseX - this.sprite.x);
      this.speedX -= accX;

      const accY = (mouseY - this.sprite.y);
      this.speedY -= accY;
    }

    this.sprite.x += this.speedX;
    this.sprite.y += this.speedY;
  }

  destroy() {
    this.sprite.destroy();
  }
}

export default class Main extends React.Component<{}, {}> {
  private sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
  private needUpdateDownloadLink = false;
  private mouseX = Number.MAX_VALUE;
  private mouseY = Number.MAX_VALUE;

  handleMouseMove = (evt: PIXI.interaction.InteractionEvent) => {
    this.mouseX = (evt.data.originalEvent as MouseEvent).clientX;
    this.mouseY = (evt.data.originalEvent as MouseEvent).clientY;
  }
  setUp = () => {
    Particles.forEach(element => {
      element.destroy();
    });
    const texture = PIXI.loader.resources[DEFAULT_IMG].texture.baseTexture;
    rendererHeight = rendererWidth / (texture.width / texture.height);
    pixiAPP.renderer.resize(rendererWidth, rendererHeight);
    const scale = rendererWidth / texture.width;

    const xLoopCount = Math.floor(rendererWidth / xOffest);

    const yLoopCount = Math.floor(rendererHeight / yOffest);
    for (let i = 0; i < xLoopCount; i++) {
      for (let j = 0; j < yLoopCount; j++) {
        Particles.push(new Particle(i * xOffest, j * yOffest, scale, texture));
      }
    }
  }

  componentDidMount() {
    // Letting pixi finishs its initiliazation stuff
    setTimeout(() => {
      (this.refs.pixi as HTMLElement).appendChild(pixiAPP.view);
      PIXI.loader
        .add(DEFAULT_IMG)
        .load(this.setUp);
    }, 100);

    pixiAPP.stage.on('mousemove', this.handleMouseMove);
    pixiAPP.ticker.add(() => {
      const mouseX = this.mouseX - pixiAPP.renderer.view.offsetLeft;
      const mouseY = this.mouseY - pixiAPP.renderer.view.offsetTop;

      Particles.forEach(element => {
        element.update(mouseX, mouseY);
      });
      pixiAPP.render();
    });
  }

  render() {
    return (
      <div className="main">
        <div
          className="pixi-container"
          ref="pixi"
        />
        <div className="input-container">
          Image URL:
          <input
            type="text"
            defaultValue={DEFAULT_IMG}
          />
        </div>
      </div>
    );
  }
}
