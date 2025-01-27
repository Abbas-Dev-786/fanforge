import { useParams } from "react-router";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import { useTeam, useTeamRoster } from "../../hooks/useTeams";
import ErrorDisplay from "../../components/shared/ErrorDisplay";
import LoadingScreen from "../../components/LoadingScreen";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const positions = {
  Pitcher: "P",
  Catcher: "C",
  Infielder: "IF",
  Outfielder: "OF",
};

export default function TeamDetails() {
  const { teamId } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [positionFilter, setPositionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useTeam(teamId);

  const {
    data: rosterData,
    isLoading: rosterLoading,
    error: rosterError,
  } = useTeamRoster(teamId);

  if (teamLoading || rosterLoading) return <LoadingScreen />;
  if (teamError || rosterError)
    return <ErrorDisplay message="Error loading team data" />;

  const team = teamData?.teams[0];
  const roster = rosterData?.roster || [];

  const filteredRoster = roster.filter((player) => {
    const matchesPosition =
      positionFilter === "all" ? true : player.position.type === positionFilter;
    const matchesSearch = player.person.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPositionFilter(
      newValue === 0 ? "all" : Object.keys(positions)[newValue - 1]
    );
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Team Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Avatar
                  src={`https://www.mlbstatic.com/team-logos/${team?.id}.svg`}
                  alt={team?.name}
                  sx={{ width: 100, height: 100 }}
                />
                <Box>
                  <Typography variant="h4">{team?.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {team?.locationName}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      icon={<SportsBaseballIcon />}
                      label={`${roster.length} Players`}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      icon={<GroupIcon />}
                      label="Active Roster"
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Roster Section */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All Players" />
                <Tab label="Pitchers" />
                <Tab label="Catchers" />
                <Tab label="Infielders" />
                <Tab label="Outfielders" />
              </Tabs>
            </Box>

            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRoster.map((player) => (
                    <TableRow key={player.person.id}>
                      <TableCell>{player.jerseyNumber || "—"}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {player.person.fullName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={player.position.abbreviation}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{player.position.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={player.status.description}
                          size="small"
                          color={
                            player.status.code === "A" ? "success" : "default"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
