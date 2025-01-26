import { Box, Typography } from "@mui/material";

const Logo = ({ onClick, variant }) => {
  return (
    <Box onClick={onClick}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          "& span": { color: variant === "primary" ? "primary.main" : "unset" },
        }}
      >
        Fan<span>Forge</span>
      </Typography>
    </Box>
  );
};

export default Logo;
