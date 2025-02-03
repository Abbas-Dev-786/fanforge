import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        py: { xs: 6, md: 8 },
        borderTop: "1px solid",
        borderColor: "primary.light",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 3, md: 0 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  FanForge
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                An innovative fan engagement platform created for the MLB
                Hackathon, designed to bring fans closer to the game they love.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  color="inherit"
                  sx={{
                    "&:hover": {
                      bgcolor: "primary.dark",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s",
                  }}
                  target="_blank"
                  href="https://github.com/Abbas-Dev-786/fanforge"
                >
                  <GitHubIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["Home"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  color="inherit"
                  sx={{
                    opacity: 0.8,
                    "&:hover": {
                      opacity: 1,
                      transform: "translateX(5px)",
                    },
                    transition: "all 0.2s",
                    display: "inline-block",
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: abbasbhp787@gmail.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "primary.light",
            mt: 6,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Made with ❤️ by{" "}
            <a
              href="https://abbas-bhanpura-wala.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              Abbas Bhanpura wala
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
