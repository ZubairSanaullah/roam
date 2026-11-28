import { useCallback, useEffect, useState } from "react";
import {
  fetchLiveStayById,
  fetchLiveStays,
  type LiveStayDetail,
  type LiveStaySummary,
} from "@/lib/sanity";

export function useLiveStays() {
  const [stays, setStays] = useState<LiveStaySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const data = await fetchLiveStays(controller.signal);
        if (controller.signal.aborted) return;
        setStays(data);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Unable to load stays right now. Check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [reloadTick]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadTick((tick) => tick + 1);
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    setReloadTick((tick) => tick + 1);
  }, []);

  return {
    stays,
    loading,
    refreshing,
    error,
    reload,
    refresh,
  };
}

interface StayRequestResult {
  key: string;
  stay: LiveStayDetail | null;
  error: string | null;
}

export function useLiveStay(id?: string) {
  const [reloadTick, setReloadTick] = useState(0);
  const requestKey = id ? `${id}:${reloadTick}` : "";
  const [result, setResult] = useState<StayRequestResult>({
    key: "",
    stay: null,
    error: null,
  });

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const activeKey = `${id}:${reloadTick}`;

    void (async () => {
      try {
        const data = await fetchLiveStayById(id, controller.signal);
        if (controller.signal.aborted) return;
        setResult({ key: activeKey, stay: data, error: null });
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setResult({
          key: activeKey,
          stay: null,
          error: "Unable to load stay details right now.",
        });
      }
    })();

    return () => {
      controller.abort();
    };
  }, [id, reloadTick]);

  const reload = useCallback(() => {
    if (!id) return;
    setReloadTick((tick) => tick + 1);
  }, [id]);

  const isSettled = Boolean(id) && result.key === requestKey;

  return {
    stay: isSettled ? result.stay : null,
    loading: Boolean(id) && !isSettled,
    error: isSettled ? result.error : null,
    reload,
  };
}
