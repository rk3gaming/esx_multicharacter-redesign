import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import '@mantine/core/styles.css';

const style = document.createElement('style');
style.textContent = `
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: transparent;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  ::-webkit-scrollbar-track {
    display: none;
  }
  ::-webkit-scrollbar-thumb {
    display: none;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 