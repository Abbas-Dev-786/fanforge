import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link, useNavigate } from "react-router";

const StyledCard = styled(Card)(({ theme, isMobile }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #e0e0e0",
  transition: "transform 0.2s",
  ...(isMobile
    ? {
        // Mobile styles
        boxShadow: "none",
        border: "none",
        borderRadius: theme.spacing(1),
      }
    : {
        // Desktop hover effects
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }),
}));

export default function TeamCard({ team, isMobile }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const logoUrl = `https://www.mlbstatic.com/team-logos/${team?.id}.svg`;

  const handleClick = () => {
    navigate(`/dashboard/teams/${team.id}`);
  };

  return (
    <StyledCard 
      onClick={handleClick} 
      sx={{ cursor: "pointer" }}
      isMobile={isMobile}
    >
      <CardMedia
        component="img"
        height={isMobile ? "150" : "200"}
        image={logoUrl}
        alt={team?.name}
        sx={{ 
          objectFit: "contain", 
          p: isMobile ? 1 : 2, 
          bgcolor: "#f5f5f5" 
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: isMobile ? 1 : 2 
        }}>
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            {team?.name}
          </Typography>
          <Link to={`/dashboard/teams/${team?.id}`}>
            <IconButton size={isMobile ? "small" : "medium"}>
              <OpenInNewIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Link>
        </Box>
        <Typography 
          color="text.secondary" 
          variant={isMobile ? "body2" : "body1"}
          gutterBottom
        >
          {team?.locationName}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Chip
            label={team?.abbreviation}
            size="small"
            sx={{ 
              bgcolor: `#ff6800`,
              color: "white",
              height: isMobile ? "24px" : "32px",
              "& .MuiChip-label": {
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              },
            }}
          />
          {team?.active && (
            <Chip
              label="Active"
              size="small"
              color="success"
              variant="outlined"
              sx={{
                height: isMobile ? "24px" : "32px",
                "& .MuiChip-label": {
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                },
              }}
            />
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
}
