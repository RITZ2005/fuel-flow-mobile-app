
import { useEffect } from "react";

export function useSplashScreen() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (window.Capacitor && window.Capacitor.Plugins.SplashScreen) {
        try {
          await window.Capacitor.Plugins.SplashScreen.hide();
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
  }, []);
}
