
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.678d72af5a7d4ab7a74e21519a7718a4',
  appName: 'fuel-flow-mobile-app',
  webDir: 'dist',
  server: {
    url: 'https://678d72af-5a7d-4ab7-a74e-21519a7718a4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Improve iOS status bar appearance
  ios: {
    contentInset: 'always',
  },
  // Android specific configuration
  android: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
