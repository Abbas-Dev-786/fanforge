import { lazy, Suspense } from "react";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router";
import { AuthContextProvider } from "./contexts/AuthContext";
import NormalLayout from "./layouts/normal-layout";
import LoadingScreen from "./components/LoadingScreen";
import DashboardLayout from "./layouts/dashboard";
import Dashboard from "./pages/dashboard/Dashboard";

// Lazy load components
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Onboarding = lazy(() => import("./pages/auth/Onboarding"));
const Profile = lazy(() => import("./pages/Profile"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/error/NotFound"));
const Forbidden = lazy(() => import("./pages/error/Forbidden"));
const Teams = lazy(() => import("./pages/dashboard/Teams"));
const TeamDetails = lazy(() => import("./pages/dashboard/TeamDetails"));
const PlayerDetails = lazy(() => import("./pages/dashboard/PlayerDetails"));
const Highlights = lazy(() => import("./pages/dashboard/Highlights"));

const App = () => {
  return (
    <AuthContextProvider>
      <CssBaseline />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<NormalLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="teams" element={<Teams />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="players/:playerId" element={<PlayerDetails />} />
            <Route path="highlights" element={<Highlights />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthContextProvider>
  );
};

export default App;
