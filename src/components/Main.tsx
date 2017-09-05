import * as PIXI from 'pixi.js';
import * as React from 'react';
import * as THREE from 'three';

import 'styles/main.scss';
declare function require(name: string);
const rendererWidth = 800;
let rendererHeight = 900;

const frameWidth = 10;
const frameHeight = 10;
const frameMargin = 0;
const xOffest = frameWidth + frameMargin;
const yOffest = frameHeight + frameMargin;
const maxSpeed = 40;
const DEFAULT_IMG = 'http://i.imgur.com/P9IVqkS.jpg';

let particles: Particle[] = [];
const loader = new THREE.TextureLoader();
let material: THREE.MeshBasicMaterial;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.OrthographicCamera(
  -rendererWidth / 2, rendererWidth / 2,
  frameHeight / 2, -frameHeight / 2,
  1, 2000,
);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(rendererWidth, rendererHeight);

class Particle {
  private speedX = 0;
  private speedY = 0;
  private mesh: THREE.Mesh;

  constructor(private posX: number, private posY: number) {
    // posY = rendererHeight - posY;
    const geometry = new THREE.PlaneGeometry(frameWidth, frameHeight, 1);

    const startVec2 = new THREE.Vector2(posX / rendererWidth, 1 - posY / rendererHeight);
    const endVec2 = new THREE.Vector2((posX + frameWidth) / rendererWidth, 1 - (posY + frameHeight) / rendererHeight);

    const ratioVec2 = new THREE.Vector2(posX / rendererWidth, posY / rendererHeight);
    geometry.faceVertexUvs[0][0] = [
      startVec2,
      new THREE.Vector2(startVec2.x, endVec2.y),
      new THREE.Vector2(endVec2.x, startVec2.y),
    ];
    geometry.faceVertexUvs[0][1] = [
      new THREE.Vector2(startVec2.x, endVec2.y),
      endVec2,
      new THREE.Vector2(endVec2.x, startVec2.y),
    ];
    // console.log(geometry.faceVertexUvs);

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    // console.log(-(posY - rendererHeight / 2));

    this.mesh.position.x = Math.random() * rendererWidth - rendererWidth / 2;
    this.mesh.position.y = Math.random() * rendererHeight - rendererHeight / 2;
    this.posX = posX - rendererWidth / 2;
    this.posY = -(posY - rendererHeight / 2);
  }

  update(mouseX: number, mouseY: number) {
    this.speedX = (this.posX - this.mesh.position.x) / rendererWidth * maxSpeed;
    this.speedY = (this.posY - this.mesh.position.y) / rendererHeight * maxSpeed;

    // const distance = Math.sqrt(Math.pow(mouseX - this.mesh.position.x, 2) + Math.pow(mouseY - this.mesh.position.y, 2));
    // if (distance < 50) {
    //   const accX = (mouseX - this.mesh.position.x);
    //   this.speedX -= accX;

    //   const accY = (mouseY - this.mesh.position.y);
    //   this.speedY -= accY;
    // }

    this.mesh.position.x += this.speedX;
    this.mesh.position.y += this.speedY;
  }

  destroy() {
    // pixiAPP.stage.removeChild(this.sprite);
    scene.remove(this.mesh);
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
    // this.mouseX = (evt.data.originalEvent as MouseEvent).clientX;
    // this.mouseY = (evt.data.originalEvent as MouseEvent).clientY;
  }

  setUp = (texture: HTMLImageElement) => {
    this.setState({ hasError: false });

    particles.forEach(d => d.destroy());
    particles = [];

    // const url = (this.refs.input as HTMLInputElement).value;
    rendererHeight = rendererWidth / (texture.width / texture.height);
    camera.top = rendererHeight / 2;
    camera.bottom = -rendererHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(rendererWidth, rendererHeight);

    const xLoopCount = Math.floor(rendererWidth / xOffest) - 1;
    const yLoopCount = Math.floor(rendererHeight / yOffest) - 1;
    for (let i = 0; i < xLoopCount; i++) {
      for (let j = 0; j < yLoopCount; j++) {
        particles.push(new Particle(i * xOffest, j * yOffest));
      }
    }
    particles.push(new Particle(0, 0));
    this.isOnSetup = false;
  }

  renderingLoop = () => {
    // if (this.isOnSetup) { return; }

    // const mouseX = this.mouseX - pixiAPP.renderer.view.offsetLeft;
    // const mouseY = this.mouseY - pixiAPP.renderer.view.offsetTop;

    particles.forEach(element => element.update(0, 0));
    renderer.render(scene, camera);
    requestAnimationFrame(this.renderingLoop);
  }

  renderParticles = () => {
    // this.isOnSetup = true;
    const url = (this.refs.input as HTMLInputElement).value;
    // if (PIXI.loader.resources[url]) { return this.setUp(); }

    // const load = PIXI.loader
    //   .add(url)
    //   .load(this.setUp);
    loader.load(DEFAULT_IMG, (texture: THREE.Texture) => {
      material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      this.setUp(texture.image);
      this.renderingLoop();
    });
  }

  componentDidMount() {
    (this.refs.pixi as HTMLElement).appendChild(renderer.domElement);
    this.renderParticles();
    // PIXI.loader.onError.add(() => setTimeout(this.setState({ hasError: true })));
    // pixiAPP.stage.on('mousemove', this.handleMouseMove);
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
