import React, { useState, useEffect } from "react";
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
import { db, storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../../firebase";

const EditProject = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    objectives: "",
    timeline: "",
    address: "",
    bannerImage: null,
    media: [],
    bannerImageUrl: "",
    mediaUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProject = async () => {
      if (user && projectId) {
        try {
          const docRef = doc(db, "projects", projectId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const fetchedProject = docSnap.data();
            if (fetchedProject.userId === user.uid) {
              setForm({
                ...form,
                ...fetchedProject,
                bannerImageUrl: fetchedProject.bannerImage,
                mediaUrls: fetchedProject.media,
              });
            } else {
              console.error("You do not have permission to edit this project.");
              navigate("/");
            }
          } else {
            console.error("No such project!");
            navigate("/");
          }
        } catch (err) {
          console.error("Error fetching project:", err);
          navigate("/");
        }
      }
    };

    fetchProject();
  }, [user, projectId, navigate]);

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
      let bannerImageUrl = form.bannerImageUrl;
      if (form.bannerImage) {
        const bannerImageRef = ref(storage, `banners/${form.bannerImage.name}`);
        await uploadBytes(bannerImageRef, form.bannerImage);
        bannerImageUrl = await getDownloadURL(bannerImageRef);
      }

      const mediaUrls = await Promise.all(
        form.media.map(async (file) => {
          const mediaRef = ref(storage, `media/${file.name}`);
          await uploadBytes(mediaRef, file);
          return await getDownloadURL(mediaRef);
        })
      );

      await updateDoc(doc(db, "projects", projectId), {
        title: form.title,
        description: form.description,
        objectives: form.objectives,
        timeline: form.timeline,
        address: form.address,
        bannerImage: bannerImageUrl,
        media: mediaUrls.length > 0 ? mediaUrls : form.mediaUrls,
      });

      navigate(`/project/${projectId}`);
    } catch (err) {
      console.error("Error updating project:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!form.title) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Edit Reforestation Project
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
              rows={6}
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
              label="Address"
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
            {form.bannerImageUrl && (
              <img
                src={form.bannerImageUrl}
                alt="Banner"
                style={{ width: "100%", marginTop: "16px" }}
              />
            )}
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
            {form.mediaUrls && form.mediaUrls.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                {form.mediaUrls.map((url, index) => (
                  <div key={index} style={{ marginBottom: "16px" }}>
                    <img
                      src={url}
                      alt={`Media ${index}`}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditProject;
