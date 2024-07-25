import React, { useState } from "react";
import { db, storage, auth } from "../../firebase";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    objectives: "",
    timeline: "",
    bannerImage: null,
    media: [],
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "bannerImage") {
      setForm({ ...form, bannerImage: files[0] });
    } else {
      setForm({ ...form, media: [...files] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bannerImageRef = ref(storage, `banners/${form.bannerImage.name}`);
      await uploadBytes(bannerImageRef, form.bannerImage);
      const bannerImageUrl = await getDownloadURL(bannerImageRef);

      const mediaUrls = await Promise.all(
        form.media.map(async (file) => {
          const mediaRef = ref(storage, `media/${file.name}`);
          await uploadBytes(mediaRef, file);
          return await getDownloadURL(mediaRef);
        })
      );

      await addDoc(collection(db, "projects"), {
        ...form,
        bannerImage: bannerImageUrl,
        media: mediaUrls,
        timestamp: Timestamp.fromDate(new Date()),
        userId: user.uid, // Store the user's ID
      });

      navigate("/");
    } catch (err) {
      console.error("Error uploading project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Upload Reforestation Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Project Title"
              name="title"
              fullWidth
              required
              value={form.title}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={6}
              required
              value={form.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Objectives"
              name="objectives"
              fullWidth
              multiline
              rows={4}
              required
              value={form.objectives}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Timeline"
              name="timeline"
              fullWidth
              required
              value={form.timeline}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Project Address"
              name="address"
              fullWidth
              required
              value={form.address}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Banner Image
              <input
                type="file"
                name="bannerImage"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Media Files
              <input
                type="file"
                name="media"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Project"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ProjectForm;
