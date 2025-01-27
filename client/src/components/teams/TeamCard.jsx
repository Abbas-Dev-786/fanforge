import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link, useNavigate } from "react-router";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #e0e0e0",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

export default function TeamCard({ team }) {
  const navigate = useNavigate();
  const logoUrl = `https://www.mlbstatic.com/team-logos/${team?.id}.svg`;

  const handleClick = () => {
    navigate(`/dashboard/teams/${team.id}`);
  };

  return (
    <StyledCard onClick={handleClick} sx={{ cursor: "pointer" }}>
      <CardMedia
        component="img"
        height="200"
        image={logoUrl}
        alt={team?.name}
        sx={{ objectFit: "contain", p: 2, bgcolor: "#f5f5f5" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {team?.name}
          </Typography>
          <Link to={`/dashboard/teams/${team?.id}`}>
            <IconButton size="small">
              <OpenInNewIcon />
            </IconButton>
          </Link>
        </Box>
        <Typography color="text.secondary" gutterBottom>
          {team?.locationName}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={team?.abbreviation}
            size="small"
            sx={{ bgcolor: `#ff6800`, color: "white" }}
          />
          {team?.active && (
            <Chip
              label="Active"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
}
