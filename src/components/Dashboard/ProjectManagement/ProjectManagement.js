import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        const q = query(
          collection(db, "projects"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userProjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(userProjects);
      }
    };

    fetchProjects();
  }, [user]);

  const handleViewProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleEditProject = (projectId) => {
    navigate(`/editproject/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      // Get the project document
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();

        // Delete the banner image
        if (projectData.bannerImage) {
          const bannerImageRef = ref(storage, projectData.bannerImage);
          await deleteObject(bannerImageRef);
        }

        // Delete the media files
        if (projectData.media && projectData.media.length > 0) {
          for (const mediaUrl of projectData.media) {
            const mediaRef = ref(storage, mediaUrl);
            await deleteObject(mediaRef);
          }
        }

        // Delete the project document
        await deleteDoc(doc(db, "projects", projectId));
        setProjects(projects.filter((project) => project.id !== projectId));
      }
    } catch (error) {
      console.error("Error deleting project and media:", error);
    }
  };

  const handleCreateProject = () => {
    navigate("/ProjectForm");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Projects
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateProject}
        sx={{ mb: 4, display: "block", mx: "auto" }}
      >
        Create New Project
      </Button>
      <Grid container spacing={3}>
        {projects.length === 0 ? (
          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{ width: "100%" }}
          >
            No projects found.
          </Typography>
        ) : (
          projects.map((project) => (
            <Grid item xs={12} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {project.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {project.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewProject(project.id)}
                    sx={{ mt: 2 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditProject(project.id)}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProject(project.id)}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default ProjectManagement;
