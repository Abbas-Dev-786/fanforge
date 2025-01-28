import { Suspense, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "../../contexts/AuthContext";
import BottomNav from "../../components/dashboard/BottomNav";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 12,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 12,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  // Mobile padding adjustments
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(10), // Space for bottom navigation
  },
}));

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} isMobile={isMobile} />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
        isMobile={isMobile}
      />
      <MainStyle>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <Outlet />
        </Suspense>
      </MainStyle>
      {isMobile && <BottomNav />}
    </RootStyle>
  );
}
