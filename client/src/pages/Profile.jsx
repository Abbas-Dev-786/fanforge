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
  Avatar,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import EditProfileModal from "../components/profile/EditProfileModal";

const LANGUAGE_MAP = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
};

export default function Profile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [interests, setInterests] = useState(null);

  const { reset } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const docRef = doc(db, "interests", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInterests(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, [currentUser.uid]);

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

  const handleSaveProfile = async (newInterests) => {
    try {
      await setDoc(
        doc(db, "interests", currentUser.uid),
        {
          ...interests,
          ...newInterests,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      setInterests((prev) => ({ ...prev, ...newInterests }));
    } catch (error) {
      console.error("Error updating profile:", error);
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

  if (!interests) {
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4">Profile</Typography>
            <Button
              variant="contained"
              onClick={() => setEditModalOpen(true)}
              startIcon={<EditIcon />}
            >
              Edit Preferences
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <Avatar
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5">{currentUser.displayName}</Typography>
              <Typography color="text.secondary">
                {currentUser.email}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Favorite Teams
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {interests?.favoriteTeams?.map((team) => (
              <Grid item xs={6} sm={4} md={3} key={team.id}>
                <Card
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dashboard/teams/${team.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://www.mlbstatic.com/team-logos/${team.id}.svg`}
                    alt={team.name}
                    sx={{ objectFit: "contain", p: 2, bgcolor: "#f5f5f5" }}
                  />
                  <CardContent>
                    <Typography variant="body1" align="center">
                      {team.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" gutterBottom>
            Favorite Players
          </Typography>
          <Grid container spacing={2}>
            {interests?.favoritePlayers?.map((player) => (
              <Grid item xs={6} sm={4} md={3} key={player.id}>
                <Card
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dashboard/players/${player.id}`)}
                >
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Avatar
                      src={`https://img.mlbstatic.com/mlb/images/players/head_shot/${player.id}.jpg`}
                      alt={player.name}
                      sx={{
                        width: 100,
                        height: 100,
                        margin: "0 auto",
                        mb: 2,
                        border: "2px solid",
                        borderColor: "divider",
                      }}
                    />
                    <Typography variant="body1" gutterBottom>
                      {player.name}
                    </Typography>
                    <Chip
                      label={player.position}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
        currentInterests={interests}
      />
    </Container>
  );
}
