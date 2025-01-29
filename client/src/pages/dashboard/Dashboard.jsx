import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
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

// Custom TabPanel component for standings
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`standings-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Dashboard = () => {
  const theme = useTheme();
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
        // date: today,
        // gameTypes: ["R"],
        season: selectedSeason,
      }),
    select: (data) => data.dates || [],
  });

  // Query for standings
  const {
    data: standings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["standings", selectedSeason],
    queryFn: async () => {
      const data = await mlbService.getStandings(selectedSeason);
      return data.records;
    },
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
            {console.log(scheduleData)}
            {scheduleData?.map(({ games }) => {
              const game = games[0];

              return (
                <Grid item xs={12} sm={6} md={4} key={game.gamePk}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      background: theme.palette.background.paper,
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
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

  const renderStandings = () => (
    <Fade in timeout={900}>
      <Card elevation={3}>
        <CardHeader
          title={`${selectedSeason} MLB Standings`}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            "& .MuiCardHeader-title": { fontSize: "1.2rem" },
          }}
        />
        {standings.length > 0 && (
          <Box sx={{ p: 2 }}>
            {standings.map((division) => (
              <Box key={division.division.id} sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: theme.palette.primary.main }}
                >
                  {division.division.name}
                </Typography>
                <Grid container spacing={1}>
                  {division.teamRecords.map((team, index) => (
                    <Grid item xs={12} key={team.team.id}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          bgcolor:
                            index % 2 === 0
                              ? "background.default"
                              : "background.paper",
                          "&:hover": {
                            bgcolor: theme.palette.action.hover,
                            transform: "translateX(4px)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "medium" }}
                          >
                            {team.team.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Typography variant="body2">
                            {team.wins}-{team.losses}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            .{Math.round(team.winningPercentage * 1000)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            GB: {team.gamesBack || "-"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </Fade>
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error">Failed to load MLB data</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {renderSeasonSelector()}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderSchedule()}
        </Grid>
        <Grid item xs={12}>
          {renderStandings()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
