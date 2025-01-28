import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useTeams, useTeamRoster } from "../../hooks/useTeams";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorDisplay from "../../components/shared/ErrorDisplay";
import LoadingScreen from "../../components/LoadingScreen";
import { motion } from "framer-motion";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";
import SearchBar from "../../components/shared/SearchBar";

const steps = ["Select Teams", "Select Players", "Preferences"];

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
];

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams();
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      favoriteTeams: [],
      favoritePlayers: [],
      preferredLanguages: ["en"],
    },
  });

  const watchedTeams = watch("favoriteTeams");

  // Create a single query for all rosters
  const { data: allRosters, isLoading: rostersLoading } = useTeamRoster(
    selectedTeams.length > 0 ? selectedTeams[0] : null // Pass first team ID or null
  );

  // Process all players from rosters
  const allPlayers = React.useMemo(() => {
    if (!allRosters || selectedTeams.length === 0) return [];

    return selectedTeams.reduce((acc, teamId) => {
      const teamRoster = allRosters?.roster || [];
      const players = teamRoster.map((player) => ({
        ...player.person,
        position: player.position,
        teamId: teamId,
      }));
      return [...acc, ...players];
    }, []);
  }, [allRosters, selectedTeams]);

  useEffect(() => {
    setSelectedTeams(watchedTeams);
  }, [watchedTeams]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Transform teams data to include names
      const selectedTeamsData = data.favoriteTeams
        .map((teamId) => {
          const team = teams.find((t) => t.id === teamId);
          return {
            id: teamId,
            name: team?.name || "",
            locationName: team?.locationName || "",
          };
        })
        .filter((team) => team.name); // Filter out any invalid teams

      // Transform players data to include names
      const selectedPlayersData = data.favoritePlayers
        .map((playerId) => {
          const player = allPlayers.find((p) => p.id === playerId);
          return {
            id: playerId,
            name: player?.fullName || "", // Access fullName directly from player
            position: player?.position?.abbreviation || "",
            teamId: player?.teamId || "",
          };
        })
        .filter((player) => player.name); // Filter out any invalid players

      // Validate data before saving
      const interestsData = {
        favoriteTeams: selectedTeamsData,
        favoritePlayers: selectedPlayersData,
        preferredLanguages: data.preferredLanguages || ["en"],
        onboardingCompleted: true,
        updatedAt: new Date(),
      };

      // Check for any undefined values
      Object.keys(interestsData).forEach((key) => {
        if (interestsData[key] === undefined) {
          throw new Error(`Invalid value for ${key}`);
        }
      });

      await setDoc(doc(db, "interests", currentUser.uid), interestsData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      // Optionally show error to user
    } finally {
      setLoading(false);
    }
  };

  // Filter teams based on search
  const filteredTeams = React.useMemo(() => {
    if (!teams) return [];
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
        team.locationName.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teams, teamSearch]);

  // Filter players based on search
  const filteredPlayers = React.useMemo(() => {
    if (!allPlayers) return [];
    return allPlayers.filter((player) =>
      player.fullName.toLowerCase().includes(playerSearch.toLowerCase())
    );
  }, [allPlayers, playerSearch]);

  if (teamsLoading) return <LoadingScreen />;
  if (teamsError) return <ErrorDisplay message="Error loading teams" />;

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Controller
            name="favoriteTeams"
            control={control}
            rules={{ required: "Please select at least one team" }}
            render={({ field: { value, onChange } }) => (
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Select your favorite teams
                  </Typography>
                  <Tooltip title="You can select multiple teams">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <SearchBar
                  value={teamSearch}
                  onChange={setTeamSearch}
                  placeholder="Search teams..."
                />

                <Grid container spacing={isMobile ? 1 : 2}>
                  {filteredTeams.map((team) => (
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

                {filteredTeams.length === 0 && (
                  <Typography color="text.secondary" align="center" py={4}>
                    No teams found matching your search
                  </Typography>
                )}

                {errors.favoriteTeams && (
                  <Typography color="error" mt={2}>
                    {errors.favoriteTeams.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );

      case 1:
        return (
          <Controller
            name="favoritePlayers"
            control={control}
            rules={{ required: "Please select at least one player" }}
            render={({ field: { value, onChange } }) => (
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Select your favorite players
                  </Typography>
                  <Tooltip title="Select players from your chosen teams">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {selectedTeams.length === 0 ? (
                  <Typography color="text.secondary" align="center" py={4}>
                    Please select teams first to view their players
                  </Typography>
                ) : rostersLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <SearchBar
                      value={playerSearch}
                      onChange={setPlayerSearch}
                      placeholder="Search players..."
                    />

                    <Grid container spacing={isMobile ? 1 : 2}>
                      {filteredPlayers.map((player) => (
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

                    {filteredPlayers.length === 0 && (
                      <Typography color="text.secondary" align="center" py={4}>
                        No players found matching your search
                      </Typography>
                    )}
                  </>
                )}

                {errors.favoritePlayers && (
                  <Typography color="error" mt={2}>
                    {errors.favoritePlayers.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );

      case 2:
        return (
          <Controller
            name="preferredLanguages"
            control={control}
            rules={{ required: "Please select at least one language" }}
            render={({ field: { value, onChange } }) => (
              <Box>
                <Typography variant="subtitle1" color="text.secondary" mb={3}>
                  Choose your preferred languages
                </Typography>
                <Grid container spacing={2}>
                  {LANGUAGES.map((lang) => (
                    <Grid item xs={12} sm={4} key={lang.code}>
                      <Card
                        component={motion.div}
                        whileHover={{ y: -4 }}
                        onClick={() => {
                          const newValue = value.includes(lang.code)
                            ? value.filter((code) => code !== lang.code)
                            : [...value, lang.code];
                          onChange(newValue);
                        }}
                        sx={{
                          cursor: "pointer",
                          p: 2,
                          textAlign: "center",
                          ...(value.includes(lang.code) && {
                            border: `2px solid ${theme.palette.primary.main}`,
                          }),
                        }}
                      >
                        <Typography variant="h4" mb={1}>
                          {lang.flag}
                        </Typography>
                        <Typography variant="h6">{lang.name}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 8 },
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 1}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: isMobile ? 0 : 2,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          Welcome to FanForge
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          mb={4}
        >
          Let's personalize your experience
        </Typography>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 4, display: { xs: "none", sm: "flex" } }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            fullWidth={isMobile}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              fullWidth={isMobile}
            >
              {loading ? <CircularProgress size={24} /> : "Complete Setup"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              fullWidth={isMobile}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
