import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PersonIcon from "@mui/icons-material/Person";

const StyledBottomNav = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "none",
  [theme.breakpoints.down("lg")]: {
    display: "block",
  },
}));

const navItems = [
  {
    label: "Home",
    icon: <HomeIcon />,
    path: "/dashboard",
  },
  {
    label: "Teams",
    icon: <GroupsIcon />,
    path: "/dashboard/teams",
  },
  {
    label: "Highlights",
    icon: <OndemandVideoIcon />,
    path: "/dashboard/highlights",
  },
  {
    label: "Profile",
    icon: <PersonIcon />,
    path: "/dashboard/profile",
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getCurrentValue = () => {
    const currentPath = navItems.find((item) => pathname.startsWith(item.path));
    return currentPath ? currentPath.path : false;
  };

  return (
    <StyledBottomNav elevation={3}>
      <BottomNavigation
        value={getCurrentValue()}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
            value={item.path}
          />
        ))}
      </BottomNavigation>
    </StyledBottomNav>
  );
} 