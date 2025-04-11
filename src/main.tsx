
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the loader after the platform has been bootstrapped
defineCustomElements(window);

// Wait for the deviceready event before bootstrapping the app
document.addEventListener('deviceready', () => {
  console.log('Device is ready');
}, false);

createRoot(document.getElementById("root")!).render(<App />);
