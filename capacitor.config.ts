import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitness.buddy',
  appName: 'AI减脂伙伴',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://fitness-buddy-platform.vercel.app',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10B981',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#10B981',
    },
  },
};

export default config;
