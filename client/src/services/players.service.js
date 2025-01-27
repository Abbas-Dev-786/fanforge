import api from "../api/axios";

const MLB_API_URL = "https://statsapi.mlb.com/api/v1";

export const playersService = {
  getPlayerById: (playerId) => api.get(`${MLB_API_URL}/people/${playerId}`),
}; 