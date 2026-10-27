import React from 'react';

/**
 * PhotoCard
 * 
 * Renders an individual photo card with:
 * 1. The photo (with appropriate aspect ratio and object-fit)
 * 2. The author's name
 * 3. An accessible heart button for toggling favourites
 * 
 * @param {Object} props
 * @param {Object} props.photo - Photo data object from Picsum API
 * @param {boolean} props.isFavourite - Whether this photo is currently favourited
 * @param {Function} props.onToggleFavourite - Callback function to toggle favourite status
 */
export function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  // Use a suitable Picsum image size for fast loading and crisp resolution
  // Picsum API format: https://picsum.photos/id/{id}/{width}/{height}
  const imageUrl = photo.id 
    ? `https://picsum.photos/id/${photo.id}/600/400`
    : photo.download_url;

  const handleHeartClick = (e) => {
    // Prevent event bubbling to parent card containers
    e.stopPropagation();
    onToggleFavourite(photo.id);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Photo Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={photo.author ? `Photo by ${photo.author}` : 'Gallery photo'}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Floating Heart Button on Top-Right of the Image */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-pressed={isFavourite}
          aria-label={isFavourite ? `Remove ${photo.author || 'photo'} from favourites` : `Add ${photo.author || 'photo'} to favourites`}
          title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
            isFavourite
              ? 'bg-white/95 text-red-500 shadow-md scale-105'
              : 'bg-black/35 text-white hover:bg-white/95 hover:text-red-500 hover:scale-110'
          }`}
        >
          {/* Simple Inline SVG Heart Icon (No external icon library used) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform duration-150"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? '0' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Card Info Footer */}
      <div className="flex items-center justify-between p-3.5">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Author
          </p>
          <h3 
            className="truncate text-sm font-semibold text-slate-800" 
            title={photo.author || 'Unknown Artist'}
          >
            {photo.author || 'Unknown Artist'}
          </h3>
        </div>

        {/* Small badge showing favourite status */}
        {isFavourite && (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 border border-red-200/60">
            Favourited
          </span>
        )}
      </div>
    </article>
  );
}
