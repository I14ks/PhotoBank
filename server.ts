import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn } from "child_process";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const PYTHON_PORT = 8000;

  // Запуск Python бэкенда
  console.log("Starting Python backend...");
  const pythonProcess = spawn("py", [path.join(process.cwd(), "backend", "main.py")], {
    stdio: "inherit"
  });

  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python backend:", err);
  });

  // Проксирование API запросов к Python
  app.use("/api", createProxyMiddleware({
    target: `http://127.0.0.1:${PYTHON_PORT}`,
    changeOrigin: true,
  }));

  app.use(express.json({ limit: '50mb' }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Node.js Proxy Server running on http://localhost:${PORT}`);
    console.log(`Proxying /api to Python backend on port ${PYTHON_PORT}`);
  });
}

startServer();
