import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { NFTProvider } from "./contexts/NFTContext";
import { ActivityProvider } from "./contexts/ActivityContext";

function App() {
  return (
    <AuthProvider>
      <NFTProvider>
        <ActivityProvider>
          <Routes />
        </ActivityProvider>
      </NFTProvider>
    </AuthProvider>
  );
}

export default App;
