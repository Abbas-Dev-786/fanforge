import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
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
  useTheme,
  Chip,
  Avatar,
} from "@mui/material";
import { format } from "date-fns";
import mlbService from "../../services/mlb.service";

const MatchDetails = () => {
  const { gameId } = useParams();
  const theme = useTheme();

  const { data: gameData, isLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => mlbService.getGameFeed(gameId),
    refetchInterval: (data) => {
      // Refetch every minute if game is live
      return data?.gameData?.status?.abstractGameState === "Live"
        ? 60000
        : false;
    },
  });

  const renderScoreCard = () => {
    const teams = gameData?.liveData?.linescore?.teams;
    const home = gameData?.gameData?.teams?.home;
    const away = gameData?.gameData?.teams?.away;

    return (
      <Card elevation={3}>
        <CardHeader
          title="Score"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            "& .MuiCardHeader-title": { fontSize: "1.2rem" },
          }}
        />
        <CardContent>
          <Grid container spacing={3}>
            {/* Away Team */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar alt={away?.name} src={away?.logo} />
                  <Typography variant="h6">{away?.name}</Typography>
                </Box>
                <Typography variant="h4">{teams?.away?.runs || 0}</Typography>
              </Paper>
            </Grid>

            {/* Home Team */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderLeft: `4px solid ${theme.palette.secondary.main}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar alt={home?.name} src={home?.logo} />
                  <Typography variant="h6">{home?.name}</Typography>
                </Box>
                <Typography variant="h4">{teams?.home?.runs || 0}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderGameInfo = () => {
    const venue = gameData?.gameData?.venue;
    const datetime = gameData?.gameData?.datetime;
    const status = gameData?.gameData?.status;
    const inningState = gameData?.liveData?.linescore?.inningState;
    const currentInning = gameData?.liveData?.linescore?.currentInning;

    return (
      <Card elevation={3}>
        <CardHeader
          title="Game Information"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            "& .MuiCardHeader-title": { fontSize: "1.2rem" },
          }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={status?.detailedState}
                  color={
                    status?.abstractGameState === "Live" ? "success" : "default"
                  }
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Grid>
            {status?.abstractGameState === "Live" && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Current Inning
                  </Typography>
                  <Typography variant="body1">
                    {inningState} {currentInning}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {datetime?.dateTime &&
                    format(new Date(datetime?.dateTime), "PPP p")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Venue
                </Typography>
                <Typography variant="body1">{venue?.name || "N/A"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderBoxScore = () => {
    const teams = gameData?.liveData?.boxscore?.teams;
    const innings = gameData?.liveData?.linescore?.innings;

    return (
      <Card elevation={3}>
        <CardHeader
          title="Box Score"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            "& .MuiCardHeader-title": { fontSize: "1.2rem" },
          }}
        />
        <CardContent>
          <Box sx={{ overflowX: "auto" }}>
            <Grid container>
              {/* Header */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    borderBottom: 1,
                    borderColor: "divider",
                    p: 1,
                  }}
                >
                  <Box sx={{ width: 120 }}>
                    <Typography variant="subtitle2">Team</Typography>
                  </Box>
                  {innings?.map((inning) => (
                    <Box
                      key={inning.num}
                      sx={{ width: 40, textAlign: "center" }}
                    >
                      <Typography variant="subtitle2">{inning.num}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="subtitle2">R</Typography>
                  </Box>
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="subtitle2">H</Typography>
                  </Box>
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="subtitle2">E</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Away Team */}
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", p: 1, bgcolor: "background.default" }}
                >
                  <Box sx={{ width: 120 }}>
                    <Typography variant="body2">
                      {teams?.away?.team?.name}
                    </Typography>
                  </Box>
                  {innings?.map((inning) => (
                    <Box
                      key={inning.num}
                      sx={{ width: 40, textAlign: "center" }}
                    >
                      <Typography variant="body2">
                        {inning.away.runs}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="body2">
                      {teams?.away?.teamStats?.batting?.runs}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="body2">
                      {teams?.away?.teamStats?.batting?.hits}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="body2">
                      {teams?.away?.teamStats?.fielding?.errors}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Home Team */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", p: 1 }}>
                  <Box sx={{ width: 120 }}>
                    <Typography variant="body2">
                      {teams?.home?.team?.name}
                    </Typography>
                  </Box>
                  {innings?.map((inning) => (
                    <Box
                      key={inning.num}
                      sx={{ width: 40, textAlign: "center" }}
                    >
                      <Typography variant="body2">
                        {inning.home.runs}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="body2">
                      {teams?.home?.teamStats?.batting?.runs}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="body2">
                      {teams?.home?.teamStats?.batting?.hits}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40, textAlign: "center" }}>
                    <Typography variant="body2">
                      {teams?.home?.teamStats?.fielding?.errors}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderScoreCard()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderGameInfo()}
        </Grid>
        <Grid item xs={12}>
          {renderBoxScore()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MatchDetails;
