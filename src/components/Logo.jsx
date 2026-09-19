import { cn } from '@/lib/utils'

/**
 * Custom hub-and-spoke mark: three nodes converging on a center point.
 * Deliberately not a stock icon-in-a-square — this is the one glyph used
 * consistently as the app's identity (sidebar, auth screens, favicon).
 */
export default function Logo({ className, markClassName, size = 36 }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn('flex shrink-0 items-center justify-center rounded-[10px] bg-[#1c1712]', markClassName)}
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.52}
          height={size * 0.52}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: '#f4ece2' }}
        >
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
          <circle cx="12" cy="4" r="1.8" fill="currentColor" fillOpacity="0.9" />
          <circle cx="19.8" cy="16" r="1.8" fill="currentColor" fillOpacity="0.9" />
          <circle cx="4.2" cy="16" r="1.8" fill="currentColor" fillOpacity="0.9" />
          <path
            d="M12 6.4V10M13.7 13.2L18.3 15.4M10.3 13.2L5.7 15.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  )
}
