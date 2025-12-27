export function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="BrewBuzz Logo"
        >
            {/* The "Press" / Plunger shape */}
            <rect x="35" y="20" width="30" height="6" fill="currentColor" rx="0" />
            <rect x="48" y="26" width="4" height="24" fill="currentColor" />

            {/* The "Cup" / Base shape - Geometric and solid */}
            <path
                d="M20 50H80C80 50 80 85 50 85C20 85 20 50 20 50Z"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
            />

            {/* The "Brew/Liquid" Level - Accent fill */}
            <path
                d="M26 55H74C74 55 73 78 50 78C27 78 26 55 26 55Z"
                fill="currentColor"
                opacity="0.2"
            />

            {/* The "Buzz" - A stylized steam/signal element top right */}
            <circle cx="82" cy="35" r="4" fill="currentColor" />
        </svg>
    );
}