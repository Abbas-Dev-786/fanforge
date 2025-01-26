import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import MUIProvider from "./providers/mui-provider.jsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MUIProvider>
        <App />
      </MUIProvider>
    </BrowserRouter>
  </StrictMode>
);
