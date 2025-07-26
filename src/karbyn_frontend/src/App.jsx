import React from "react";
import Routes from "./Routes";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import { NFTProvider } from "./contexts/NFTContext";

function App() {
  return (
    <SimpleAuthProvider>
      <ActivityProvider>
        <NFTProvider>
          <Routes />
        </NFTProvider>
      </ActivityProvider>
    </SimpleAuthProvider>
  );
}

export default App;
