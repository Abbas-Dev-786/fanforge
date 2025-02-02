import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

const API_URL =
  "https://mlb-hackathon-883391227520.us-central1.run.app/recommend";

export function useHighlights(initialDocumentId = null) {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [attributionToken, setAttributionToken] = useState(null);
  const { user } = useAuth();

  const fetchHighlights = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEvent: {
            eventType: "view-item",
            userPseudoId: user?.uid || "anonymous",
            documents:
              // highlights.length > 0
              //   ? [{ id: highlights[highlights.length - 1].id }]
              [{ id: initialDocumentId }],
          },
          params: {
            returnDocument: true,
          },
        }),
      });

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
        return;
      }

      // Store attribution token for next requests
      if (data.attributionToken) {
        setAttributionToken(data.attributionToken);
      }

      const newHighlights = data.results.map((result) => ({
        id: result.document.id,
        videoUrl: result.document.structData.video,
        title: result.document.structData.title,
        exitVelocity: result.document.structData.ExitVelocity,
        launchAngle: result.document.structData.LaunchAngle,
        hitDistance: result.document.structData.HitDistance,
        playId: result.document.structData.play_id,
        stats: {
          exitVelocity: result.document.structData.ExitVelocity,
          launchAngle: result.document.structData.LaunchAngle,
          hitDistance: result.document.structData.HitDistance,
        },
      }));

      setHighlights((prev) => [...prev, ...newHighlights]);
    } catch (error) {
      console.error("Error fetching highlights:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, highlights, user, initialDocumentId]);

  const fetchNextPage = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchHighlights();
    }
  }, [fetchHighlights, isLoading, hasMore]);

  useEffect(() => {
    fetchHighlights();
  }, []);

  return {
    highlights,
    isLoading,
    hasMore,
    fetchNextPage,
  };
}
