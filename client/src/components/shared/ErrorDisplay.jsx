import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ErrorDisplay({ message = "An error occurred" }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
      <Typography variant="h6" color="error">
        {message}
      </Typography>
    </Box>
  );
}
