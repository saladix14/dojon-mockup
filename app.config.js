import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "dojon-web3-ninja",
    slug: "dojon-web3-ninja",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/avatar.png",
    splash: {
      image: "./assets/splash.png", // <-- aquí está la corrección
      resizeMode: "contain",
      backgroundColor: "#0a0a0a"
    },
    platforms: ["ios", "android"],
    android: {
      package: "com.riko.dojon",
      versionCode: 1
    },
    ios: {
      bundleIdentifier: "com.riko.dojon"
    },
    extra: {
      // Tu Infura ID
      INFURA_ID: process.env.INFURA_ID || "61fd4076ff1a46e4bb3c9",
      // Configuración de EAS
      eas: {
        projectId: "59d07a5f-c567-4ed2-a342-4d35cdfdfe0c"
      },
      // Puedes seguir añadiendo aquí más variables extra si las necesitas
    }
  }
});
