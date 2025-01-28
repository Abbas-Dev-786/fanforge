import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import MUIProvider from "./providers/mui-provider.jsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { register } from "./utils/serviceWorkerRegistration";

const queryClient = new QueryClient();

// Register service worker
register();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MUIProvider>
          <App />
        </MUIProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
