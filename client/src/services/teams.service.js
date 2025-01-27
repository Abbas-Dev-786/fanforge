import api from "../api/axios";

const MLB_API_URL = "https://statsapi.mlb.com/api/v1";

export const teamsService = {
  getMLBTeams: () => api.get(`${MLB_API_URL}/teams`),
  getTeamById: (teamId) => api.get(`${MLB_API_URL}/teams/${teamId}`),
  getTeamRoster: (teamId) => api.get(`${MLB_API_URL}/teams/${teamId}/roster`),
  // Add more team-related API calls here
};
