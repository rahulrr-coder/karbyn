import React from "react";
import Routes from "./Routes";
import { MultiWalletAuthProvider } from "./contexts/MultiWalletAuthContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import { NFTProvider } from "./contexts/NFTContext";

function App() {
  return (
    <MultiWalletAuthProvider>
      <ActivityProvider>
        <NFTProvider>
          <Routes />
        </NFTProvider>
      </ActivityProvider>
    </MultiWalletAuthProvider>
  );
}

export default App;
