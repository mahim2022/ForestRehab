import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Button,
  CardActions,
} from "@mui/material";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "Forest Reservation",
            language: "en",
            sortBy: "publishedAt",
            apiKey: "bcd69d37427d4d0d9a460db8a5b4d712", // Replace with your actual API key
          },
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Forest Preservation News
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {news.map((article, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                {article.urlToImage && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={article.urlToImage}
                    alt={article.title}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {truncateText(article.description, 100)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Author: {article.author}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component="a"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="primary"
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default News;
