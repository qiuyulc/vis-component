import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from './components/Button'

const domNode = document.getElementById('app');
const root = createRoot(domNode!);

root.render(<Button />);