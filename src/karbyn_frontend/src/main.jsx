import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MultiWalletAuthProvider } from './contexts/MultiWalletAuthContext';
import { SimpleNFIDAuthProvider } from './contexts/SimpleNFIDAuthContext';
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MultiWalletAuthProvider>
        <SimpleNFIDAuthProvider>
          <App />
        </SimpleNFIDAuthProvider>
      </MultiWalletAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
