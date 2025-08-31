interface BackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Background({
  className = "",
  children,
}: BackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Optimized Responsive Background */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="/hero-1200.webp"
            type="image/webp"
          />
          <source
            media="(min-width: 640px)"
            srcSet="/hero-768.webp"
            type="image/webp"
          />
          <source srcSet="/hero-480.webp" type="image/webp" />
          <img
            src="/attached_assets/hubbagraffwall.png"
            alt="SkateHubba - Urban skateboarding environment with graffiti wall"
            className="w-full h-full object-cover object-center sm:object-top"
            loading="eager"
            decoding="sync"
            fetchpriority="high"
            style={{
              filter: "brightness(1) contrast(1.1)",
              transform: "scale(0.95)",
            }}
          />
        </picture>
      </div>

      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );
}
