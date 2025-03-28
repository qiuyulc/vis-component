import React from 'react';
import { createRoot } from 'react-dom/client';
import {Button} from 'antd';
const domNode = document.getElementById('app');
const root = createRoot(domNode!);

// const a:string = 1

import {Search} from './index';
import type { Fields } from './index';



root.render(<Button>1</Button>);