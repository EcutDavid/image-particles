import 'babel-polyfill';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/Main';

PIXI.utils.skipHello();
import 'normalize.css/normalize.css';

import 'styles/reset.scss';

// Render the main component into the dom
ReactDOM.render(<App />, document.getElementById('app'));
