
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the loader after the platform has been bootstrapped
defineCustomElements(window);

// Function to initialize the app
const initApp = () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

// Check if running in Capacitor environment
if (typeof window !== 'undefined' && window.Capacitor) {
  // Wait for the deviceready event before bootstrapping the app
  document.addEventListener('deviceready', () => {
    console.log('Device is ready');
    initApp();
  }, false);
} else {
  // Regular web environment
  initApp();
}
