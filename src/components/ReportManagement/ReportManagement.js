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
import { auth, firestore } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchReports = async () => {
      if (user) {
        const q = query(
          collection(firestore, "reports"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userReports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(userReports);
      }
    };

    fetchReports();
  }, [user]);

  const handleViewReport = (reportId) => {
    navigate(`/report/${reportId}`);
  };

  const handleEditReport = (reportId) => {
    navigate(`/edit-report/${reportId}`);
  };

  const handleDeleteReport = async (reportId) => {
    await firestore.collection("reports").doc(reportId).delete();
    setReports(reports.filter((report) => report.id !== reportId));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Reports
      </Typography>
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} key={report.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {report.title}
                </Typography>
                <Typography color="textSecondary">
                  {report.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewReport(report.id)}
                  sx={{ mt: 2 }}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditReport(report.id)}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteReport(report.id)}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReportManagement;
