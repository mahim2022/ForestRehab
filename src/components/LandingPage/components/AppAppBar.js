import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ToggleColorMode from "./ToggleColorMode";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import { useState, useEffect } from "react";

// import MenuItem from "@mui/material/MenuItem";

import Sitemark from "./SitemarkIcon";

import { useNavigate } from "react-router-dom";

function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderRadius: "999px",
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "hsla(220, 60%, 99%, 0.6)",
            boxShadow:
              "0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)",
            ...theme.applyStyles("dark", {
              bgcolor: "hsla(220, 0%, 0%, 0.7)",
              boxShadow:
                "0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)",
            }),
          })}
        >
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("report")}
              >
                Reports
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("projectList")}
              >
                Projects
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("resourcesList")}
              >
                Knowledge Hub
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("forum")}
              >
                Community
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("news")}
                sx={{ minWidth: 0 }}
              >
                News
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("contact")}
                sx={{ minWidth: 0 }}
              >
                Contact
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("dashboard")}
                sx={{ minWidth: 0 }}
              >
                Dashboard
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              alignItems: "center",
            }}
          >
            <ToggleColorMode
              data-screenshot="toggle-mode"
              mode={mode}
              toggleColorMode={toggleColorMode}
            />
            {user ? (
              <>
                <IconButton onClick={handleAvatarClick}>
                  <Avatar src={user.photoURL} alt={user.displayName} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={() => navigate("signin")}
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => navigate("signup")}
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { sm: "flex", md: "none" } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <ToggleColorMode
                    mode={mode}
                    toggleColorMode={toggleColorMode}
                  />
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem onClick={() => scrollToSection("features")}>
                  Features
                </MenuItem>
                <MenuItem onClick={() => scrollToSection("testimonials")}>
                  Testimonials
                </MenuItem>
                <MenuItem onClick={() => scrollToSection("highlights")}>
                  Highlights
                </MenuItem>
                <MenuItem onClick={() => scrollToSection("pricing")}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => scrollToSection("faq")}>FAQ</MenuItem>
                {user ? (
                  <>
                    <MenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={() => navigate("signup")}
                      >
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate("signin")}
                      >
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
