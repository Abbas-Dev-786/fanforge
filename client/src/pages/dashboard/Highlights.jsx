import { useState, useEffect, useRef, memo } from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SpeedIcon from "@mui/icons-material/Speed";
import StraightenIcon from "@mui/icons-material/Straighten";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useAuth } from "../../hooks/useAuth";
import { useHighlights } from "../../hooks/useHighlights";
import { useTheme } from "@emotion/react";
import {
  translateText,
  translateAudio,
} from "../../services/translate.service";
import { useQuery } from "@tanstack/react-query";

const VideoContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  backgroundColor: theme.palette.background.default,
  scrollSnapAlign: "start",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    height: "100vh",
  },
}));

const VideoWrapper = styled(Box)(({ theme }) => ({
  flex: "1 1 75%",
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#000",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    flex: "1 1 65%",
  },
}));

const Video = styled("video")({
  width: "auto",
  height: "auto",
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  display: "block",
  margin: "auto",
});

const InfoPanel = styled(Box)(({ theme }) => ({
  flex: "1 1 25%",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(4),
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  borderLeft: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("md")]: {
    flex: "1 1 35%",
    padding: theme.spacing(3),
  },
}));

const Controls = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(3),
  top: theme.spacing(3),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1),
  color: "white",
  zIndex: 2,
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(4px)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  transition: "all 0.2s ease",
  padding: theme.spacing(1),
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateX(8px)",
    backgroundColor: theme.palette.action.hover,
  },
}));

const Stats = memo(({ stats }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
      Stats
    </Typography>
    <StatItem>
      <SpeedIcon sx={{ color: (theme) => theme.palette.primary.main }} />
      <Typography variant="body2">
        Exit Velocity: {stats.exitVelocity} mph
      </Typography>
    </StatItem>
    <StatItem>
      <StraightenIcon sx={{ color: (theme) => theme.palette.primary.main }} />
      <Typography variant="body2">Distance: {stats.hitDistance} ft</Typography>
    </StatItem>
    <StatItem>
      <ShowChartIcon sx={{ color: (theme) => theme.palette.primary.main }} />
      <Typography variant="body2">
        Launch Angle: {stats.launchAngle}°
      </Typography>
    </StatItem>
  </Box>
));

Stats.displayName = "Stats";

const VideoControls = memo(({ onLike, onShare, isLiked }) => (
  <Controls>
    <ControlButton onClick={onLike}>
      {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </ControlButton>
    <ControlButton onClick={onShare}>
      <ShareIcon />
    </ControlButton>
  </Controls>
));

VideoControls.displayName = "VideoControls";

const HighlightVideo = memo(({ highlight, onVideoEnd }) => {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedTitle, setTranslatedTitle] = useState(highlight.title);
  const [isTranslatingAudio, setIsTranslatingAudio] = useState(false);
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const handleAudioTranslation = async () => {
      if (selectedLanguage === "en") {
        setTranslatedAudioUrl("");
        setTranslatedText("");
        if (videoRef.current) {
          videoRef.current.muted = false;
        }
        return;
      }

      try {
        setIsTranslatingAudio(true);
        const response = await translateAudio(
          highlight.videoUrl,
          selectedLanguage
        );

        // Get translated text and audio from response
        const { translatedText, audioContent } = response;

        // Convert base64 to audio URL
        const audioUrl = `data:audio/mp3;base64,${audioContent}`;
        setTranslatedAudioUrl(audioUrl);
        setTranslatedText(translatedText);

        // Mute original video audio
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      } catch (error) {
        console.error("Error translating audio:", error);
      } finally {
        setIsTranslatingAudio(false);
      }
    };

    handleAudioTranslation();
  }, [selectedLanguage, highlight.videoUrl]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(console.error);
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleLike = () => setIsLiked((prev) => !prev);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: highlight.title,
          text: `Exit Velocity: ${highlight.stats.exitVelocity} mph | Distance: ${highlight.stats.hitDistance} ft`,
          url: window.location.href,
        })
        .catch(console.error);
    }
  };

  return (
    <VideoContainer>
      <VideoWrapper>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Video
            ref={videoRef}
            src={highlight.videoUrl}
            loop
            playsInline
            onClick={handleVideoClick}
            onEnded={onVideoEnd}
            style={{
              cursor: "pointer",
              maxHeight: "calc(100vh - 92px)",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
        <VideoControls
          onLike={handleLike}
          onShare={handleShare}
          isLiked={isLiked}
        />
        {isTranslatingAudio && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              borderRadius: 1,
              px: 2,
              py: 1,
            }}
          >
            <CircularProgress size={20} color="inherit" />
            <Typography variant="body2">Translating audio...</Typography>
          </Box>
        )}
      </VideoWrapper>

      <InfoPanel>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={selectedLanguage}
              label="Language"
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="it">Italian</MenuItem>
              <MenuItem value="ja">Japanese</MenuItem>
              <MenuItem value="ko">Korean</MenuItem>
              <MenuItem value="zh">Chinese</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {highlight.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {highlight.date}
          </Typography>
        </Box>

        <Stats stats={highlight.stats} />

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Description
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.6, mb: 2 }}
          >
            {selectedLanguage === "en"
              ? highlight.description || "No description available"
              : translatedText || "Translation not available"}
          </Typography>

          {selectedLanguage !== "en" && translatedAudioUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Translated Audio
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "background.neutral",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <audio
                  controls
                  src={translatedAudioUrl}
                  style={{ width: "100%" }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </InfoPanel>
    </VideoContainer>
  );
});

HighlightVideo.displayName = "HighlightVideo";

export default function Highlights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const containerRef = useRef(null);
  const { highlights, isLoading, fetchNextPage } = useHighlights();

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollTop;
    const videoHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / videoHeight);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }

    if (
      scrollPosition + videoHeight >=
      container.scrollHeight - videoHeight * 2
    ) {
      fetchNextPage();
    }
  };

  if (isLoading && !highlights.length) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100vh",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "#000",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        position: "fixed",
        top: { xs: "64px", sm: "64px", md: "92px" },
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
      onScroll={handleScroll}
    >
      {highlights.map((highlight, index) => (
        <Box
          key={`${highlight.id}-${index}`}
          sx={{
            width: "100%",
            height: "calc(100vh - 64px)",
            scrollSnapAlign: "start",
            [theme.breakpoints.up("md")]: {
              height: "calc(100vh - 92px)",
            },
          }}
        >
          <HighlightVideo
            highlight={highlight}
            onVideoEnd={() => {
              const nextIndex = currentIndex + 1;
              if (nextIndex < highlights.length) {
                containerRef.current?.scrollTo({
                  top: nextIndex * (window.innerHeight - 64),
                  behavior: "smooth",
                });
              }
            }}
          />
        </Box>
      ))}
      {isLoading && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={4}
          height="100px"
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
