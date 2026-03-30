const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || process.cwd());
const port = Number(process.argv[3] || process.env.PORT || 4173);
const host = "127.0.0.1";

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function resolveTarget(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  const absolutePath = path.join(root, relativePath);

  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    return path.join(absolutePath, "index.html");
  }

  return absolutePath;
}

const server = http.createServer((req, res) => {
  const target = resolveTarget(req.url);

  try {
    const data = fs.readFileSync(target);
    const ext = path.extname(target).toLowerCase();

    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
    });
    res.end(data);
  } catch (error) {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.end("404");
  }
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}/`);
  console.log(`Serving ${root}`);
});
