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

const ResourceManager = () => {
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchResources = async () => {
      if (user) {
        // Fetch user type
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userType = userDoc.exists() ? userDoc.data().userType : null;

        let q;
        if (userType === "admin") {
          // If admin, fetch all resources
          q = query(collection(db, "resources"));
        } else {
          // If not admin or userType is undefined, fetch only resources for this user
          q = query(
            collection(db, "resources"),
            where("userId", "==", user.uid)
          );
        }

        const querySnapshot = await getDocs(q);
        const userResources = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(userResources);
      }
    };

    fetchResources();
  }, [user]);

  const handleViewResource = (resourceId) => {
    navigate(`/resource/${resourceId}`);
  };

  const handleEditResource = (resourceId) => {
    navigate(`/edit-resource/${resourceId}`);
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      const resourceDoc = await getDoc(doc(db, "resources", resourceId));
      if (resourceDoc.exists()) {
        const resourceData = resourceDoc.data();
        const fileRef = ref(storage, resourceData.fileURL);
        await deleteObject(fileRef);
        await deleteDoc(doc(db, "resources", resourceId));
        setResources((prevResources) =>
          prevResources.filter((resource) => resource.id !== resourceId)
        );
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleUploadResource = () => {
    navigate("/uploadresource");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Resources
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUploadResource}
        sx={{ mb: 4, display: "block", mx: "auto" }}
      >
        Upload New Resource
      </Button>
      <Grid container spacing={3}>
        {resources.length === 0 ? (
          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{ width: "100%" }}
          >
            No resources found.
          </Typography>
        ) : (
          resources.map((resource) => (
            <Grid item xs={12} key={resource.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {resource.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {resource.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewResource(resource.id)}
                    sx={{ mt: 2 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditResource(resource.id)}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteResource(resource.id)}
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

export default ResourceManager;
