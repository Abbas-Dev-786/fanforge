import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import GppBadIcon from "@mui/icons-material/GppBad";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
        }}
      >
        <GppBadIcon sx={{ fontSize: 100, color: "error.main", mb: 2 }} />
        <Typography variant="h1" component="h1" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Access Forbidden
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You {"don't"} have permission to access this page.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go Home
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
