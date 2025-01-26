import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import MUIProvider from "./providers/mui-provider.jsx";
import { Router } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <MUIProvider>
        <App />
      </MUIProvider>
    </Router>
  </StrictMode>
);
