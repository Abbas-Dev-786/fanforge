import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import { AuthContextProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import NormalLayout from "./layouts/normal-layout";
import Register from "./pages/auth/Register";

const App = () => {
  return (
    <AuthContextProvider>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<NormalLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthContextProvider>
  );
};

export default App;
