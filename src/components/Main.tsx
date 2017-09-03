import * as PIXI from 'pixi.js';
import * as React from 'react';

import 'styles/main.scss';
declare function require(name: string);
const SYD = require('images/syd.jpg');

const rendererWidth = 800;
let rendererHeight = 600;

const pixiAPP = new PIXI.Application({ backgroundColor: 0xffffff, width: rendererWidth, height: rendererHeight });
pixiAPP.renderer.autoResize = true;

// interface IComponentState {
// }

export default class Main extends React.Component<{}, {}> {
  private sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
  private needUpdateDownloadLink = false;

  constructor() {
    super();
    this.state = {  };
  }

  setUp() {
    const texture = PIXI.loader.resources[SYD].texture.baseTexture;
    rendererHeight = rendererWidth / (texture.width / texture.height);
    pixiAPP.renderer.resize(rendererWidth, rendererHeight);
    const scale = rendererWidth / texture.width;

    const frameWidth = 20;
    const frameHeight = 20;
    const frameMargin = 4;
    const xOffest = frameWidth + frameMargin;
    const yOffest = frameHeight + frameMargin;
    const xLoopCount = Math.floor(rendererWidth / xOffest);

    const yLoopCount = Math.floor(rendererHeight / yOffest);
    for (let i = 0; i < xLoopCount; i++) {
      for (let j = 0; j < yLoopCount; j++) {
        const sprite = new PIXI.Sprite(new PIXI.Texture(texture));
        sprite.scale.set(scale, scale);

        sprite.texture.frame = new PIXI.Rectangle(
          xOffest * i / scale,
          yOffest * j / scale,
          frameWidth / scale,
          frameHeight / scale,
        );
        sprite.x = xOffest * i;
        sprite.y = yOffest * j;

        pixiAPP.stage.addChild(sprite);
      }
    }
  }

  componentDidMount() {
    // Letting pixi finishs its initiliazation stuff
    setTimeout(() => {
      (this.refs.pixi as HTMLElement).appendChild(pixiAPP.view);
      PIXI.loader
        .add(SYD)
        .load(this.setUp);
    }, 100);
  }

  render() {
    return (
      <div className="main">
        <div
          className="pixi-container"
          ref="pixi"
        />
      </div>
    );
  }
}
