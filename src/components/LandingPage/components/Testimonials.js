import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";

const userTestimonials = [
  {
    avatar: <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />,
    name: "Sarah Thompson",
    occupation: "Director of Green Earth Alliance",
    testimonial:
      "Our partnership with the Forest Guardians platform has been a game-changer. The community forum has allowed us to connect with thousands of dedicated conservationists, leading to unprecedented collaboration on our projects. The resource database is a treasure trove of information that has significantly enhanced our research and advocacy efforts.",
  },
  {
    avatar: <Avatar alt="Carlos Ramirez" src="/static/images/avatar/2.jpg" />,
    name: "Carlos Ramirez",
    occupation: "Program Manager at Wildlife Protection Network",
    testimonial:
      "The Forest Guardians website is a remarkable tool for anyone passionate about forest conservation. The latest news section keeps us updated on critical developments, and the community forum is a fantastic place to exchange ideas and find support. Thanks to this platform, we’ve been able to mobilize more volunteers and amplify our impact.",
  },
  {
    avatar: <Avatar alt="Emily Chen" src="/static/images/avatar/3.jpg" />,
    name: "Emily Chen",
    occupation: "Education Coordinator for Eco Warriors International",
    testimonial:
      "As an organization focused on education and awareness, we’ve found the resource database on Forest Guardians to be invaluable. It’s packed with credible, well-organized materials that we regularly use in our workshops and training sessions. The sense of community on the forum is inspiring, fostering a spirit of unity and shared purpose.",
  },
  {
    avatar: <Avatar alt="Michael O’Connor" src="/static/images/avatar/4.jpg" />,
    name: "Michael O’Connor",
    occupation: "Advocacy Director at Rainforest Rescue",
    testimonial:
      "Forest Guardians has become an essential part of our conservation toolkit. The platform’s comprehensive resources and active community have provided us with new insights and strategies to combat deforestation. The regular news updates keep us informed about the latest trends and policies, enabling us to respond quickly and effectively.",
  },
  {
    avatar: <Avatar alt="Amina Patel" src="/static/images/avatar/5.jpg" />,
    name: "Amina Patel",
    occupation: " Project Leader at Global Tree Initiative",
    testimonial:
      "We’ve been incredibly impressed by the engagement and support we’ve received through the Forest Guardians forum. It’s a vibrant community where we’ve found new partners and volunteers eager to support our reforestation projects. The wealth of information in the resource database is unparalleled and has significantly boosted our operational efficiency.",
  },
  {
    avatar: <Avatar alt="Amina Patel" src="/static/images/avatar/6.jpg" />,
    name: "Amina Patel",
    occupation: "Project Leader at Global Tree Initiative",
    testimonial:
      "We’ve been incredibly impressed by the engagement and support we’ve received through the Forest Guardians forum. It’s a vibrant community where we’ve found new partners and volunteers eager to support our reforestation projects. The wealth of information in the resource database is unparalleled and has significantly boosted our operational efficiency.",
  },
];

const whiteLogos = [
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg",
];

const darkLogos = [
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg",
];

const logoStyle = {
  width: "64px",
  opacity: 0.3,
};

export default function Testimonials() {
  const theme = useTheme();
  const logos = theme.palette.mode === "light" ? darkLogos : whiteLogos;

  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography component="h2" variant="h4" sx={{ color: "text.primary" }}>
          Testimonials
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          See what our customers love about our products. Discover how we excel
          in efficiency, durability, and satisfaction. Join us for quality,
          innovation, and reliable support.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                p: 1,
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  pr: 2,
                }}
              >
                <CardHeader
                  avatar={testimonial.avatar}
                  title={testimonial.name}
                  subheader={testimonial.occupation}
                />
                <img
                  src={logos[index]}
                  alt={`Logo ${index + 1}`}
                  style={logoStyle}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
