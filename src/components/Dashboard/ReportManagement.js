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
import { auth, db, storage } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchReports = async () => {
      if (user) {
        // Fetch user type
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userType = userDoc.exists() ? userDoc.data().userType : null;

        let q;
        if (userType === "admin") {
          // If admin, fetch all reports
          q = query(collection(db, "reports"));
        } else {
          // If not admin or userType is undefined, fetch only reports for this user
          q = query(collection(db, "reports"), where("userId", "==", user.uid));
        }

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
    try {
      // Fetch the report document to get the image URL
      const reportRef = doc(db, "reports", reportId);
      const reportSnapshot = await getDoc(reportRef);
      const reportData = reportSnapshot.data();

      // Delete the image from Firebase Storage if it exists
      if (reportData && reportData.imageUrl) {
        const imageRef = ref(storage, reportData.imageUrl);
        await deleteObject(imageRef);
      }

      // Delete the report document from Firestore
      await deleteDoc(reportRef);

      // Optionally, refresh the UI or navigate to a different page
      // e.g., navigate("/"); or update state to remove the deleted report
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
    } catch (error) {
      console.error("Error deleting report or image:", error);
      // Optionally, display an error message to the user
    }
  };

  const handleCreateReport = () => {
    navigate("/reportForm");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Reports
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateReport}
        sx={{ mb: 4, display: "block", mx: "auto" }}
      >
        Create New Report
      </Button>
      <Grid container spacing={3}>
        {reports.length === 0 ? (
          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{ width: "100%" }}
          >
            No reports found.
          </Typography>
        ) : (
          reports.map((report) => (
            <Grid item xs={12} key={report.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {report.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {truncateText(report.description, 100)}
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
          ))
        )}
      </Grid>
    </Container>
  );
};

export default ReportManagement;
