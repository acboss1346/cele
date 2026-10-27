# Photo Gallery Web App

A clean, responsive, and accessible Photo Gallery web application built with **React**, **Vite**, and **Tailwind CSS**. This project was created for the **Celebrare Frontend React Internship Pre-Screening Assignment**.

The application fetches photos from the public Picsum Photos API, displays them in a fully responsive grid, allows real-time author search filtering without re-fetching, and manages saved favourites using `useReducer` with seamless `localStorage` persistence across page refreshes.

---

## 🚀 Features

1. **Custom Data Fetching Hook (`useFetchPhotos`)**:
   - Fetches 30 photos on initial load from `https://picsum.photos/v2/list?limit=30`.
   - Dedicated state for `photos`, `loading`, and `error`.
   - Graceful HTTP error handling and unmount cleanup via `AbortController`.
   - Animated CSS loading spinner and clear error messages.

2. **Responsive Photo Grid**:
   - **Mobile** (< 640px): 1 column.
   - **Tablet** (640px – 1023px): 2 columns.
   - **Desktop** (≥ 1024px): 4 columns.
   - Clean card layout with author names, optimized Picsum images, subtle borders, and rounded corners.

3. **Real-Time Author Search**:
   - Instant search filtering as you type with zero additional API requests or page reloads.
   - Case-insensitive search with safe handling for missing author names.
   - Helpful empty state message: *"No photos found. Try a different author name."*
   - Clear button to quickly reset search and restore all photos.

4. **Favourites with `useReducer` & `localStorage`**:
   - Managed with `useReducer` (no `useState` used for favourites).
   - Toggles photo IDs in and out of the favourites list via pure reducer actions.
   - Persists favourited photos in `localStorage` across page refreshes.
   - Lazy initializer prevents race conditions and ensures saved favourites are never accidentally overwritten on initial render.
   - Visually distinct heart button state and accessible `aria-pressed` / `aria-label` attributes.

5. **Performance Hooks (`useCallback` & `useMemo`)**:
   - `useCallback` provides a stable function reference for the search input handler.
   - `useMemo` caches the filtered photo calculations to avoid unnecessary recalculations during unrelated renders (e.g. when toggling favourites).

---

## 🛠️ Technology Stack

- **React 19** (Functional components and Hooks only)
- **Vite** (Fast dev server and bundler)
- **Tailwind CSS v4** (Utility-first styling with `@tailwindcss/vite`)
- **Native Browser Fetch API**
- **Native Browser `localStorage` API**
- **Inline SVG Icons** (Zero external icon libraries or component frameworks)

---

## 📁 Project Structure

```text
cele/
├── src/
│   ├── components/
│   │   ├── Gallery.jsx          # Main gallery UI, search bar, state wiring & grid
│   │   └── PhotoCard.jsx        # Individual card with photo, author & heart toggle
│   ├── hooks/
│   │   └── useFetchPhotos.js    # Custom hook encapsulating API fetch, loading & error
│   ├── reducers/
│   │   └── favouritesReducer.js # Pure reducer function, action types & localStorage loader
│   ├── App.jsx                  # Application layout wrapper
│   ├── main.jsx                 # React root entry point
│   └── index.css                # Tailwind CSS import and global styles
├── index.html                   # HTML template with meta tags & title
├── package.json                 # Project dependencies and scripts
├── vite.config.js               # Vite config with React and Tailwind plugins
├── SCREEN_RECORDING_GUIDE.md    # 5-minute video presentation script
└── README.md                    # Project documentation
```

---

## 💻 Installation and Local Development

Follow these simple steps to run the application locally:

### 1. Clone the repository / navigate to project root
```bash
cd cele
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### 4. Build for production (optional)
```bash
npm run build
npm run preview
```

---

## 🧠 Concepts Explained for Beginners

### 1. Custom Hook: `useFetchPhotos`
In React, a custom hook is a JavaScript function that starts with `use` and can call other React hooks. 

Instead of cluttering the UI component (`Gallery.jsx`) with fetch logic, `useEffect`, error handling, and three separate pieces of state (`photos`, `loading`, `error`), we put all of that logic inside `src/hooks/useFetchPhotos.js`.

- **Why it matters**: It separates **data logic** from **presentation logic**. `Gallery.jsx` simply calls `const { photos, loading, error } = useFetchPhotos();` without worrying about how network requests work or how HTTP errors are caught.
- **Error Handling**: If the API is down or returns a 404/500, `response.ok` evaluates to `false`. We throw an error, catch it, and set the `error` state. The UI displays a clear error card instead of crashing.
- **Cleanup**: We use an `AbortController` in the cleanup function so if the component unmounts before the network request finishes, the fetch is aborted cleanly without causing memory leaks or updating unmounted component state.

---

### 2. State Management with `useReducer`
`useReducer` is an alternative to `useState` that is ideal when state transitions follow specific, predefined rules.

Our `favouritesReducer` handles two actions:
1. `TOGGLE_FAVOURITE`: Takes a photo ID payload. If the ID is already in our favourites array, it returns a new array with that ID removed (`state.filter(...)`). If the ID is not in the array, it returns a new array with the ID added (`[...state, photoId]`).
2. `LOAD_FAVOURITES`: Replaces the current state with a validated array of saved favourite IDs.

**Why `useReducer` over `useState`?**
- **State integrity**: Instead of scattering multiple setter functions or complex filtering logic across event handlers in components, all rules for how state can change live in one pure, predictable function.
- **Immutability**: Reducers never mutate state directly (they always return a brand-new array), preventing subtle React re-rendering bugs.

---

### 3. How `localStorage` Persistence Works
When a user favourites a photo and refreshes the browser, they expect their favourites to still be there.

We achieve this with two simple steps:
1. **Lazy Initialization (`getInitialFavourites`)**:
   When `useReducer` is called:
   ```javascript
   const [favourites, dispatch] = useReducer(favouritesReducer, [], getInitialFavourites);
   ```
   React runs `getInitialFavourites()` **once** before the initial render. It reads `'celebrare_favourites'` from `localStorage`, parses the JSON safely in a `try...catch` block, and uses it as the initial state.
2. **Syncing via `useEffect`**:
   Whenever `favourites` changes, this effect runs:
   ```javascript
   useEffect(() => {
     try {
       localStorage.setItem('celebrare_favourites', JSON.stringify(favourites));
     } catch (err) {
       console.error('Failed to persist favourites:', err);
     }
   }, [favourites]);
   ```
   This ensures `localStorage` is always in sync with our reducer state.

---

### 4. Why `useCallback` for the Search Handler
```javascript
const handleSearch = useCallback((event) => {
  setSearchTerm(event.target.value);
}, []);
```
In React, every time a component re-renders, all functions declared inside it are re-created as new function instances in memory. 

`useCallback` caches the function definition between renders. Because its dependency array is empty (`[]`), React gives us the exact same function reference across all renders. 

*(Honest note: If you removed `useCallback`, the search bar would still work perfectly. However, `useCallback` is a React best practice to prevent child components or event listeners that receive the handler as a prop from re-rendering unnecessarily).*

---

### 5. Why `useMemo` for the Filtered Photo List
```javascript
const filteredPhotos = useMemo(() => {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return photos;
  return photos.filter((photo) =>
    photo.author ? photo.author.toLowerCase().includes(query) : false
  );
}, [photos, searchTerm]);
```
`useMemo` caches the **result** of a calculation. 

Filtering an array of 30 items takes CPU work. Without `useMemo`, that filtering logic would run on **every single render**—even when the user toggles a favourite button (which changes `favourites` state, not `photos` or `searchTerm`).

With `useMemo`, React will only re-run the filtering loop when `photos` or `searchTerm` actually changes. If the user clicks a heart button, React re-uses the already-filtered array from memory.
