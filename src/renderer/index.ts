import {createElement} from 'react';
import {render} from 'react-dom';

import '../scss/style.scss';

import Main from './app';

let root = document.getElementById('app');
render(createElement(Main), root);
