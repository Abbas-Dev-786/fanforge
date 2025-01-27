import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { CircularProgress, Box } from "@mui/material";

export default function OnboardingRoute({ children }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "interests", currentUser.uid));

        if (userDoc.exists()) {
          setHasCompletedOnboarding(
            userDoc.data().onboardingCompleted || false
          );
        } else {
          setHasCompletedOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasCompletedOnboarding(false);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [currentUser]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return children;
  }

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

OnboardingRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
