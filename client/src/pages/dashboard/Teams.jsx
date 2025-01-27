import { Grid, Typography, Container } from "@mui/material";
import { useTeams } from "../../hooks/useTeams";
import TeamCard from "../../components/teams/TeamCard";
import ErrorDisplay from "../../components/shared/ErrorDisplay";
import LoadingGrid from "../../components/shared/LoadingGrid";

export default function Teams() {
  const { data: teams, isLoading, error } = useTeams();

  if (error) {
    return <ErrorDisplay message="Error loading teams" />;
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 4 }}>
        MLB Teams
      </Typography>

      <Grid container spacing={3}>
        {isLoading ? (
          <LoadingGrid count={30} />
        ) : (
          teams.map((team) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
              <TeamCard team={team} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}
