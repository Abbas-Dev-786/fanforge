import { useParams } from "react-router";
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { usePlayer } from "../../hooks/usePlayers";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorDisplay from "../../components/shared/ErrorDisplay";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HeightIcon from "@mui/icons-material/Height";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format } from "date-fns";

export default function PlayerDetails() {
  const { playerId } = useParams();
  const { data: player, isLoading, error } = usePlayer(playerId);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorDisplay message="Error loading player data" />;

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Player Header Card */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              position: "relative",
              background: "linear-gradient(to right, #2C3E50, #3498DB)",
              borderRadius: 3,
              color: "white",
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "center" },
                gap: { xs: 2, sm: 4 },
                p: { xs: 3, sm: 4 },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Avatar
                src={`https://img.mlbstatic.com/mlb/images/players/head_shot/${player.id}.jpg`}
                alt={player.fullName}
                sx={{
                  width: { xs: 120, sm: 160 },
                  height: { xs: 120, sm: 160 },
                  border: "4px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />

              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: "2rem", sm: "3rem" },
                    }}
                  >
                    {player.fullName}
                  </Typography>
                  {player.nickName && (
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      &quot;{player.nickName}&quot;
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Chip
                    icon={<SportsBaseballIcon />}
                    label={player.primaryPosition.name}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                  <Chip
                    label={`#${player.primaryNumber}`}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                    }}
                  />
                  {player.active && (
                    <Chip
                      label="Active"
                      sx={{
                        bgcolor: "#2ECC71",
                        color: "white",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Player Details */}
        <Grid item xs={12} md={4}>
          <Paper>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CakeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Birth Date"
                  secondary={`${format(
                    new Date(player.birthDate),
                    "MMMM d, yyyy"
                  )} (${calculateAge(player.birthDate)} years)`}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Birthplace"
                  secondary={`${player.birthCity}, ${player.birthStateProvince}, ${player.birthCountry}`}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <HeightIcon />
                </ListItemIcon>
                <ListItemText primary="Height" secondary={player.height} />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <MonitorWeightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Weight"
                  secondary={`${player.weight} lbs`}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              {player?.mlbDebutDate && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="MLB Debut"
                    secondary={format(
                      new Date(player?.mlbDebutDate),
                      "MMMM d, yyyy"
                    )}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Player Stats */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Player Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography color="text.secondary" gutterBottom>
                    Batting Side
                  </Typography>
                  <Typography variant="h6">
                    {player.batSide.description}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography color="text.secondary" gutterBottom>
                    Throwing Hand
                  </Typography>
                  <Typography variant="h6">
                    {player.pitchHand.description}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography color="text.secondary" gutterBottom>
                    Draft Year
                  </Typography>
                  <Typography variant="h6">{player.draftYear}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography color="text.secondary" gutterBottom>
                    Position
                  </Typography>
                  <Typography variant="h6">
                    {player.primaryPosition.name} ({player.primaryPosition.type}
                    )
                  </Typography>
                </Box>
              </Grid>
              {player.pronunciation && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Name Pronunciation
                    </Typography>
                    <Typography variant="h6">{player.pronunciation}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
