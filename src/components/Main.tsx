import * as PIXI from 'pixi.js';
import * as React from 'react';

import 'styles/main.scss';

const DEFAULT_RENDERER_WIDTH = 800;
const DEFAULT_RENDERER_HEIGHT = 600;
const WIDTH_HEIGTH_RATIO = DEFAULT_RENDERER_WIDTH / DEFAULT_RENDERER_HEIGHT;

const pixiAPP = new PIXI.Application({ backgroundColor: 0xffffff });
// interface IComponentState {
// }

export default class Main extends React.Component<{}, {}> {
  private sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
  private needUpdateDownloadLink = false;

  constructor() {
    super();
    this.state = {  };
  }

  componentDidMount() {
    (this.refs.pixi as HTMLElement).appendChild(pixiAPP.view);
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
