import { WEB3AUTH_NETWORK } from "@web3auth/modal";

const web3AuthOptions = {
  clientId: (typeof import.meta !== "undefined" ? import.meta.env.VITE_WEB3AUTH_CLIENT_ID : undefined)
    || process.env.REACT_APP_WEB3AUTH_CLIENT_ID
    || "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
};

const web3authContextConfig = { web3AuthOptions };

export default web3authContextConfig;
