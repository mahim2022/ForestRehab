import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "forumPosts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
          setTitle(docSnap.data().title);
          setContent(docSnap.data().content);
        } else {
          console.error("No such post!");
          navigate("/forum");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        navigate("/forum");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, "forumPosts", postId), {
        title,
        content,
        timestamp: serverTimestamp(),
      });
      alert("Post updated successfully!");
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  if (!post) {
    return (
      <Typography variant="h6" align="center">
        Post not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Post
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
          {loading ? <CircularProgress size={24} /> : "Update Post"}
        </Button>
      </form>
    </Container>
  );
};

export default EditPost;
