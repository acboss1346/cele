import React from 'react';
import { Gallery } from './components/Gallery';

/**
 * App Component
 * 
 * Top-level application shell providing the global page layout.
 * Hosts the Gallery component and maintains a clean, responsive layout.
 */
function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Main Gallery Area */}
      <Gallery />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <p>Celebrare Frontend Internship Pre-Screening Assignment • Photo Gallery</p>
      </footer>
    </div>
  );
}

export default App;
