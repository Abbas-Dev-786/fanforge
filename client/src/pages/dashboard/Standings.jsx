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
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Fade,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import mlbService from "../../services/mlb.service";

const Standings = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [selectedSeason, setSelectedSeason] = useState(currentYear);

  // Generate years for dropdown (from 2010 to current year)
  const years = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => currentYear - i
  );

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
          MLB Standings
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
        <Typography color="error">Failed to load MLB standings data</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {renderSeasonSelector()}
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
    </Container>
  );
};

export default Standings;
