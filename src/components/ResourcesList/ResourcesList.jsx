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
  Button,
  CardActions,
} from "@mui/material";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const ResourcesList = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "resources"), (snapshot) => {
      const resourcesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(resourcesData);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Resources
      </Typography>
      <Grid container spacing={4}>
        {resources.map((resource) => (
          <Grid item key={resource.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {resource.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {truncateText(resource.description, 100)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Uploaded by: {resource.userEmail}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(
                    resource.timestamp.seconds * 1000
                  ).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/resource/${resource.id}`}
                  size="small"
                  color="primary"
                >
                  View Resource
                </Button>
                {/* <Button
                  href={resource.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  color="secondary"
                >
                  Download
                </Button> */}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResourcesList;
