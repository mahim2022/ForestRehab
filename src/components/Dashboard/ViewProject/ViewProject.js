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
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const ViewProject = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const { projectId } = useParams(); // Get the projectId from the route params
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          const docRef = doc(db, "projects", projectId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const projectData = docSnap.data();
            setProject(projectData);

            if (
              user &&
              projectData.participants &&
              projectData.participants.includes(user.uid)
            ) {
              setIsParticipating(true);
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
  }, [projectId, navigate, user]);

  const handleParticipate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (project && !isParticipating) {
      try {
        const docRef = doc(db, "projects", projectId);
        await updateDoc(docRef, {
          participants: arrayUnion(user.uid),
        });
        setIsParticipating(true);
      } catch (err) {
        console.error("Error updating project:", err);
      }
    }
  };

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
          <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
            Participants:{" "}
            {project.participants ? project.participants.length : 0}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleParticipate}
            disabled={isParticipating}
          >
            {isParticipating ? "Already Participating" : "Participate"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewProject;
