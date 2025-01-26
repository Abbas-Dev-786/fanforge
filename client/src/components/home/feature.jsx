import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { featureData } from "@/data";
import homeFeatureImg from "@/assets/home-feature.png";

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "color",
})(({ theme, order }) => ({
  height: 6,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    ...(order === 1 && {
      backgroundColor: "#f303ff",
    }),
    ...(order === 2 && {
      backgroundColor: "#26e8bd",
    }),
    ...(order === 3 && {
      backgroundColor: "#0063ff",
    }),
  },
}));

const Feature = () => {
  return (
    <Box
      id="feature"
      sx={{ py: { xs: 10, md: 14 }, backgroundColor: "background.paper" }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "relative" }}>
              <img src={homeFeatureImg} width="100%" alt="Baseball Feature" />
              <Box
                sx={{
                  position: "absolute",
                  top: -36,
                  right: { xs: 0, md: -36 },
                  boxShadow: 2,
                  borderRadius: 1,
                  px: 2.2,
                  py: 1.4,
                  zIndex: 1,
                  backgroundColor: "background.paper",
                  width: 190,
                }}
              >
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Baseball Insights
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Real-time Game Updates
                  </Typography>
                  <BorderLinearProgress
                    variant="determinate"
                    color="inherit"
                    value={85}
                    order={1}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Player Statistics
                  </Typography>
                  <BorderLinearProgress
                    variant="determinate"
                    color="inherit"
                    value={70}
                    order={2}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Team Schedules
                  </Typography>
                  <BorderLinearProgress
                    variant="determinate"
                    color="inherit"
                    value={60}
                    order={3}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: -12,
                  left: { xs: 0, md: -24 },
                  boxShadow: 2,
                  borderRadius: 1,
                  px: 2.2,
                  py: 2,
                  zIndex: 1,
                  backgroundColor: "background.paper",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, lineHeight: 1 }}>
                    Fan Community
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, color: "text.disabled" }}
                  >
                    Join the discussion
                  </Typography>
                  <Box
                    sx={{
                      height: 85,
                      width: 85,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h4" sx={{ color: "#32dc88" }}>
                      90%
                    </Typography>
                    <CircularProgress
                      sx={{ position: "absolute", color: "divider" }}
                      thickness={2}
                      variant="determinate"
                      value={95}
                      size={85}
                    />
                    <CircularProgress
                      thickness={2}
                      variant="determinate"
                      value={90}
                      size={85}
                      sx={{
                        transform: "rotate(96deg) !important",
                        color: "#32dc88",
                        position: "absolute",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography
              component="h2"
              sx={{
                position: "relative",
                fontSize: { xs: 40, md: 50 },
                ml: { xs: 0, md: 4 },
                mt: 2,
                mb: 3,
                lineHeight: 1,
                fontWeight: "bold",
              }}
            >
              Enhance your{" "}
              <Typography
                component="mark"
                sx={{
                  position: "relative",
                  color: "primary.main",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  backgroundColor: "unset",
                }}
              >
                Baseball Experience {" "}
              </Typography>
              with Us
            </Typography>

            <Typography
              sx={{ color: "text.secondary", mb: 2, ml: { xs: 0, md: 4 } }}
            >
              Dive into the world of baseball with real-time updates, player
              stats, and community discussions. Enjoy the game like never
              before.
            </Typography>

            <Grid container spacing={2} sx={{ ml: { xs: 0, md: 2 } }}>
              {featureData.map(({ title, description, icon }, index) => (
                <Grid key={String(index)} item xs={12} md={6}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      boxShadow: 1,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        mr: 1,
                        backgroundColor: "primary.main",
                        borderRadius: "50%",
                        height: 36,
                        width: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "primary.contrastText",
                        "& svg": {
                          fontSize: 20,
                        },
                      }}
                    >
                      {icon}
                    </Box>
                    <Box
                      sx={{ display: "flex", flex: 1, flexDirection: "column" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1rem",
                          mb: 1,
                          color: "secondary.main",
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        sx={{ lineHeight: 1.3, color: "text.secondary" }}
                        variant="subtitle1"
                      >
                        {description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Feature;
