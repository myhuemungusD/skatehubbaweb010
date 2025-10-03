import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkateHubba - Own Your Tricks",
  description: "The ultimate mobile skateboarding platform for remote S.K.A.T.E. games, spot check-ins, and trick collectibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
