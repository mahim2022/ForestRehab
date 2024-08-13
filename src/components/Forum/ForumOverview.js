import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const PAGE_SIZE = 10;

const ForumOverview = () => {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "forumPosts"),
        orderBy("timestamp", sortOrder),
        limit(PAGE_SIZE * page)
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, [sortOrder, page]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Forum
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Sort Order</InputLabel>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          label="Sort Order"
        >
          <MenuItem value="desc">Newest First</MenuItem>
          <MenuItem value="asc">Oldest First</MenuItem>
        </Select>
      </FormControl>
      <Button
        component={Link}
        to="/create-post"
        variant="contained"
        color="primary"
        sx={{ mb: 4 }}
      >
        Create New Post
      </Button>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {post.content.substring(0, 100)}...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(post.timestamp.seconds * 1000).toLocaleDateString()}
                </Typography>
              </CardContent>
              <Button
                component={Link}
                to={`/post/${post.id}`}
                size="small"
                color="primary"
              >
                View Post
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLoadMore}
        sx={{ mt: 4 }}
      >
        Load More
      </Button>
    </Container>
  );
};

export default ForumOverview;
