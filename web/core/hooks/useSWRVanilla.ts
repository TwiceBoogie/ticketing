import { useEffect, useRef, useState } from "react";

// Global in-memory cache shared accross hook instances
const cache = new Map();
// Tracks ongoing fetch promises to deduplicate requests
// when calling 'useSWRVanilla("USER_INFORMATION")
// checks if there already a fetch promise
// if yes, wait for thtat promise to finish, don't create a new one
// if no, create a new fetcher() call, and store the promise in the map.
const inFlightRequests = new Map();

// Types for config and return values
interface SWRConfig<T> {
  revalidateOnFocus?: boolean;
  shouldRetryOnError?: boolean;
  retryCount?: number;
  dedupingInterval?: number;
  fallbackData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

interface SWRResult<T> {
  data: T | null;
  error: any;
  isLoading: boolean;
  mutate: (newDataOrUpdater: T | ((prevData: T | null) => T), shouldRevalidate?: boolean) => Promise<void>;
}

export function useSWRVanilla<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  config: SWRConfig<T> = {}
): SWRResult<T> {
  const {
    revalidateOnFocus = true,
    shouldRetryOnError = true,
    retryCount: maxRetries = 3,
    dedupingInterval = 2000,
    fallbackData,
    onSuccess,
    onError,
  } = config;

  // Initializze state
  // check 'cache' if it has data via the key if not then null.
  const [data, setData] = useState<T | null>(() => cache.get(key) ?? fallbackData ?? null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cache.has(key) && !fallbackData);

  // Refs to track fetch state and lifecycle
  // track how many retries have been made without losing count accross renders
  const retryRef = useRef(0);
  // used for deduping with dedupingInterval
  const lastFetchedAtRef = useRef(0);
  // guard against calling setState on an unmounted component.
  // e.g. user navigated away mid-fetch
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const load = async () => {
      const now = Date.now();

      // Skip if deduping interval has not expired
      // if we fetched this key recently, within dedupingInterval ms, then serve
      // the cached version and skip making another fetch
      if (cache.has(key) && now - lastFetchedAtRef.current < dedupingInterval) {
        setData(cache.get(key));
        setIsLoading(false);
        return;
      }

      // 🧠 Avoid duplicate network requests:
      // If another component (or previous call) is already fetching this key,
      // don't start a new fetch. Just wait for the existing in-flight Promise to resolve.
      // This ensures:
      // - ✅ only one request hits the network
      // - ✅ all consumers get the same data
      // - ✅ race conditions are avoided (no overwriting newer data with older)
      // When the in-flight request resolves, we use its result and skip further logic
      if (inFlightRequests.has(key)) {
        const result = await inFlightRequests.get(key); // wait for existing fetch to finish
        setData(result); // reuse the result (already cached inside the promise)
        setIsLoading(false); // we're no longer loading
        return; // exit the `load()` function early
      }

      setIsLoading(true);

      // 🧠 Wrap fetch in retry + error handling
      const fetchPromise = fetcher()
        .then((res) => {
          if (isMountedRef.current) {
            cache.set(key, res);
            setData(res);
            setError(null);
            lastFetchedAtRef.current = Date.now();
            onSuccess?.(res);
          }
          return res;
        })
        .catch(async (err) => {
          if (isMountedRef.current && shouldRetryOnError && retryRef.current < maxRetries) {
            retryRef.current++;
            // create delay
            await new Promise((r) => setTimeout(r, 1000 * retryRef.current)); // exponential backoff
            return load(); // try again
          }

          if (isMountedRef.current) {
            setError(err);
            onError?.(err);
          }
        })
        .finally(() => {
          if (isMountedRef.current) {
            setIsLoading(false);
          }
          inFlightRequests.delete(key);
        });

      // Track ongoing request for deduplication
      inFlightRequests.set(key, fetchPromise);
    };

    load();

    // 🧠 Revalidate when tab becomes focused
    const handleFocus = () => {
      if (revalidateOnFocus) load();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [key]);

  /**
   * Manually update the cached value and optionally revalidate it.
   */
  const mutate = async (newDataOrUpdater: T | ((prevData: T | null) => T), shouldRevalidate = true) => {
    const updatedData =
      typeof newDataOrUpdater === "function"
        ? (newDataOrUpdater as (prev: T | null) => T)(cache.get(key) ?? null)
        : newDataOrUpdater;

    cache.set(key, updatedData);
    setData(updatedData);

    if (shouldRevalidate) {
      try {
        const newRes = await fetcher();
        cache.set(key, newRes);
        setData(newRes);
        setError(null);
        onSuccess?.(newRes);
      } catch (err) {
        setError(err);
        onError?.(err);
      }
    }
  };

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
