interface SkateHubbaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function SkateHubbaLogo({
  className = "",
  size = "md",
}: SkateHubbaLogoProps) {
  const sizeClasses = {
    sm: "w-32 h-8",
    md: "w-48 h-12",
    lg: "w-64 h-16",
    xl: "w-80 h-20",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 320 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle for street art feel */}
        <circle
          cx="52"
          cy="40"
          r="38"
          fill="currentColor"
          className="text-skatehubba-primary/10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4,4"
          style={{ stroke: "rgb(255 123 0 / 0.3)" }}
        />

        {/* Skateboard deck - more dynamic angle */}
        <path
          d="M10 35C10 18 22 8 40 8H64C82 8 94 18 94 35V45C94 62 82 72 64 72H40C22 72 10 62 10 45V35Z"
          fill="currentColor"
          className="text-skatehubba-primary"
          transform="rotate(-5 52 40)"
        />

        {/* Skateboard nose and tail curves */}
        <path
          d="M40 8C35 8 30 12 28 18"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/30"
          fill="none"
          transform="rotate(-5 52 40)"
        />
        <path
          d="M64 72C69 72 74 68 76 62"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/30"
          fill="none"
          transform="rotate(-5 52 40)"
        />

        {/* Skateboard trucks with better detail */}
        <rect
          x="18"
          y="32"
          width="10"
          height="6"
          rx="3"
          fill="currentColor"
          className="text-gray-300"
          transform="rotate(-5 52 40)"
        />
        <rect
          x="76"
          y="42"
          width="10"
          height="6"
          rx="3"
          fill="currentColor"
          className="text-gray-300"
          transform="rotate(-5 52 40)"
        />

        {/* Skateboard wheels with motion lines */}
        <circle
          cx="23"
          cy="28"
          r="5"
          fill="currentColor"
          className="text-gray-400"
        />
        <circle
          cx="23"
          cy="52"
          r="5"
          fill="currentColor"
          className="text-gray-400"
        />
        <circle
          cx="81"
          cy="28"
          r="5"
          fill="currentColor"
          className="text-gray-400"
        />
        <circle
          cx="81"
          cy="52"
          r="5"
          fill="currentColor"
          className="text-gray-400"
        />

        {/* Motion/speed lines */}
        <line
          x1="5"
          y1="25"
          x2="12"
          y2="25"
          stroke="currentColor"
          strokeWidth="2"
          className="text-skatehubba-primary/50"
        />
        <line
          x1="3"
          y1="30"
          x2="10"
          y2="30"
          stroke="currentColor"
          strokeWidth="2"
          className="text-skatehubba-primary/40"
        />
        <line
          x1="5"
          y1="35"
          x2="12"
          y2="35"
          stroke="currentColor"
          strokeWidth="2"
          className="text-skatehubba-primary/60"
        />
        <line
          x1="3"
          y1="45"
          x2="10"
          y2="45"
          stroke="currentColor"
          strokeWidth="2"
          className="text-skatehubba-primary/40"
        />
        <line
          x1="5"
          y1="50"
          x2="12"
          y2="50"
          stroke="currentColor"
          strokeWidth="2"
          className="text-skatehubba-primary/50"
        />
        <line
          x1="3"
          y1="55"
          x2="10"
          y2="55"
          stroke="currentColor"
          strokeWidth="2"
          className="text-skatehubba-primary/30"
        />

        {/* Brand text with street art style */}
        <text
          x="115"
          y="32"
          fill="currentColor"
          className="text-white font-black"
          style={{
            fontSize: "24px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "2px",
          }}
        >
          SKATE
        </text>
        <text
          x="115"
          y="58"
          fill="currentColor"
          className="text-skatehubba-primary font-black"
          style={{
            fontSize: "24px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "2px",
          }}
        >
          HUBBA
        </text>

        {/* Street art elements - spray paint dots */}
        <circle
          cx="100"
          cy="15"
          r="2"
          fill="currentColor"
          className="text-skatehubba-primary/70"
        />
        <circle
          cx="105"
          cy="12"
          r="1.5"
          fill="currentColor"
          className="text-skatehubba-primary/50"
        />
        <circle
          cx="108"
          cy="17"
          r="1"
          fill="currentColor"
          className="text-skatehubba-primary/60"
        />

        <circle
          cx="280"
          cy="65"
          r="2"
          fill="currentColor"
          className="text-skatehubba-primary/70"
        />
        <circle
          cx="285"
          cy="68"
          r="1.5"
          fill="currentColor"
          className="text-skatehubba-primary/50"
        />
        <circle
          cx="275"
          cy="62"
          r="1"
          fill="currentColor"
          className="text-skatehubba-primary/60"
        />

        {/* Graffiti-style underline */}
        <path
          d="M115 62 Q200 65 280 62"
          stroke="currentColor"
          strokeWidth="3"
          className="text-skatehubba-primary/80"
          fill="none"
        />

        {/* Additional street elements */}
        <polygon
          points="295,20 296,23 299,23 297,25 298,28 295,26 292,28 293,25 291,23 294,23"
          fill="currentColor"
          className="text-skatehubba-primary/60"
        />
      </svg>
    </div>
  );
}
