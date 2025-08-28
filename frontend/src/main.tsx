import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Theme } from '@radix-ui/themes';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Theme
        accentColor="violet"
        grayColor="mauve"
        panelBackground="solid"
        appearance="light"
        scaling="100%"
        radius="small"
      >
        <App />
      </Theme>
    </StrictMode>
  );
}
