import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { Dashboard } from "@mui/icons-material";
import { MilitaryTech } from "@mui/icons-material";

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const navConfig = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <Dashboard />,
  },
  {
    title: "Standings",
    path: "/dashboard/standings",
    icon: <MilitaryTech />,
  },
  {
    title: "Profile",
    path: "/dashboard/profile",
    icon: <PersonIcon />,
  },
  {
    title: "Teams",
    path: "/dashboard/teams",
    icon: <GroupsIcon />,
  },
  {
    title: "Highlights",
    path: "/dashboard/highlights",
    icon: <OndemandVideoIcon />,
  },
];

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <>
      <Box
        sx={{
          px: 2.5,
          py: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component={RouterLink}
          to="/dashboard"
          sx={{
            color: "text.primary",
            textDecoration: "none",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          FanForge
        </Typography>
      </Box>

      {/* <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="/profile">
          <AccountStyle>
            <Avatar src={currentUser?.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {currentUser?.email}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box> */}

      <List disablePadding sx={{ p: 1 }}>
        {navConfig.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            active={pathname === item.path}
          />
        ))}
      </List>
    </>
  );

  return (
    <RootStyle>
      <Drawer
        open={isOpenSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            bgcolor: "background.default",
            borderRight: "1px solid #e0e0e0",
          },
        }}
        sx={{
          display: { lg: "none" },
        }}
      >
        {renderContent}
      </Drawer>

      <Drawer
        open
        variant="persistent"
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            bgcolor: "background.default",
            borderRight: "1px solid #e0e0e0",
          },
        }}
        sx={{
          display: {
            xs: "none",
            lg: "block",
          },
        }}
      >
        {renderContent}
      </Drawer>
    </RootStyle>
  );
}

// NavItem Component
function NavItem({ item, active }) {
  const { title, path, icon } = item;

  return (
    <ListItemButton
      component={RouterLink}
      to={path}
      sx={{
        "&.active": {
          color: "primary.main",
          bgcolor: "action.selected",
          fontWeight: "fontWeightBold",
        },
        ...(active && {
          color: "primary.main",
          bgcolor: "action.selected",
          fontWeight: "fontWeightBold",
        }),
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText disableTypography primary={title} />
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.bool,
};
