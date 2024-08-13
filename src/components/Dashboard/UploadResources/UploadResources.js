import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadResource = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      alert("Please fill all fields and select a file.");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `resources/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "resources"), {
        title,
        description,
        fileURL: downloadURL,
        fileName: file.name,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
      });

      alert("Resource uploaded successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading resource:", error);
      alert("Error uploading resource. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Resource
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          margin="normal"
        />
        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && <Typography variant="body1">{file.name}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </Container>
  );
};

export default UploadResource;
