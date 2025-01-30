import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  useTheme,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { usePlayerChat } from "../../hooks/usePlayerChat";
import LanguageSelector from "./LanguageSelector";
import {
  translateText,
  detectLanguage,
} from "../../services/translate.service";

const Message = ({ content, isUser, playerImage }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 2,
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      <Avatar src={isUser ? null : playerImage} sx={{ width: 40, height: 40 }}>
        {isUser ? "U" : null}
      </Avatar>
      <Paper
        sx={{
          p: 2,
          maxWidth: "70%",
          bgcolor: isUser
            ? theme.palette.primary.main
            : theme.palette.background.paper,
          color: isUser ? "white" : "inherit",
          borderRadius: 2,
        }}
      >
        <Typography>{content}</Typography>
      </Paper>
    </Box>
  );
};

export default function PlayerChat({ player }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const chatContainerRef = useRef(null);
  const { sendMessage, isLoading } = usePlayerChat(player);

  useEffect(() => {
    // Add initial greeting from the player
    const greeting = `Hey there! I'm ${player.fullName}. Great to meet you! Feel free to ask me anything about my career, stats, or baseball in general.`;

    const translateAndSetGreeting = async () => {
      if (selectedLanguage !== "en") {
        setIsTranslating(true);
        try {
          const translatedGreeting = await translateText(
            greeting,
            selectedLanguage
          );
          setMessages([
            {
              content: translatedGreeting,
              isUser: false,
              originalContent: greeting,
            },
          ]);
        } catch (error) {
          console.error("Translation error:", error);
          setMessages([
            {
              content: greeting,
              isUser: false,
              originalContent: greeting,
            },
          ]);
        }
        setIsTranslating(false);
      } else {
        setMessages([
          {
            content: greeting,
            isUser: false,
            originalContent: greeting,
          },
        ]);
      }
    };

    translateAndSetGreeting();
  }, [player.fullName, selectedLanguage]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLanguageChange = async (newLanguage) => {
    setSelectedLanguage(newLanguage);

    // Translate all existing messages to the new language
    setIsTranslating(true);
    try {
      const translatedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (newLanguage === "en") {
            return {
              ...msg,
              content: msg.originalContent,
            };
          }
          const translatedContent = await translateText(
            msg.originalContent,
            newLanguage
          );
          return {
            ...msg,
            content: translatedContent,
          };
        })
      );
      setMessages(translatedMessages);
    } catch (error) {
      console.error("Translation error:", error);
    }
    setIsTranslating(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");

    // Detect language of user message
    try {
      const detectedLanguage = await detectLanguage(userMessage);

      // Add user message to chat
      setMessages((prev) => [
        ...prev,
        {
          content: userMessage,
          isUser: true,
          originalContent: userMessage,
        },
      ]);

      // If user's message is not in English, translate it for the AI
      let messageForAI = userMessage;
      if (detectedLanguage !== "en") {
        messageForAI = await translateText(userMessage, "en", detectedLanguage);
      }

      // Get response from Gemini
      const response = await sendMessage(messageForAI);

      // Translate AI response if needed
      let finalResponse = response;
      if (selectedLanguage !== "en") {
        finalResponse = await translateText(response, selectedLanguage);
      }

      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        {
          content: finalResponse,
          isUser: false,
          originalContent: response,
        },
      ]);
    } catch (error) {
      console.error("Error in message handling:", error);
      setMessages((prev) => [
        ...prev,
        {
          content:
            "I'm having trouble responding right now. Could you try asking that again?",
          isUser: false,
          originalContent:
            "I'm having trouble responding right now. Could you try asking that again?",
        },
      ]);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "600px",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={`https://img.mlbstatic.com/mlb/images/players/head_shot/${player.id}.jpg`}
            sx={{ width: 48, height: 48 }}
          />
          <Typography variant="h6">Chat with {player.fullName}</Typography>
        </Stack>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </Box>

      {/* Messages Container */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          bgcolor: "grey.50",
          position: "relative",
        }}
      >
        {messages.map((msg, index) => (
          <Message
            key={index}
            content={msg.content}
            isUser={msg.isUser}
            playerImage={`https://img.mlbstatic.com/mlb/images/players/head_shot/${player.id}.jpg`}
          />
        ))}
        {(isLoading || isTranslating) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              position: isTranslating ? "absolute" : "static",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: isTranslating
                ? "rgba(255, 255, 255, 0.8)"
                : "transparent",
              alignItems: isTranslating ? "center" : "flex-start",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={isLoading || isTranslating || !message.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
