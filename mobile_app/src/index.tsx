import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initializeWebsockets } from "./Services";
import { detectDarkMode } from "./theme/detect";

if (process.env.NODE_ENV === "production") {
  initializeWebsockets();
}

detectDarkMode();

ReactDOM.render(<App />, document.getElementById("root"));
