import { useState, useEffect } from 'react';

/**
 * useFetchPhotos
 * 
 * Custom React hook that encapsulates data fetching from the Picsum Photos API.
 * 
 * Why use a custom hook for data fetching?
 * 1. Separation of Concerns: Keeps Gallery.jsx focused on UI layout and rendering,
 *    while all network logic, lifecycle handling, and error checking stay isolated here.
 * 2. Reusability: Any component in the app can easily fetch photos by calling this hook.
 * 3. Lifecycle Safety: Handles unmounting cleanly using an AbortController so state
 *    is not updated if the component unmounts while the request is still pending.
 * 
 * @returns {{ photos: Array, loading: boolean, error: string|null }}
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController allows us to cancel the fetch if the component unmounts
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://picsum.photos/v2/list?limit=30', { signal });

        // HTTP status check: response.ok is true if status code is in the 200-299 range
        if (!response.ok) {
          throw new Error(`Failed to fetch photos (Status: ${response.status} ${response.statusText})`);
        }

        const data = await response.json();

        // Safety check to ensure the API returned an array of photos
        if (!Array.isArray(data)) {
          throw new Error('Received unexpected data format from API.');
        }

        setPhotos(data);
      } catch (err) {
        // If the request was aborted due to component unmounting, do not treat as an error
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'An unexpected error occurred while fetching photos.');
      } finally {
        // Only set loading to false if the request was not aborted
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    // Cleanup function: aborts fetch when component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  // Return exactly the three values specified in the assignment
  return { photos, loading, error };
}
