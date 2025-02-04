import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link as ScrollLink } from "react-scroll";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { expsHero } from "@/data";
import { Button } from "@mui/material";
import HeroImg from "@/assets/home-hero.jpg";
import CertificateImg from "@/assets/certificate.png";
import PropTypes from "prop-types";
import { Link } from "react-router";

const ExpItem = ({ item }) => {
  const { value, label } = item;
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 1, md: 0 } }}>
      <Typography
        sx={{
          color: "secondary.main",
          mb: { xs: 1, md: 2 },
          fontSize: { xs: 34, md: 44 },
          fontWeight: "bold",
        }}
      >
        {value}
      </Typography>
      <Typography color="text.secondary" variant="h5">
        {label}
      </Typography>
    </Box>
  );
};

ExpItem.propTypes = {
  item: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const Hero = () => {
  return (
    <Box
      id="hero"
      sx={{
        backgroundColor: "background.paper",
        position: "relative",
        pt: 4,
        pb: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={0}
          sx={{ flexDirection: { xs: "column", md: "row" } }}
        >
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: 40, md: 72 },
                    letterSpacing: 1.5,
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    component="mark"
                    sx={{
                      color: "primary.main",
                      fontSize: "inherit",
                      fontWeight: "inherit",
                      backgroundColor: "unset",
                    }}
                  >
                    Follow{" "}
                  </Typography>
                  your{" "}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "inherit",
                      fontWeight: "inherit",
                    }}
                  >
                    Teams
                  </Typography>{" "}
                  and Players
                </Typography>
              </Box>
              <Box sx={{ mb: 4, width: { xs: "100%", md: "70%" } }}>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {
                    "Stay updated with the latest highlights and commentary. Choose your favorite teams and players, and receive personalized audio, video, and text digests in English, Spanish, or Japanese."
                  }
                </Typography>
              </Box>
              <Box sx={{ "& button": { mr: 2 } }}>
                <Link to="/login">
                  <Button color="primary" size="large" variant="contained">
                    Get Started
                  </Button>
                </Link>
                <Link to="https://youtu.be/P-QL1JWFsi8" target="_blank">
                  <Button
                    color="primary"
                    size="large"
                    variant="outlined"
                    startIcon={<PlayArrowIcon />}
                  >
                    Watch Demo
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ position: "relative", mt: 10 }}>
            {/* Certificate badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: 30,
                left: { xs: 0, md: -150 },
                boxShadow: 1,
                borderRadius: 3,
                px: 2,
                py: 1.4,
                zIndex: 1,
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "flex-start",
                width: 280,
                "@media (max-width: 900px)": {
                  display: "none",
                },
              }}
            >
              <Box
                sx={{
                  boxShadow: 1,
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  "& img": { width: "32px !important", height: "auto" },
                }}
              >
                <img
                  src={CertificateImg}
                  alt="Certificate icon"
                  width={50}
                  height={50}
                />
              </Box>
              <Box>
                <Typography
                  component="h6"
                  sx={{
                    color: "secondary.main",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  Stats
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary", lineHeight: 1.3 }}
                >
                  There are stats for matches.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ lineHeight: 0 }}>
              <img src={HeroImg} width={"100%"} alt="Hero img" />
            </Box>
          </Grid>
        </Grid>

        {/* Experience */}
        <Box sx={{ boxShadow: 2, py: 4, px: 7, borderRadius: 4, mt: 5 }}>
          <Grid container spacing={2}>
            {expsHero.map((item) => (
              <Grid key={item.value} item xs={12} md={4}>
                <ExpItem item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
