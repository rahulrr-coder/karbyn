// web3authContext.js
import { WEB3AUTH_NETWORK } from "@web3auth/modal";

const web3AuthOptions = {
  clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // Placeholder client ID
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Using mainnet for production client ID
  uiConfig: {
    appName: "Karbyn Carbon Credit Platform",
    mode: "light",
    loginMethodsOrder: ["google", "github", "twitter", "discord"],
    logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
    logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
    defaultLanguage: "en",
    modalZIndex: "99999",
    uxMode: "popup",
    theme: {
      primary: "#22c55e", // Green theme to match your carbon credit platform
    },
  },
};

const web3AuthContextConfig = {
  web3AuthOptions,
};

export default web3AuthContextConfig;
