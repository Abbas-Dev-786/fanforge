import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Fade,
} from "@mui/material";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import mlbService from "../../services/mlb.service";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const currentYear = new Date().getFullYear();
  const [selectedSeason, setSelectedSeason] = useState(currentYear);

  // Generate years for dropdown (from 2010 to current year)
  const years = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => currentYear - i
  );

  // Query for schedule
  const { data: scheduleData } = useQuery({
    queryKey: ["schedule", today, selectedSeason],
    queryFn: () =>
      mlbService.getSchedule({
        sportId: 1,
        season: selectedSeason,
      }),
    select: (data) => data.dates || [],
  });

  const renderSeasonSelector = () => (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        background: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ color: theme.palette.primary.main, fontWeight: "medium" }}
        >
          MLB Season Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="season-select-label">Season</InputLabel>
          <Select
            labelId="season-select-label"
            value={selectedSeason}
            label="Season"
            onChange={(e) => setSelectedSeason(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                py: 1,
              },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );

  const renderSchedule = () => (
    <Fade in timeout={700}>
      <Card elevation={3}>
        <CardHeader
          title={`${selectedSeason} MLB Games`}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            "& .MuiCardHeader-title": { fontSize: "1.2rem" },
          }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {scheduleData?.map(({ games }) => {
              const game = games[0];

              return (
                <Grid item xs={12} sm={6} md={4} key={game.gamePk}>
                  <Paper
                    elevation={2}
                    onClick={() => navigate(`/dashboard/match/${game.gamePk}`)}
                    sx={{
                      p: 2,
                      background: theme.palette.background.paper,
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {game.teams.away.team.name} @{" "}
                        {game.teams.home.team.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {format(new Date(game.gameDate), "h:mm a")}{" "}
                        {format(new Date(game.gameDate), "MMM dd, yyyy")}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: "medium",
                        }}
                      >
                        {game.status.detailedState}
                      </Typography>
                      {game.venue && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="textSecondary"
                        >
                          {game.venue.name}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {renderSeasonSelector()}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderSchedule()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
