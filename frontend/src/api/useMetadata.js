import { useCallback, useEffect, useState } from "react";
import client from "../api/client.js";

export function useMetadata() {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetadata = useCallback((retryCount = 0) => {
    setLoading(true);
    setError(null);
    client
      .get("/metadata")
      .then((res) => {
        setMetadata(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.response?.data?.details || err.response?.data?.error || err.message;
        if (retryCount < 2) {
          // Cold start retry after 4 seconds
          setTimeout(() => fetchMetadata(retryCount + 1), 4000);
        } else {
          setError(errMsg);
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return { metadata, error, loading, refetch: () => fetchMetadata(0) };
}
