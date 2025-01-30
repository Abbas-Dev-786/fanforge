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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { usePlayerChat } from "../../hooks/usePlayerChat";

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
  const chatContainerRef = useRef(null);
  const { sendMessage, isLoading } = usePlayerChat(player);

  useEffect(() => {
    // Add initial greeting from the player
    setMessages([
      {
        content: `Hey there! I'm ${player.fullName}. Great to meet you! Feel free to ask me anything about my career, stats, or baseball in general.`,
        isUser: false,
      },
    ]);
  }, [player.fullName]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);

    try {
      // Get response from Gemini
      const response = await sendMessage(userMessage);

      // Add bot response to chat
      setMessages((prev) => [...prev, { content: response, isUser: false }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          content:
            "I'm having trouble responding right now. Could you try asking that again?",
          isUser: false,
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
          gap: 2,
        }}
      >
        <Avatar
          src={`https://img.mlbstatic.com/mlb/images/players/head_shot/${player.id}.jpg`}
          sx={{ width: 48, height: 48 }}
        />
        <Typography variant="h6">Chat with {player.fullName}</Typography>
      </Box>

      {/* Messages Container */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          bgcolor: "grey.50",
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
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
          disabled={isLoading || !message.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
