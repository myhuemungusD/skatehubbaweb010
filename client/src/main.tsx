import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./sentry";
import "./vitals";

createRoot(document.getElementById("root")!).render(<App />);
