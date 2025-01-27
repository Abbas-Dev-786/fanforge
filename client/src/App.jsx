import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router";
import { AuthContextProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/auth/Onboarding";
import Profile from "./pages/Profile";
import NormalLayout from "./layouts/normal-layout";
import Home from "./pages/Home";
import NotFound from "./pages/error/NotFound";
import Forbidden from "./pages/error/Forbidden";

const App = () => {
  return (
    <AuthContextProvider>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<NormalLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContextProvider>
  );
};

export default App;
