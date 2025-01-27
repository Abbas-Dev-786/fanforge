import { useQuery } from "@tanstack/react-query";
import { playersService } from "../services/players.service";

export const usePlayer = (playerId) => {
  return useQuery({
    queryKey: ["player", playerId],
    queryFn: async () => {
      const data = await playersService.getPlayerById(playerId);
      return data.people[0];
    },
    enabled: !!playerId,
  });
}; 