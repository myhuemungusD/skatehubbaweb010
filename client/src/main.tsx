import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./sentry";
import "./vitals";

createRoot(document.getElementById("root")!).render(<App />);
