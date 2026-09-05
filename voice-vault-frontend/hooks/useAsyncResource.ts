import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils";

type ResourceStatus = "loading" | "error" | "ready";

export function useAsyncResource<T>(fetcher: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ResourceStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetcher()
      .then((result) => {
        if (ignore) return;
        setData(result);
        setStatus("ready");
      })
      .catch((err) => {
        if (ignore) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  function retry() {
    setStatus("loading");
    fetcher()
      .then((result) => {
        setData(result);
        setStatus("ready");
      })
      .catch((err) => {
        setError(getErrorMessage(err));
        setStatus("error");
      });
  }

  return { data, status, error, retry, mutate: setData };
}
