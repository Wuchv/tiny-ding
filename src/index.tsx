import * as React from 'react';
import { render } from 'react-dom';

import { Hello } from './components/Hello/Hello';

import "antd/dist/antd.less";

const $root: HTMLElement = document.getElementById('root') || null;

render(<Hello />, $root);
