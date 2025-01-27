import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
];
const CONTENT_PREFERENCES = [
  "Match Highlights",
  "Player Interviews",
  "Team News",
  "Stats & Analysis",
  "Behind the Scenes",
  "Press Conferences",
];

// Update sample data
const TEAMS = [
  "New York Yankees",
  "Boston Red Sox",
  "Los Angeles Dodgers",
  "Chicago Cubs",
  "Houston Astros",
  "Atlanta Braves",
  "San Francisco Giants",
  "St. Louis Cardinals",
  // Add more teams as needed
];

const PLAYERS = [
  "Shohei Ohtani",
  "Mike Trout",
  "Aaron Judge",
  "Mookie Betts",
  "Juan Soto",
  "Ronald Acuña Jr.",
  "Freddie Freeman",
  "Trea Turner",
  // Add more players as needed
];

export default function Onboarding() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      favoriteTeams: [],
      favoritePlayers: [],
      contentPreferences: [],
      preferredLanguages: [],
      notificationPreferences: {
        highlights: true,
        liveScores: true,
        news: true,
      },
    },
  });

  useEffect(() => {
    // Check if user has already completed onboarding
    const checkOnboarding = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "interests", currentUser.uid));
      if (userDoc.exists() && userDoc.data().onboardingCompleted) {
        navigate("/");
        return;
      }
    };

    checkOnboarding();
  }, [currentUser, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await setDoc(
        doc(db, "interests", currentUser.uid),
        {
          favoriteTeams: data.favoriteTeams,
          favoritePlayers: data.favoritePlayers,
          contentPreferences: data.contentPreferences,
          preferredLanguages: data.preferredLanguages,
          notificationPreferences: data.notificationPreferences,
          onboardingCompleted: true,
          userId: currentUser.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      navigate("/");
    } catch (error) {
      console.error("Error during onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Personalize Your Experience
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <Controller
            name="favoriteTeams"
            control={control}
            rules={{ required: "Please select at least one team" }}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.favoriteTeams}
              >
                <InputLabel>Favorite Teams</InputLabel>
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {TEAMS.map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.favoriteTeams?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="favoritePlayers"
            control={control}
            rules={{ required: "Please select at least one player" }}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.favoritePlayers}
              >
                <InputLabel>Favorite Players</InputLabel>
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {PLAYERS.map((player) => (
                    <MenuItem key={player} value={player}>
                      {player}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.favoritePlayers?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="contentPreferences"
            control={control}
            rules={{ required: "Please select content preferences" }}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.contentPreferences}
              >
                <InputLabel>Content Preferences</InputLabel>
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {CONTENT_PREFERENCES.map((pref) => (
                    <MenuItem key={pref} value={pref}>
                      {pref}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.contentPreferences?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="preferredLanguages"
            control={control}
            rules={{ required: "Please select at least one language" }}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.preferredLanguages}
              >
                <InputLabel>Preferred Languages</InputLabel>
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            LANGUAGES.find((lang) => lang.code === value)?.name
                          }
                        />
                      ))}
                    </Box>
                  )}
                >
                  {LANGUAGES.map((language) => (
                    <MenuItem key={language.code} value={language.code}>
                      {language.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.preferredLanguages?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            Complete Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
