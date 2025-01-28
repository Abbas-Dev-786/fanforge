import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useTeams, useTeamRoster } from "../../hooks/useTeams";
import SearchBar from "../shared/SearchBar";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorDisplay from "../shared/ErrorDisplay";

export default function EditProfileModal({ open, onClose, onSave, currentInterests }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [teamSearch, setTeamSearch] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();
  
  const { control, handleSubmit } = useForm({
    defaultValues: {
      favoriteTeams: currentInterests?.favoriteTeams?.map(team => team.id) || [],
      favoritePlayers: currentInterests?.favoritePlayers?.map(player => player.id) || [],
    },
  });

  const watchedTeams = useForm().watch("favoriteTeams");
  const { data: allRosters, isLoading: rostersLoading } = useTeamRoster(
    watchedTeams?.length > 0 ? watchedTeams[0] : null
  );

  const allPlayers = React.useMemo(() => {
    if (!allRosters || !watchedTeams?.length) return [];
    
    return watchedTeams.reduce((acc, teamId) => {
      const teamRoster = allRosters?.roster || [];
      const players = teamRoster.map(player => ({
        ...player.person,
        position: player.position,
        teamId: teamId,
      }));
      return [...acc, ...players];
    }, []);
  }, [allRosters, watchedTeams]);

  const filteredTeams = teams?.filter(
    team =>
      team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      team.locationName.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredPlayers = allPlayers.filter(player =>
    player.fullName.toLowerCase().includes(playerSearch.toLowerCase())
  );

  const handleSave = async (data) => {
    try {
      const selectedTeamsData = data.favoriteTeams
        .map((teamId) => {
          const team = teams.find((t) => t.id === teamId);
          return {
            id: teamId,
            name: team?.name || "",
            locationName: team?.locationName || "",
          };
        })
        .filter((team) => team.name);

      const selectedPlayersData = data.favoritePlayers
        .map((playerId) => {
          const player = allPlayers.find((p) => p.id === playerId);
          return {
            id: playerId,
            name: player?.fullName || "",
            position: player?.position?.abbreviation || "",
            teamId: player?.teamId || "",
          };
        })
        .filter((player) => player.name);

      await onSave({
        favoriteTeams: selectedTeamsData,
        favoritePlayers: selectedPlayersData,
      });
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (teamsError) return <ErrorDisplay message="Error loading teams" />;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
    >
      <DialogTitle>
        Edit Profile Preferences
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Favorite Teams
          </Typography>
          <SearchBar
            value={teamSearch}
            onChange={setTeamSearch}
            placeholder="Search teams..."
          />
          <Controller
            name="favoriteTeams"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Grid container spacing={2}>
                {filteredTeams?.map((team) => (
                  <Grid item xs={6} sm={4} md={3} key={team.id}>
                    <Card
                      component={motion.div}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        const newValue = value.includes(team.id)
                          ? value.filter((id) => id !== team.id)
                          : [...value, team.id];
                        onChange(newValue);
                      }}
                      sx={{
                        cursor: "pointer",
                        height: "100%",
                        position: "relative",
                        ...(value.includes(team.id) && {
                          border: `2px solid ${theme.palette.primary.main}`,
                        }),
                      }}
                    >
                      {value.includes(team.id) && (
                        <CheckCircleIcon
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "primary.main",
                            zIndex: 1,
                          }}
                        />
                      )}
                      <CardMedia
                        component="img"
                        height={isMobile ? "120" : "140"}
                        image={`https://www.mlbstatic.com/team-logos/${team.id}.svg`}
                        alt={team.name}
                        sx={{
                          objectFit: "contain",
                          p: 2,
                          bgcolor: "#f5f5f5",
                        }}
                      />
                      <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                        <Typography
                          variant={isMobile ? "body2" : "body1"}
                          component="div"
                          align="center"
                          fontWeight="medium"
                          noWrap
                        >
                          {team.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Favorite Players
          </Typography>
          <SearchBar
            value={playerSearch}
            onChange={setPlayerSearch}
            placeholder="Search players..."
          />
          <Controller
            name="favoritePlayers"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Grid container spacing={2}>
                {filteredPlayers?.map((player) => (
                  <Grid item xs={6} sm={4} md={3} key={player.id}>
                    <Card
                      component={motion.div}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        const newValue = value.includes(player.id)
                          ? value.filter((id) => id !== player.id)
                          : [...value, player.id];
                        onChange(newValue);
                      }}
                      sx={{
                        cursor: "pointer",
                        height: "100%",
                        position: "relative",
                        ...(value.includes(player.id) && {
                          border: `2px solid ${theme.palette.primary.main}`,
                        }),
                      }}
                    >
                      {value.includes(player.id) && (
                        <CheckCircleIcon
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "primary.main",
                            zIndex: 1,
                          }}
                        />
                      )}
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Avatar
                          src={`https://img.mlbstatic.com/mlb/images/players/head_shot/${player.id}.jpg`}
                          alt={player.fullName}
                          sx={{
                            width: isMobile ? 80 : 120,
                            height: isMobile ? 80 : 120,
                            margin: "0 auto",
                            mb: 2,
                            border: "2px solid",
                            borderColor: "divider",
                          }}
                        />
                        <Typography
                          variant={isMobile ? "body2" : "body1"}
                          fontWeight="medium"
                          gutterBottom
                          noWrap
                        >
                          {player.fullName}
                        </Typography>
                        <Chip
                          label={player.position.abbreviation}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit(handleSave)}
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
} 