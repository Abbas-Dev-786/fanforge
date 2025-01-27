import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleCloseMenu();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleProfile = () => {
    handleCloseMenu();
    navigate("/profile");
  };

  const navigationLinks = [
    { text: "Home", path: "/" },
    { text: "About", path: "/about" },
    { text: "Services", path: "/services" },
    // Add more navigation links as needed
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        FanForge
      </Typography>
      <Divider />
      <List>
        {navigationLinks.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {!currentUser ? (
          <>
            <ListItem
              component={Link}
              to="/login"
              sx={{
                textAlign: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              component={Link}
              to="/register"
              sx={{
                textAlign: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Register" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              onClick={handleProfile}
              sx={{ textAlign: "center", cursor: "pointer" }}
            >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
              onClick={handleLogout}
              sx={{ textAlign: "center", cursor: "pointer" }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{ borderBottom: "1px solid #ddd" }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo/Brand */}
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 800,
              }}
            >
              FanForge
            </Typography>

            {/* Navigation Links - Desktop */}
            {!isMobile && (
              <Box
                sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
              >
                {navigationLinks.map((link) => (
                  <Button
                    key={link.text}
                    color="inherit"
                    component={Link}
                    to={link.path}
                    sx={{ mx: 1 }}
                  >
                    {link.text}
                  </Button>
                ))}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* Auth Section - Desktop */}
              {
                <Box>
                  {currentUser ? (
                    <>
                      <Tooltip title="Account settings">
                        <IconButton onClick={handleOpenMenu}>
                          <Avatar
                            alt={currentUser.email}
                            src={currentUser.photoURL}
                            sx={{ width: 32, height: 32 }}
                          >
                            {currentUser.email?.charAt(0).toUpperCase()}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&:before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        }}
                      >
                        <MenuItem onClick={handleProfile}>
                          <Typography>Profile</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <Typography>Logout</Typography>
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        color="inherit"
                        component={Link}
                        to="/login"
                        variant="outlined"
                      >
                        Login
                      </Button>
                      {!isMobile && (
                        <Button
                          color="primary"
                          component={Link}
                          to="/register"
                          variant="contained"
                        >
                          Register
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              }

              {/* Hamburger Menu for Mobile */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
