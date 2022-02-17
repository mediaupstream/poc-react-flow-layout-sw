import React from "react";
import ReactDOM from "react-dom";
import { ReactFlowProvider } from "react-flow-renderer";
import Routes from "./Routes";

import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ReactFlowProvider>
      <Routes />
    </ReactFlowProvider>
  </React.StrictMode>,
  rootElement
);
