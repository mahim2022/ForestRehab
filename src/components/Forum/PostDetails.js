import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "forumPosts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
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

  useEffect(() => {
    const fetchComments = async () => {
      const commentsQuery = collection(db, `forumPosts/${postId}/comments`);
      const sortedCommentsQuery = query(
        commentsQuery,
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(sortedCommentsQuery, (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      });

      return () => unsubscribe();
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment) {
      alert("Please enter a comment.");
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        alert("You must be logged in to comment.");
        navigate("/signin");
        return;
      }

      await addDoc(collection(db, `forumPosts/${postId}/comments`), {
        content: newComment,
        timestamp: new Date(), // Save the current time
        userId: user.uid,
        userEmail: user.email,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment. Please try again.");
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
        {post.title}
      </Typography>
      <Typography
        variant="body1"
        paragraph
        dangerouslySetInnerHTML={{ __html: post.content }}
      >
        {/* {post.content} */}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} alignItems="flex-start">
            <Avatar sx={{ mr: 2 }}>
              {comment.userEmail.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText
              primary={comment.content}
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    {comment.userEmail}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(
                      comment.timestamp.seconds * 1000
                    ).toLocaleString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <form onSubmit={handleSubmitComment}>
        <TextField
          label="Add a comment"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Comment"}
        </Button>
      </form>
    </Container>
  );
};

export default PostDetails;
