export default {
  expo: {
    name: "Dojn",
    slug: "dojon-web3-ninja",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/avatar.png",
    splash: {
      image: "./assets/logo-animation.json",
      resizeMode: "contain",
      backgroundColor: "#0a0a0a"
    },
    platforms: ["ios", "android"],
    android: {
      package: "com.riko.dojon",
      versionCode: 1
    },
    extra: {
      INFURA_ID: process.env.INFURA_ID || "<TU_INFURA_PROJECT_ID>"
    }
  }
};
