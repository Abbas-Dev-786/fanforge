import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";

const LANGUAGE_MAP = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
};

const TEAMS = [
  "New York Yankees",
  "Boston Red Sox",
  "Los Angeles Dodgers",
  "Chicago Cubs",
  "Houston Astros",
  "Atlanta Braves",
  "San Francisco Giants",
  "St. Louis Cardinals",
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
];

export default function Profile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const userDoc = await getDoc(doc(db, "interests", currentUser.uid));
        if (userDoc.exists()) {
          setUserPreferences(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserPreferences();
    }
  }, [currentUser]);

  const handleEditClick = () => {
    reset({
      favoriteTeams: userPreferences.favoriteTeams,
      favoritePlayers: userPreferences.favoritePlayers,
      contentPreferences: userPreferences.contentPreferences,
      preferredLanguages: userPreferences.preferredLanguages,
      notificationPreferences: userPreferences.notificationPreferences,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userRef = doc(db, "interests", currentUser.uid);

      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setUserPreferences({
        ...userPreferences,
        ...data,
        updatedAt: new Date().toISOString(),
      });

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userPreferences) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No preferences found. Please complete the onboarding process.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/onboarding")}
            sx={{ mt: 2 }}
          >
            Complete Onboarding
          </Button>
        </Paper>
      </Container>
    );
  }

  const PreferenceSection = ({ title, items, chipColor = "primary" }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {items?.map((item) => (
          <Chip
            key={item}
            label={LANGUAGE_MAP[item] || item}
            color={chipColor}
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Your Profile
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Edit Preferences
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <PreferenceSection
              title="Favorite Teams"
              items={userPreferences.favoriteTeams}
            />
            <PreferenceSection
              title="Favorite Players"
              items={userPreferences.favoritePlayers}
              chipColor="secondary"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <PreferenceSection
              title="Content Preferences"
              items={userPreferences.contentPreferences}
              chipColor="info"
            />
            <PreferenceSection
              title="Preferred Languages"
              items={userPreferences.preferredLanguages?.map(
                (code) => LANGUAGE_MAP[code] || code
              )}
              chipColor="success"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {Object.entries(
                  userPreferences.notificationPreferences || {}
                ).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key.charAt(0).toUpperCase()}${key.slice(1)}: ${
                      value ? "On" : "Off"
                    }`}
                    color={value ? "success" : "default"}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(userPreferences.updatedAt).toLocaleString()}
          </Typography>
        </Box>

        <Dialog
          open={isEditModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Preferences</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
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
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
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
                    <FormHelperText>
                      {errors.favoriteTeams?.message}
                    </FormHelperText>
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
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
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

              {/* Add more form fields for other preferences as needed */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Paper>
    </Container>
  );
}
