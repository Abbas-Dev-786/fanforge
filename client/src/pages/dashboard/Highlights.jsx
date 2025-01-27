import { useState, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import VideoCard from "../../components/highlights/VideoCard";
import { useInView } from "react-intersection-observer";

// Sample data - replace with your actual API data
const SAMPLE_VIDEOS = [
  {
    id: 1,
    url: "https://example.com/video1.mp4",
    title: "Amazing Home Run by Player X",
    channelName: "MLB Highlights",
    channelAvatar: "https://example.com/avatar1.jpg",
  },
  {
    id: 1,
    url: "https://example.com/video1.mp4",
    title: "Amazing Home Run by Player X",
    channelName: "MLB Highlights",
    channelAvatar: "https://example.com/avatar1.jpg",
  },
  {
    id: 1,
    url: "https://example.com/video1.mp4",
    title: "Amazing Home Run by Player X",
    channelName: "MLB Highlights",
    channelAvatar: "https://example.com/avatar1.jpg",
  },
  // Add more videos...
];

export default function Highlights() {
  const [videos, setVideos] = useState(SAMPLE_VIDEOS);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  // Load more videos when reaching the end
  const loadMoreVideos = useCallback(() => {
    setLoading(true);
    // Implement your API call here
    // For now, we'll just simulate loading more videos
    setTimeout(() => {
      setVideos((prev) => [
        ...prev,
        // Add more sample videos
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {videos.map((video) => (
        <Box
          key={video.id}
          sx={{
            height: "100vh",
            scrollSnapAlign: "start",
          }}
        >
          <VideoInView video={video} />
        </Box>
      ))}
    </Box>
  );
}

// Wrapper component to handle intersection observer
function VideoInView({ video }) {
  const { ref, inView } = useInView({
    threshold: 0.7, // Video is considered in view when 70% visible
  });

  return (
    <div ref={ref}>
      <VideoCard video={video} inView={inView} />
    </div>
  );
}
