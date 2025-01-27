import {
  Box,
  Typography,
  Avatar,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import baseballField from "../../assets/baseball-field.svg";

const FieldWrapper = styled(Paper)({
  position: "relative",
  width: "100%",
  height: 0,
  paddingBottom: "75%", // 4:3 aspect ratio
  backgroundImage: `url(${baseballField})`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  margin: "20px 0",
  overflow: "hidden",
  borderRadius: "8px",
});

const PlayerPosition = styled(Box)({
  position: "absolute",
  transform: "translate(-50%, -50%)",
  zIndex: 1,
});

const TooltipContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  "& .MuiList-root": {
    padding: theme.spacing(1, 0),
  },
  "& .MuiListItem-root": {
    padding: theme.spacing(0.5, 1),
  },
}));

// Updated positions to match new field layout
const positions = {
  P: { left: "50%", top: "66.7%" }, // Pitcher
  C: { left: "50%", top: "83.3%" }, // Catcher
  "1B": { left: "67.5%", top: "66.7%" }, // First Base
  "2B": { left: "57.5%", top: "54.2%" }, // Second Base
  "3B": { left: "32.5%", top: "66.7%" }, // Third Base
  SS: { left: "42.5%", top: "54.2%" }, // Shortstop
  LF: { left: "30%", top: "33.3%" }, // Left Field
  CF: { left: "50%", top: "25%" }, // Center Field
  RF: { left: "70%", top: "33.3%" }, // Right Field
};

BaseballField.propTypes = {
  roster: PropTypes.arrayOf(
    PropTypes.shape({
      person: PropTypes.shape({
        id: PropTypes.number,
        fullName: PropTypes.string,
      }),
      position: PropTypes.shape({
        abbreviation: PropTypes.string,
      }),
      jerseyNumber: PropTypes.string,
      status: PropTypes.shape({
        description: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default function BaseballField({ roster }) {
  const getPlayersByPosition = () => {
    const positionMap = {};
    roster.forEach((player) => {
      const position = player.position.abbreviation;
      if (!positionMap[position]) {
        positionMap[position] = [];
      }
      positionMap[position].push(player);
    });
    return positionMap;
  };

  const playersByPosition = getPlayersByPosition();

  const renderTooltipContent = (position, players) => (
    <TooltipContent>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {position} Players ({players.length})
      </Typography>
      <List disablePadding>
        {players.map((player) => (
          <ListItem key={player.person.id} disableGutters>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2">
                    {player.person.fullName}
                  </Typography>
                  <Chip
                    label={`#${player.jerseyNumber || "N/A"}`}
                    size="small"
                    variant="outlined"
                    sx={{ ml: "auto" }}
                  />
                </Box>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {player.status.description}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </TooltipContent>
  );

  return (
    <FieldWrapper elevation={3}>
      {Object.entries(positions).map(([position, coords]) => {
        const players = playersByPosition[position] || [];

        return (
          players.length > 0 && (
            <PlayerPosition
              key={position}
              sx={{
                left: coords.left,
                top: coords.top,
              }}
            >
              <Tooltip
                title={renderTooltipContent(position, players)}
                arrow
                placement="top"
                PopperProps={{
                  sx: {
                    "& .MuiTooltip-tooltip": {
                      maxWidth: 320,
                      bgcolor: "background.paper",
                      color: "text.primary",
                      boxShadow: 4,
                      p: 0,
                      "& .MuiTooltip-arrow": {
                        color: "background.paper",
                      },
                    },
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Box
                      sx={{
                        background: "yellow",
                        height: 15,
                        width: 15,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        color: "black",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {players.length}
                    </Box>
                  }
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      border: "2px solid white",
                      boxShadow: 2,
                      bgcolor:
                        players.length > 1 ? "secondary.main" : "primary.main",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    {/* <Box sx={{ position: "relative" }}> */}
                    {position}
                    {/* {players.length > 1 && (
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "error.main",
                          color: "white",
                          borderRadius: "50%",
                          width: 16,
                          height: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.6rem",
                          border: "1px solid white",
                        }}
                      >
                        {players.length}
                      </Typography>
                    )} */}
                    {/* </Box> */}
                  </Avatar>
                </Badge>
              </Tooltip>
            </PlayerPosition>
          )
        );
      })}
    </FieldWrapper>
  );
}
