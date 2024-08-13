import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4}>
            <Card>
              {project.bannerImage && (
                <CardMedia
                  component="img"
                  height="140"
                  image={project.bannerImage}
                  alt={project.title}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {truncateText(project.description, 100)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Objectives: {truncateText(project.objectives, 100)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Timeline: {project.timeline}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Address: {project.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(
                    project.timestamp.seconds * 1000
                  ).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/project/${project.id}`}
                  size="small"
                  color="primary"
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectList;
