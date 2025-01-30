import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export function usePlayerChat(player) {
  const [isLoading, setIsLoading] = useState(false);

  // Create the player's context/persona
  const playerContext = {
    name: player.fullName,
    position: player.primaryPosition.name,
    team: player.currentTeam?.name || "Free Agent",
    number: player.primaryNumber,
    birthPlace: `${player.birthCity}, ${player.birthStateProvince}, ${player.birthCountry}`,
    stats: player.stats || {},
    // Add more player details as needed
  };

  const generatePrompt = (userMessage) => {
    return `You are ${playerContext.name}, a ${playerContext.position} for the ${playerContext.team}. 
    Your jersey number is ${playerContext.number}. You were born in ${playerContext.birthPlace}.
    
    Important instructions:
    1. Always respond in first person ("I", "me", "my")
    2. Stay in character as ${playerContext.name}
    3. Use your baseball knowledge and experience
    4. If asked about non-baseball topics, respond naturally while staying in character
    5. Be friendly and engaging
    6. Use your real stats and information when available
    7. For questions you don't have specific data for, respond based on public knowledge about yourself
    
    User message: ${userMessage}`;
  };

  const sendMessage = async (message) => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = generatePrompt(message);

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
}
