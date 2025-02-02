import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

const API_URL =
  "https://mlb-hackathon-883391227520.us-central1.run.app/recommend";
const START_ID_URL =
  "https://mlb-hackathon-883391227520.us-central1.run.app/start-id";

async function fetchInitialId() {
  const response = await fetch(START_ID_URL);
  const data = await response.json();
  return data.id;
}

async function fetchHighlights({ initialDocumentId, user }) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEvent: {
        eventType: "view-item",
        userPseudoId: user?.uid || "anonymous",
        documents: [{ id: initialDocumentId }],
      },
      params: {
        returnDocument: true,
      },
    }),
  });

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return { highlights: [], hasMore: false, attributionToken: null };
  }

  const highlights = data.results.map((result) => ({
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

  return {
    highlights,
    hasMore: true,
    attributionToken: data.attributionToken,
  };
}

export function useHighlights() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for initial document ID
  const { data: initialDocumentId } = useQuery({
    queryKey: ["initialDocumentId"],
    queryFn: fetchInitialId,
    staleTime: Infinity, // Keep the ID fresh forever
  });

  // Query for highlights
  const {
    data,
    isLoading,
    fetchNextPage: fetchMore,
    hasNextPage,
    isFetchingNextPage,
  } = useQuery({
    queryKey: ["highlights", initialDocumentId, user?.uid],
    queryFn: () => fetchHighlights({ initialDocumentId, user }),
    enabled: !!initialDocumentId, // Only fetch when we have the initial ID
    select: (data) => ({
      highlights: data.highlights || [],
      hasMore: data.hasMore,
      attributionToken: data.attributionToken,
    }),
    keepPreviousData: true, // Keep showing old data while fetching new data
  });

  // Prefetch next page of highlights
  const prefetchNextPage = useCallback(() => {
    if (data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: [
          "highlights",
          data.highlights[data.highlights.length - 1]?.id,
          user?.uid,
        ],
        queryFn: () =>
          fetchHighlights({
            initialDocumentId: data.highlights[data.highlights.length - 1]?.id,
            user,
          }),
      });
    }
  }, [data, queryClient, user]);

  // Fetch next page of highlights
  const fetchNextPage = useCallback(() => {
    if (!isFetchingNextPage && data?.hasMore) {
      fetchMore();
      prefetchNextPage();
    }
  }, [isFetchingNextPage, data?.hasMore, fetchMore, prefetchNextPage]);

  return {
    highlights: data?.highlights || [],
    isLoading: isLoading || isFetchingNextPage,
    hasMore: data?.hasMore ?? true,
    fetchNextPage,
  };
}
