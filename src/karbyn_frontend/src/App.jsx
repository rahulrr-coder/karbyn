import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import { NFTProvider } from "./contexts/NFTContext";

function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <NFTProvider>
          <Routes />
        </NFTProvider>
      </ActivityProvider>
    </AuthProvider>
  );
}

export default App;
