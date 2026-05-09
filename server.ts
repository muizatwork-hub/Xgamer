import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // VPN Detection Mock API
  app.get("/api/check-ip", (req, res) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;
    
    // In a real app, you would use an external API like ip-api or maxmind
    // For this demo, we'll simulate some detection
    const isVpn = req.headers["user-agent"]?.includes("Bot") || false; 
    
    res.json({
      ip,
      isVpn,
      country: "United States", // Mock
      trustScore: isVpn ? 15 : 98
    });
  });

  // Mock Data for Dashboard
  app.get("/api/dashboard", (req, res) => {
    res.json({
      balance: 1250,
      xp: 450,
      level: 12,
      streak: 5,
      trustScore: 98,
      isVerified: true
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
