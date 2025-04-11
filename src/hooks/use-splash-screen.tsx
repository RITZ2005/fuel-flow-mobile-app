
import { useEffect } from "react";
import { useIsCapacitor } from "./use-capacitor";

// Try to import SplashScreen, but handle it gracefully if not available
let SplashScreen: any = null;
try {
  // Dynamic import to avoid direct dependency at compile time
  import('@capacitor/splash-screen').then(module => {
    SplashScreen = module.SplashScreen;
  });
} catch (error) {
  console.warn('Capacitor SplashScreen module not available', error);
}

export function useSplashScreen() {
  const isCapacitor = useIsCapacitor();
  
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (isCapacitor && SplashScreen) {
        try {
          await SplashScreen.hide();
        } catch (error) {
          console.error("Error hiding splash screen:", error);
        }
      }
    };

    // Hide splash screen after a short delay to ensure app is fully loaded
    const timer = setTimeout(() => {
      hideSplashScreen();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isCapacitor]);
}
