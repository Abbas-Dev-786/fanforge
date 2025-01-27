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
