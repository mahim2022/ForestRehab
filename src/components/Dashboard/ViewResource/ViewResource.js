import React, { useState, useEffect } from "react";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

const ViewResource = () => {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileURL, setFileURL] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const docRef = doc(db, "resources", resourceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const resourceData = docSnap.data();
          setResource(resourceData);

          // Get the download URL of the file
          const url = await getDownloadURL(ref(storage, resourceData.fileURL));
          setFileURL(url);
        } else {
          console.error("No such resource!");
          navigate("/resource-management"); // Redirect if no resource found
        }
      } catch (err) {
        console.error("Error fetching resource:", err);
        navigate("/resource-management"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceId, navigate]);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        <CircularProgress />
        Loading...
      </Typography>
    );
  }

  if (!resource) {
    return (
      <Typography variant="h6" align="center">
        Resource not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {resource.title}
      </Typography>
      <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
        Description
      </Typography>
      <Typography color="textSecondary">{resource.description}</Typography>
      <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
        Uploaded by
      </Typography>
      <Typography color="textSecondary">{resource.userEmail}</Typography>
      <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
        Upload Date
      </Typography>
      <Typography color="textSecondary">
        {resource.timestamp?.toDate().toString()}
      </Typography>
      {fileURL ? (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => window.open(fileURL, "_blank")}
        >
          Download Resource
        </Button>
      ) : (
        <Typography variant="h6" align="center">
          Unable to load the document.
        </Typography>
      )}
    </Container>
  );
};

export default ViewResource;
