interface BackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Background({ 
  className = "",
  children
}: BackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Single Professional Background */}
      <div className="absolute inset-0">
        <img
          src="/attached_assets/hubbagraffwall.png"
          alt="SkateHubba - Urban skateboarding environment with graffiti wall"
          className="w-full h-full object-cover object-center"
          style={{
            filter: 'brightness(0.4) contrast(1.2)',
          }}
        />
      </div>

      {/* Professional overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>

      {/* Content */}
      <div className="relative z-30">
        {children}
      </div>
    </div>
  );
}