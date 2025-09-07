import React from "react";
import { Stage } from "./components/Stage";
import "./App.css";
import { GraphContextProvider } from "./contexts/GraphContextProvider";

const App: React.FC = () => {
  return (
    <GraphContextProvider>
      <Stage />
    </GraphContextProvider>
  );
};

export default App;
