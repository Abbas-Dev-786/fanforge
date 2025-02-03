import {
  Grid,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTeams } from "../../hooks/useTeams";
import TeamCard from "../../components/teams/TeamCard";
import ErrorDisplay from "../../components/shared/ErrorDisplay";
import LoadingGrid from "../../components/shared/LoadingGrid";

export default function Teams() {
  const { data: teams, isLoading, error } = useTeams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (error) {
    return <ErrorDisplay message="Error loading teams" />;
  }

  return (
    <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 3 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: isMobile ? 2 : 4,
          px: isMobile ? 1 : 0,
        }}
      >
        MLB Teams
      </Typography>

      <Grid container spacing={isMobile ? 1 : 3}>
        {isLoading ? (
          <LoadingGrid count={30} />
        ) : (
          teams.map((team) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={team.id}
              sx={{ p: isMobile ? 1 : 2 }}
            >
              <TeamCard team={team} isMobile={isMobile} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}
