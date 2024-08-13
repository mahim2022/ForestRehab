import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/signin"); // Redirect to signin if user is not authenticated
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "forumPosts"), {
        title,
        content,
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
      });
      alert("Post created successfully!");
      navigate("/forum");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={{ toolbar: true }}
          style={{ height: "400px", marginBottom: "16px" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Post"}
        </Button>
      </form>
    </Container>
  );
};

export default CreatePost;
