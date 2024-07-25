import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase"; // Import Firestore and Storage instances
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs for the images
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Alert,
} from "@mui/material";
import { getAuth } from "firebase/auth";

function EditReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get the report ID from the URL parameters
  const auth = getAuth(); // Access Firebase Auth

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const reportData = docSnap.data();
          setTitle(reportData.title);
          setDescription(reportData.description);
          setLocation(reportData.location);
          setExistingImageUrl(reportData.imageUrl);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReport();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = existingImageUrl;
    if (image) {
      const imageRef = ref(storage, `reports/${uuidv4()}-${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      const user = auth.currentUser;
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, {
        title,
        description,
        location,
        imageUrl, // Save image URL in Firestore
        timestamp: new Date(),
        userId: user?.uid || null, // Save user ID in Firestore
        userEmail: user?.email || null, // Save user email in Firestore
      });
      navigate("/reportmanagement"); // Redirect to report management page after successful report update
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Report
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            {existingImageUrl && (
              <img
                src={existingImageUrl}
                alt="Report"
                style={{ width: "100%", marginBottom: "10px" }}
              />
            )}
            <Button variant="contained" component="label">
              Upload New Photo
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update Report
            </Button>
          </Grid>
        </Grid>
      </form>
      {error && (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default EditReportForm;
