# 5-Minute Screen Recording Guide & Script
### Celebrare Frontend React Internship Pre-Screening Submission

> **Tip before recording**:
> - Have your app running on `http://localhost:5173/` in your browser.
> - Have VS Code open side-by-side with your code files ready: `Gallery.jsx`, `useFetchPhotos.js`, `favouritesReducer.js`.
> - Speak naturally, calmly, and maintain steady pacing (~130 words per minute).
> - Free recording tools:
>   - **Mac**: Open QuickTime Player → *File* → *New Screen Recording*.
>   - **Windows**: Press `Win + G` or use OBS Studio.
>   - Upload the recording to **YouTube (set to Unlisted)** or **Google Drive (set permissions to "Anyone with the link can view")**.

---

## ⏱️ Video Timeline Overview

| Timestamp | Section | Key Visual Focus |
|---|---|---|
| **0:00 – 1:00** | Demonstrate the App | Browser: Loading, Grid, Real-Time Search, Favouriting, Page Refresh Persistence |
| **1:00 – 2:00** | Explain `useFetchPhotos` | Code: `src/hooks/useFetchPhotos.js` |
| **2:00 – 3:00** | Explain `useReducer` | Code: `src/reducers/favouritesReducer.js` & `Gallery.jsx` |
| **3:00 – 4:00** | Explain `useCallback` & `useMemo` | Code: `src/components/Gallery.jsx` (search handler & filtering) |
| **4:00 – 5:00** | Explain the Difficult Part | Code & Discussion: Syncing `useReducer` with `localStorage` safely |

---

## 🎙️ Word-for-Word Spoken Script

### **0:00 – 1:00: Demonstrate the App**
*(Screen: Open your web browser at `http://localhost:5173`)*

> "Hi, my name is [Your Name], and this is my submission for the Celebrare Frontend React Internship Pre-Screening Assignment.
> 
> Let's start with a quick walkthrough of the app.
> 
> When the page loads, you can see our animated spinner while photos are fetched from the Picsum API. The app renders 30 photos in a clean, responsive grid—four columns on desktop, two on tablet, and one on mobile.
> 
> At the top, we have a real-time search bar. If I type an author's name, for example 'Alejandro' or 'Paul', the grid filters instantly as I type without reloading the page and without making any extra network requests. If I search for an author that doesn't exist, we see a clean empty state message: *'No photos found. Try a different author name.'* Clicking the clear button restores the full list immediately.
> 
> Next, on each card, we have a heart icon button. When I click it, the heart turns red, a 'Favourited' badge appears, and our top counter updates. If I click it again, it unfavourites. 
> 
> Most importantly, if I favourite a couple of photos and refresh the browser, notice that the favourites persist seamlessly because they are stored in `localStorage`."

---

### **1:00 – 2:00: Explain `useFetchPhotos`**
*(Screen: Switch to VS Code and show `src/hooks/useFetchPhotos.js`)*

> "Now let's dive into the code. All data fetching logic is isolated inside our custom hook, `useFetchPhotos`.
> 
> We chose to extract this into a custom hook to maintain a clean separation of concerns. The `Gallery` component only cares about UI presentation, while all networking, lifecycle management, and error handling are centralized here.
> 
> The hook manages three state variables: `photos`, `loading`, and `error`, and returns exactly `{ photos, loading, error }`.
> 
> Inside `useEffect`, we trigger the fetch to Picsum. We check `response.ok` before parsing the JSON data. If the server returns a 404 or 500 error, or if network connectivity is lost, an error is caught in our `catch` block and the `error` state is updated with a user-friendly message. 
> 
> We also instantiate an `AbortController`. In the cleanup function returned by `useEffect`, we call `controller.abort()`. This prevents memory leaks and guarantees we never attempt to update state if the component unmounts while the request is in flight."

---

### **2:00 – 3:00: Explain `useReducer`**
*(Screen: Switch to `src/reducers/favouritesReducer.js` and show the reducer and actions)*

> "Next, as required by the assignment, favourites are managed strictly using `useReducer` rather than `useState`.
> 
> Here in `favouritesReducer.js`, we have a pure reducer function that manages an array of favourite photo IDs. It handles two primary actions:
> 1. `TOGGLE_FAVOURITE`: Takes a photo ID. If that ID is already in the array, it returns a filtered array without that ID. If it isn't present, it returns a new array with the ID appended. This ensures pure, immutable state transitions.
> 2. `LOAD_FAVOURITES`: Restores and validates saved favourites into the reducer state.
> 
> Why use `useReducer` instead of `useState` here? In production React applications like Celebrare's dashboard, toggling items involves explicit business logic. `useReducer` centralizes state update rules into one testable function, decouples action dispatching from state logic, and makes it trivial to add future actions like clearing or bulk-saving favourites."

---

### **3:00 – 4:00: Explain `useCallback` & `useMemo`**
*(Screen: Switch to `src/components/Gallery.jsx` and highlight `handleSearch` and `filteredPhotos`)*

> "In `Gallery.jsx`, we use the two performance hooks: `useCallback` and `useMemo`.
> 
> First, `handleSearch` is wrapped in `useCallback` with an empty dependency array. In React, regular functions are re-created in memory on every render. `useCallback` memoizes the function definition so that React preserves the exact same function reference across all re-renders.
> 
> Second, `filteredPhotos` is computed using `useMemo`. It recalculates only when its dependencies—`photos` or `searchTerm`—change. 
> 
> To be completely honest, if we removed `useCallback` and `useMemo` in this small app, the search and gallery would still work without throwing runtime errors. What would change is performance: every time a user toggles a favourite heart, the component re-renders. Without `useMemo`, React would unnecessarily re-run the filtering loop across all 30 photos on every single heart click. `useMemo` guarantees that the previous filtered array reference is reused when search criteria have not changed."

---

### **4:00 – 5:00: Explain the Difficult Part**
*(Screen: Show `getInitialFavourites` in `favouritesReducer.js` and the `useEffect` in `Gallery.jsx`)*

> "Finally, let's talk about the most challenging part of this assignment: properly syncing `useReducer` with `localStorage` without accidentally wiping user data.
> 
> If you initialise `useReducer` with an empty array `[]` and immediately run a `useEffect` that synchronises the state to `localStorage`, a dangerous race condition can happen. On initial mount, that `useEffect` can fire with the empty initial state before any restore action is dispatched, accidentally overwriting and deleting the user's previously saved favourites in `localStorage`!
> 
> To solve this cleanly, I used `useReducer`'s third argument: the lazy initializer function, `getInitialFavourites`. 
> 
> This function synchronously reads and parses `localStorage` inside a safe `try...catch` block *before* the first render ever happens. As a result, the reducer state already contains the persisted favourites on render number one. Then, our `useEffect` only writes updates when the user actually modifies their favourites.
> 
> That concludes my walkthrough. The app strictly follows all 7 requirements with zero external UI libraries, fully responsive Tailwind design, and clean hook architecture. Thank you for watching!"

---

## ✅ Pre-Recording Checklist

- [ ] Dev server running (`npm run dev`) at `http://localhost:5173/`
- [ ] Browser window sized to show desktop grid (4 columns)
- [ ] DevTools responsive toggle tested (mobile 1 col, tablet 2 cols)
- [ ] No console errors or warnings in the browser inspection window
- [ ] Files open in your editor:
  - `src/components/Gallery.jsx`
  - `src/hooks/useFetchPhotos.js`
  - `src/reducers/favouritesReducer.js`
- [ ] Microphone check and audio clarity tested
