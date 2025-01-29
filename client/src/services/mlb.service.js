import axiosInstance from "../api/axios";

const MLB_STATS_API_BASE_URL = "https://statsapi.mlb.com/api/v1";

class MLBService {
  // Get team information
  async getTeams(season = new Date().getFullYear()) {
    return axiosInstance.get(`${MLB_STATS_API_BASE_URL}/teams`, {
      params: {
        season,
        sportId: 1, // MLB
      },
    });
  }

  // Get player information
  async getPlayer(playerId) {
    return axiosInstance.get(`${MLB_STATS_API_BASE_URL}/people/${playerId}`);
  }

  // Get team roster
  async getTeamRoster(teamId, season = new Date().getFullYear()) {
    return axiosInstance.get(
      `${MLB_STATS_API_BASE_URL}/teams/${teamId}/roster`,
      {
        params: {
          season,
        },
      }
    );
  }

  // Get game schedule
  async getSchedule(params = {}) {
    const { season, ...otherParams } = params;
    return axiosInstance.get(`${MLB_STATS_API_BASE_URL}/schedule`, {
      params: {
        sportId: 1,
        season: season || new Date().getFullYear(),
        ...otherParams,
      },
    });
  }

  // Get standings
  async getStandings(season = new Date().getFullYear()) {
    return axiosInstance.get(`${MLB_STATS_API_BASE_URL}/standings`, {
      params: {
        season,
        leagueId: "103,104", // Both AL and NL
        sportId: 1,
      },
    });
  }

  // Get game feed/live data
  async getGameFeed(gamePk) {
    return axiosInstance.get(
      `${MLB_STATS_API_BASE_URL}/game/${gamePk}/feed/live`
    );
  }
}

export const mlbService = new MLBService();
export default mlbService;
