import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// Configuration for Web3Auth
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // Placeholder client ID

// Chain configuration for Ethereum (you can change this later if needed)
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

// Private key provider configuration
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Web3Auth configuration with minimal settings to avoid analytics issues
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  enableLogging: false, // Disable logging to reduce dependencies
  uiConfig: {
    appName: "Karbyn Carbon Credit Platform",
    mode: "light",
    loginMethodsOrder: ["google", "github", "twitter"],
    logoLight: undefined, // Remove logo to avoid loading issues
    logoDark: undefined,
    defaultLanguage: "en",
    modalZIndex: "99999",
    uxMode: "popup",
    theme: {
      primary: "#22c55e", // Green theme to match your carbon credit platform
    },
  },
});

// Helper function to initialize Web3Auth
export const initWeb3Auth = async () => {
  try {
    await web3auth.init();
    console.log("Web3Auth initialized successfully");
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
    throw error;
  }
};

// Helper function to connect wallet
export const connectWallet = async () => {
  try {
    const web3authProvider = await web3auth.connect();
    console.log("Web3Auth connected successfully");
    return web3authProvider;
  } catch (error) {
    console.error("Error connecting Web3Auth:", error);
    throw error;
  }
};

// Helper function to disconnect wallet
export const disconnectWallet = async () => {
  try {
    await web3auth.logout();
    console.log("Web3Auth disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting Web3Auth:", error);
    throw error;
  }
};

// Helper function to get user info
export const getUserInfo = async () => {
  try {
    const user = await web3auth.getUserInfo();
    console.log("User info:", user);
    return user;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

// Helper function to check if user is connected
export const isConnected = () => {
  return web3auth.connected;
};

export default web3auth;
