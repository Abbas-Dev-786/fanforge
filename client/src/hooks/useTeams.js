import { useQuery } from "@tanstack/react-query";
import { teamsService } from "../services/teams.service";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const data = await teamsService.getMLBTeams();
      // Filter teams for Major League Baseball
      return data.teams.filter(
        (team) => team.sport.name === "Major League Baseball"
      );
    },
  });
};

export const useTeam = (teamId) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => teamsService.getTeamById(teamId),
    enabled: !!teamId,
  });
};

export function useTeamRoster(teamIds) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rosters", teamIds],
    queryFn: async () => {
      if (!teamIds || teamIds.length === 0) return null;

      // Fetch rosters for all selected teams
      const rosterPromises = teamIds.map(async (teamId) => {
        const response = await fetch(
          `https://statsapi.mlb.com/api/v1/teams/${teamId}/roster/active`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      });

      // Wait for all roster requests to complete
      const rosters = await Promise.all(rosterPromises);

      // Combine all rosters into a single roster array
      const combinedRoster = rosters.reduce((acc, curr) => {
        if (curr && curr.roster) {
          return [...acc, ...curr.roster];
        }
        return acc;
      }, []);

      return { roster: combinedRoster };
    },
    enabled: !!teamIds && teamIds.length > 0,
  });

  return { data, isLoading, error };
}
