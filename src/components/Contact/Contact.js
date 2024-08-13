import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Send as SendIcon,
} from "@mui/icons-material";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      alert("Message sent successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contact Us
      </Typography>
      {submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Thank you for your message. We will get back to you shortly.
        </Alert>
      )}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <LocationOn color="primary" fontSize="large" />
            <Typography variant="h6" component="p" gutterBottom>
              Our Location
            </Typography>
            <Typography variant="body1" color="textSecondary">
              1234 Street Name, City, State, 56789
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Phone color="primary" fontSize="large" />
            <Typography variant="h6" component="p" gutterBottom>
              Call Us
            </Typography>
            <Typography variant="body1" color="textSecondary">
              +1 (234) 567-890
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Email color="primary" fontSize="large" />
            <Typography variant="h6" component="p" gutterBottom>
              Email Us
            </Typography>
            <Typography variant="body1" color="textSecondary">
              contact@yourcompany.com
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": { mb: 2 },
          "& .MuiButton-root": { mt: 2 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={loading}
          sx={{
            backgroundColor: "#2196F3",
            "&:hover": {
              backgroundColor: "#1976D2",
            },
            px: 4,
            py: 1,
            fontSize: "16px",
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Send Message"}
        </Button>
      </Box>
    </Container>
  );
};

export default Contact;
