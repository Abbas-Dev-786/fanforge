import { useState, useRef } from "react";
import { Box, IconButton, Typography, Avatar } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ShareIcon from "@mui/icons-material/Share";

export default function VideoCard({ video, inView }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-play when in view
  if (inView && !isPlaying && videoRef.current) {
    videoRef.current.play();
    setIsPlaying(true);
  }

  // Pause when out of view
  if (!inView && isPlaying && videoRef.current) {
    videoRef.current.pause();
    setIsPlaying(false);
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        bgcolor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        ref={videoRef}
        src={video.url}
        loop
        muted={isMuted}
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* Overlay Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar src={video.channelAvatar} sx={{ mr: 1 }} />
          <Typography variant="subtitle1">{video.channelName}</Typography>
        </Box>
        <Typography variant="h6">{video.title}</Typography>
      </Box>

      {/* Side Controls */}
      <Box
        sx={{
          position: "absolute",
          right: 16,
          bottom: 100,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <IconButton onClick={togglePlay} sx={{ color: "white" }}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={toggleMute} sx={{ color: "white" }}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <ThumbUpIcon />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <ShareIcon />
        </IconButton>
      </Box>
    </Box>
  );
} 