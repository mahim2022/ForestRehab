import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const ViewProject = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams(); // Get the projectId from the route params
  const navigate = useNavigate();
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
              setProject(fetchedProject);
            } else {
              console.error("You do not have permission to view this project.");
              navigate("/"); // Redirect if user does not own the project
            }
          } else {
            console.error("No such project!");
            navigate("/"); // Redirect if no project found
          }
        } catch (err) {
          console.error("Error fetching project:", err);
          navigate("/"); // Redirect on error
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [user, projectId, navigate]);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  if (!project) {
    return (
      <Typography variant="h6" align="center">
        Project not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {project.title}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Description
          </Typography>
          <Typography color="textSecondary">{project.description}</Typography>
          <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
            Objectives
          </Typography>
          <Typography color="textSecondary">{project.objectives}</Typography>
          <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
            Timeline
          </Typography>
          <Typography color="textSecondary">{project.timeline}</Typography>
          <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
            Address
          </Typography>
          <Typography color="textSecondary">{project.address}</Typography>
          {project.bannerImage && (
            <img
              src={project.bannerImage}
              alt="Banner"
              style={{ width: "100%", marginTop: "16px" }}
            />
          )}
          {project.media && project.media.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              {project.media.map((url, index) => (
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
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={() => navigate(`/edit-project/${projectId}`)}
      >
        Edit Project
      </Button>
    </Container>
  );
};

export default ViewProject;
