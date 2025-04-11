
interface CapacitorGlobal {
  Plugins: {
    SplashScreen: {
      hide: () => Promise<void>;
    };
    [key: string]: any;
  };
  isNative?: boolean;
  isPluginAvailable?: (name: string) => boolean;
  getPlatform?: () => string;
  [key: string]: any;
}

interface Window {
  Capacitor: CapacitorGlobal;
}
