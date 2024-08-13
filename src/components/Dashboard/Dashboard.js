import React, { useEffect } from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check the authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/signin"); // Redirect to login if user is not authenticated
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Redirect to login after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const options = [
    { label: "Reports", path: "/reportManagement" },
    { label: "Projects", path: "/projectManagement" },
    { label: "Resources", path: "/resourceManager" },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {options.map((option, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                height: "150px",
                fontSize: "16px",
                borderRadius: 0,
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)",
                },
              }}
              onClick={() => navigate(option.path)}
            >
              {option.label}
            </Button>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              height: "150px",
              fontSize: "16px",
              borderRadius: 0,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)",
              },
            }}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
