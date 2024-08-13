import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { Chip as MuiChip } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/material/styles";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import EdgesensorHighRoundedIcon from "@mui/icons-material/EdgesensorHighRounded";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";

import image from "../../resource/be88b7618dcf098f8f35b44011750401.jpg";

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: "Community Forum",
    description:
      "Engage with like-minded individuals passionate about forest conservation. Our community forum provides a platform for discussions.",
    imageLight:
      'url("/static/images/templates/templates-images/dash-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/dash-dark.png")',
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: "Resource Database",
    description:
      "Access a comprehensive library of resources tailored for forest conservation. Our database includes scientific research, best practices, educational materials, and toolkits to help you effectively contribute to conservation efforts. Whether you’re a student, researcher, or volunteer, you’ll find valuable information to enhance your knowledge and skills.",
    imageLight:
      'url("/static/images/templates/templates-images/mobile-light.png")',
    imageDark:
      'url("/static/images/templates/templates-images/mobile-dark.png")',
  },
  {
    icon: <DevicesRoundedIcon />,
    title: "Latest News",
    description:
      "Stay informed with the latest updates in forest conservation. Our news section features current events, breakthroughs in conservation science, policy changes, and success stories from around the globe. Keep up with the evolving landscape of forest conservation and learn about new opportunities to get involved and make a difference.",
    imageLight:
      'url("/static/images/templates/templates-images/devices-light.png")',
    imageDark:
      'url("/static/images/templates/templates-images/devices-dark.png")',
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        background:
          "linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))",
        color: "hsl(0, 0%, 100%)",
        borderColor: theme.palette.primary.light,
        "& .MuiChip-label": {
          color: "hsl(0, 0%, 100%)",
        },
        ...theme.applyStyles("dark", {
          borderColor: theme.palette.primary.dark,
        }),
      },
    },
  ],
}));

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <div>
            <Typography
              component="h2"
              variant="h4"
              sx={{ color: "text.primary" }}
            >
              Platform features
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", mb: { xs: 2, sm: 4 } }}
            >
              Provide a brief overview of the key features of the platform.
            </Typography>
          </div>
          <Grid
            container
            item
            sx={{ gap: 1, display: { xs: "auto", sm: "none" } }}
          >
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                selected={selectedItemIndex === index}
              />
            ))}
          </Grid>
          <Card
            variant="outlined"
            sx={{ display: { xs: "auto", sm: "none" }, mt: 4 }}
          >
            <Box
              sx={(theme) => ({
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: 280,
                backgroundImage: "var(--items-imageLight)",
                ...theme.applyStyles("dark", {
                  backgroundImage: "var(--items-imageDark)",
                }),
              })}
              style={{
                "--items-imageLight": items[selectedItemIndex].imageLight,
                "--items-imageDark": items[selectedItemIndex].imageDark,
              }}
            />
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography
                gutterBottom
                sx={{ color: "text.primary", fontWeight: "medium" }}
              >
                {selectedFeature.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1.5 }}
              >
                {selectedFeature.description}
              </Typography>
              <Link
                color="primary"
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  display: "inline-flex",
                  alignItems: "center",
                  "& > svg": { transition: "0.2s" },
                  "&:hover > svg": { transform: "translateX(2px)" },
                }}
              >
                <span>Learn more</span>
                <ChevronRightRoundedIcon
                  fontSize="small"
                  sx={{ mt: "1px", ml: "2px" }}
                />
              </Link>
            </Box>
          </Card>
          <Stack
            direction="column"
            spacing={2}
            useFlexGap
            sx={{
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              display: { xs: "none", sm: "flex" },
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Card
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 3,
                    height: "fit-content",
                    width: "100%",
                    background: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)",
                      borderColor: "primary.light",
                      boxShadow: "0px 2px 8px hsla(0, 0%, 0%, 0.1)",
                      ...theme.applyStyles("dark", {
                        background:
                          "linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)",
                        borderColor: "primary.dark",
                        boxShadow: "0px 1px 8px hsla(210, 100%, 25%, 0.5) ",
                      }),
                    },
                  }),
                  selectedItemIndex === index &&
                    ((theme) => ({
                      backgroundColor: "action.selected",
                      borderColor: "primary.light",
                      ...theme.applyStyles("dark", {
                        borderColor: "primary.dark",
                      }),
                    })),
                ]}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    textAlign: "left",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { md: "center" },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={[
                      (theme) => ({
                        color: "grey.400",
                        ...theme.applyStyles("dark", {
                          color: "grey.600",
                        }),
                      }),
                      selectedItemIndex === index && {
                        color: "primary.main",
                      },
                    ]}
                  >
                    {icon}
                  </Box>
                  <div>
                    <Typography
                      gutterBottom
                      sx={{ color: "text.primary", fontWeight: "medium" }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 1.5 }}
                    >
                      {description}
                    </Typography>
                    <Link
                      color="primary"
                      variant="body2"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      sx={{
                        fontWeight: "bold",
                        display: "inline-flex",
                        alignItems: "center",
                        "& > svg": { transition: "0.2s" },
                        "&:hover > svg": { transform: "translateX(2px)" },
                      }}
                    >
                      <span>Learn more</span>
                      <ChevronRightRoundedIcon
                        fontSize="small"
                        sx={{ mt: "1px", ml: "2px" }}
                      />
                    </Link>
                  </div>
                </Box>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { xs: "none", sm: "flex" }, width: "100%" }}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              width: "100%",
              display: { xs: "none", sm: "flex" },
              pointerEvents: "none",
            }}
          >
            <Box
              sx={(theme) => ({
                m: "auto",
                width: 420,
                height: 500,
                backgroundSize: "contain",
                backgroundImage: `url(${image})`,
                ...theme.applyStyles("dark", {
                  backgroundImage: "var(--items-imageDark)",
                }),
              })}
              style={{
                "--items-imageLight": items[selectedItemIndex].imageLight,
                "--items-imageDark": items[selectedItemIndex].imageDark,
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
