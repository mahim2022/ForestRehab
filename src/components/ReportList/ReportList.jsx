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
} from "@mui/material";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const ReportList = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>
      <Grid container spacing={4}>
        {reports.map((report) => (
          <Grid item key={report.id} xs={12} sm={6} md={4}>
            <Card>
              {report.imageUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={report.imageUrl}
                  alt={report.title}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {report.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {truncateText(report.description, 100)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {report.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(
                    report.timestamp.seconds * 1000
                  ).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/report/${report.id}`}
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

export default ReportList;
