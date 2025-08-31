import { Button } from "../components/ui/button";
import Background from "../components/BackgroundCarousel";
import { useEffect } from "react";
import EmailSignup from "../components/EmailSignup";

const SkateHubbaLogo = () => (
  <div className="relative">
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-orange-500"
    >
      <path
        d="M20 45 L80 45 Q85 45 85 50 L85 55 Q85 60 80 60 L20 60 Q15 60 15 55 L15 50 Q15 45 20 45 Z"
        fill="currentColor"
        stroke="#fafafa"
        strokeWidth="2"
      />
      <circle
        cx="25"
        cy="52.5"
        r="8"
        fill="#181818"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="75"
        cy="52.5"
        r="8"
        fill="#181818"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="22" y="48" width="6" height="9" fill="#666" rx="1" />
      <rect x="72" y="48" width="6" height="9" fill="#666" rx="1" />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fontSize="8"
        fill="#fafafa"
        fontWeight="bold"
      >
        SH
      </text>
    </svg>
  </div>
);

export default function Landing() {
  useEffect(() => {
    const donate = document.getElementById("donate");
    if (donate) document.body.appendChild(donate);
  }, []);

  return (
    <div>
      <h1>Landing Page</h1>
      <p>This is a placeholder landing page.</p>
    </div>
  );
}
