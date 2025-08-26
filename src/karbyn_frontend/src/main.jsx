// Import polyfills first
import './polyfills.js';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3authContextConfig from "./config/web3authContext.js";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Web3AuthProvider config={web3authContextConfig}>
    <App />
  </Web3AuthProvider>
);
