import { useEffect, useState } from "react";
import client from "../api/client.js";

export function useMetadata() {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .get("/metadata")
      .then((res) => setMetadata(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, []);

  return { metadata, error };
}
