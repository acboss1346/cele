/**
 * favouritesReducer.js
 * 
 * Manages the list of favourited photo IDs using React's useReducer.
 * 
 * Why useReducer instead of useState?
 * 1. Predictable state transitions: State transitions (adding vs removing a favourite)
 *    are declared as explicit actions rather than arbitrary state setters.
 * 2. Separation of concerns: Complex state logic is isolated into a pure, testable function
 *    outside of the UI components.
 * 3. Scalability: Adding new favourite actions (e.g. CLEAR_ALL, BULK_FAVOURITE) in the future
 *    requires editing only this reducer without changing component signatures.
 */

export const FAVOURITES_STORAGE_KEY = 'celebrare_favourites';

// Action type constants to prevent spelling mistakes
export const FAVOURITES_ACTIONS = {
  TOGGLE_FAVOURITE: 'TOGGLE_FAVOURITE',
  LOAD_FAVOURITES: 'LOAD_FAVOURITES',
};

/**
 * Lazy initializer function for useReducer.
 * Reads existing favourites from localStorage before the first render.
 * Using this ensures saved favourites are loaded immediately and not overwritten by an empty array.
 */
export function getInitialFavourites() {
  try {
    const saved = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // Gracefully handle malformed or non-array data
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load favourites from localStorage:', error);
    return [];
  }
}

/**
 * Pure reducer function for favourites state.
 * State is an array of photo IDs: e.g. ['0', '1', '10']
 * 
 * @param {string[]} state - Current array of favourite photo IDs
 * @param {{ type: string, payload: any }} action - Dispatched action
 * @returns {string[]} Next state
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    // TOGGLE_FAVOURITE: If the photo ID is already favourited, remove it. Otherwise, add it.
    case FAVOURITES_ACTIONS.TOGGLE_FAVOURITE: {
      const photoId = action.payload;
      if (state.includes(photoId)) {
        // Return a new array excluding the photoId (immutable update)
        return state.filter((id) => id !== photoId);
      } else {
        // Return a new array including the photoId (immutable update)
        return [...state, photoId];
      }
    }

    // LOAD_FAVOURITES: Overwrites state with a validated array of favourite IDs
    case FAVOURITES_ACTIONS.LOAD_FAVOURITES: {
      return Array.isArray(action.payload) ? action.payload : [];
    }

    default:
      return state;
  }
}
