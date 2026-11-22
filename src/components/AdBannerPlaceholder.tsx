/**
 * Simple 320x50 Banner Ad Placeholder.
 * Isolated component so it can be replaced cleanly with AdMob or another SDK later.
 */
export function AdBannerPlaceholder() {
  return (
    <aside
      aria-label="Advertisement"
      className="w-full flex justify-center pt-2 pb-1"
    >
      <div
        className="w-[320px] max-w-full h-[50px] bg-stone-200/85 border border-stone-300 rounded-md flex items-center justify-center select-none"
      >
        <span className="text-[11px] font-medium tracking-[0.18em] text-stone-500 uppercase">
          ADVERTISEMENT
        </span>
      </div>
    </aside>
  );
}
