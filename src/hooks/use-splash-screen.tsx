
import { useEffect } from "react";
import { useIsCapacitor } from "./use-capacitor";
import { SplashScreen } from '@capacitor/splash-screen';

export function useSplashScreen() {
  const isCapacitor = useIsCapacitor();
  
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (isCapacitor) {
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
