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

const pixiAPP = new PIXI.Application({ backgroundColor: 0xffffff, width: rendererWidth, height: rendererHeight, autoResize: true });
pixiAPP.stage.interactive = true;
let particles: Particle[] = [];

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
    pixiAPP.stage.removeChild(this.sprite);
    this.sprite.destroy();
  }
}

interface IState {
  hasError: boolean;
}

export default class Main extends React.Component<{}, IState> {
  private mouseX = Number.MAX_VALUE;
  private mouseY = Number.MAX_VALUE;
  private isOnSetup = false;

  constructor() {
    super();
    this.state = { hasError: false };
  }

  handleMouseMove = (evt: PIXI.interaction.InteractionEvent) => {
    this.mouseX = (evt.data.originalEvent as MouseEvent).clientX;
    this.mouseY = (evt.data.originalEvent as MouseEvent).clientY;
  }

  setUp = () => {
    this.setState({ hasError: false });

    particles.forEach(d => d.destroy());
    particles = [];

    const url = (this.refs.input as HTMLInputElement).value;
    if (!PIXI.loader.resources[url].texture) {
      return this.setState({ hasError: true });
    }
    const texture = PIXI.loader.resources[url].texture.baseTexture;
    rendererHeight = rendererWidth / (texture.width / texture.height);
    pixiAPP.renderer.resize(rendererWidth, rendererHeight);
    const scale = rendererWidth / texture.width;

    const xLoopCount = Math.floor(rendererWidth / xOffest) - 1;
    const yLoopCount = Math.floor(rendererHeight / yOffest) - 1;
    for (let i = 0; i < xLoopCount; i++) {
      for (let j = 0; j < yLoopCount; j++) {
        particles.push(new Particle(i * xOffest, j * yOffest, scale, texture));
      }
    }
    this.isOnSetup = false;
  }

  renderingLoop = () => {
    if (this.isOnSetup) { return; }

    const mouseX = this.mouseX - pixiAPP.renderer.view.offsetLeft;
    const mouseY = this.mouseY - pixiAPP.renderer.view.offsetTop;

    particles.forEach(element => element.update(mouseX, mouseY));
    pixiAPP.render();
  }

  renderParticles = () => {
    this.isOnSetup = true;
    const url = (this.refs.input as HTMLInputElement).value;
    if (PIXI.loader.resources[url]) { return this.setUp(); }

    const load = PIXI.loader
      .add(url)
      .load(this.setUp);
  }

  componentDidMount() {
    // Letting pixi finishs its initiliazation stuff, that why it needs 10ms
    setTimeout(() => {
      (this.refs.pixi as HTMLElement).appendChild(pixiAPP.view);
      this.renderParticles();
    }, 10);
    PIXI.loader.onError.add(() => setTimeout(this.setState({ hasError: true })));
    pixiAPP.stage.on('mousemove', this.handleMouseMove);
    pixiAPP.ticker.add(this.renderingLoop);
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
            ref="input"
            defaultValue={DEFAULT_IMG}
          />
          <button className="button" onClick={this.renderParticles}>Submit</button>
        </div>
        { this.state.hasError && <p className="error">Sorry, that image cannot be loaded because its server doesn't allow it, plz try another one, like: http://davidguan.me/assets/136133c6ea2e29e457cea61fbbc06ad3.png</p> }
        <p className="desc">Image without CORS enabled on its server won't load, you can test this application with images on <a href="http://imgur.com/search?q=mountain" target="_blank">imgur.com</a></p>
        <p className="footer">
          Visit <a href="https://davidguan.me" target="_blank">davidguan.me</a> to see my other works.
        </p>
      </div>
    );
  }
}
