import OnboardingRoute from "@/components/auth/OnboardingRoute";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Outlet } from "react-router";

const NormalLayout = () => {
  return (
    <OnboardingRoute>
      <Navbar />
      <Outlet />
      <Footer />
    </OnboardingRoute>
  );
};

export default NormalLayout;
