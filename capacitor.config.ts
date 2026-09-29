import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mytutor.app',
  appName: 'myTutor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
