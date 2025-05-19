import 'dotenv/config';

export default {
  expo: {
    name: "habits-tracker",
    slug: "habit-buddy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/habits.png",
    scheme: "habits-tracker",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/habits.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.louaialayoubi.habitbuddy",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/habits.png",
        backgroundColor: "#ffffff",
      },
      package: "com.louaialayoubi.habitbuddy",
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/habits.png",
      backgroundColor: "#ffffff",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "63860792-6cb6-45e6-b7f6-dae7c8d7b6f5",
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
    owner: "louaialayoubi",
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/63860792-6cb6-45e6-b7f6-dae7c8d7b6f5",
    },
  },
};
