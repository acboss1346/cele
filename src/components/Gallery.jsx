import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import {
  favouritesReducer,
  getInitialFavourites,
  FAVOURITES_ACTIONS,
  FAVOURITES_STORAGE_KEY,
} from '../reducers/favouritesReducer';
import { PhotoCard } from './PhotoCard';

/**
 * Gallery
 * 
 * Main gallery component responsible for:
 * 1. Fetching photos via the custom useFetchPhotos hook.
 * 2. Managing real-time search filtering with useState, useCallback, and useMemo.
 * 3. Managing favourites state using useReducer and persisting to localStorage.
 * 4. Rendering loading, error, empty, and responsive grid states.
 */
export function Gallery() {
  // 1. Data Fetching via Custom Hook
  // Extracts API logic, loading spinner state, and error handling away from the UI.
  const { photos, loading, error } = useFetchPhotos();

  // 2. Search Term State
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Favourites State via useReducer with Lazy Initial State
  // Initial state is loaded directly from localStorage using getInitialFavourites.
  // This prevents an empty array from briefly wiping existing favourites on initial render.
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    getInitialFavourites
  );

  // 4. Persist favourites to localStorage whenever favourites state changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      console.error('Failed to persist favourites to localStorage:', err);
    }
  }, [favourites]);

  /**
   * useCallback for Search Handler:
   * Memoizes the handleSearch function reference between renders.
   * Because it has an empty dependency array [], this function reference remains stable
   * across all renders and avoids unnecessary re-creations.
   */
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  /**
   * Handler to toggle favourite status for a given photo ID.
   * Dispatches the TOGGLE_FAVOURITE action to our pure reducer.
   */
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({
      type: FAVOURITES_ACTIONS.TOGGLE_FAVOURITE,
      payload: photoId,
    });
  }, []);

  /**
   * useMemo for Filtered Photo List:
   * Memoizes the computed filtered photo array.
   * Filtering only re-runs when either 'photos' or 'searchTerm' changes.
   * If other state changes (such as toggling a favourite), useMemo returns the
   * previously computed array reference, avoiding redundant array iterations.
   */
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    // If search is empty, return the full list of photos
    if (!query) {
      return photos;
    }

    // Safely filter by author name (case-insensitive and safe against null/undefined author)
    return photos.filter((photo) => {
      const authorName = photo.author ? photo.author.toLowerCase() : '';
      return authorName.includes(query);
    });
  }, [photos, searchTerm]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <header className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Photo Gallery
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Explore stunning photos, search by author in real time, and save your favourites.
        </p>

        {/* Favourites summary badge */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {favourites.length} {favourites.length === 1 ? 'photo favourited' : 'photos favourited'}
          </span>
        </div>
      </header>

      {/* Real-Time Search Filter Bar */}
      <section className="mb-8 max-w-xl mx-auto" aria-label="Search filter">
        <div className="relative">
          {/* Search Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input Field */}
          <input
            id="author-search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search photos by author name..."
            aria-label="Search photos by author name"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          {/* Clear Search Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* 1. Loading State */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          {/* Animated CSS Spinner */}
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 mb-4" />
          <p className="text-base font-medium text-slate-600">Loading photos...</p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div
          role="alert"
          className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800 shadow-sm"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold">Unable to Load Photos</h2>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* 3. Empty Search Results State */}
      {!loading && !error && filteredPhotos.length === 0 && (
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-700">No photos found.</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different author name.
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-4 inline-flex items-center rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Clear search filter
            </button>
          )}
        </div>
      )}

      {/* 4. Responsive Photo Grid */}
      {/* Mobile: 1 col, Tablet: 2 cols (sm:grid-cols-2), Desktop: 4 cols (lg:grid-cols-4) */}
      {!loading && !error && filteredPhotos.length > 0 && (
        <section aria-label="Photo collection">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
