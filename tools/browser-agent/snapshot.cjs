const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

async function main() {
  const targetUrl =
    process.argv[2] || "http://127.0.0.1:3000";
  const outDir = path.resolve(
    __dirname,
    "..",
    "..",
    ".codex-artifacts",
    "visual-audit"
  );
  fs.mkdirSync(outDir, {
    recursive: true
  });

  const browser =
    await chromium.launch({
      headless: true
    });
  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1200
    }
  });

  await page.goto(targetUrl, {
    waitUntil: "networkidle"
  });

  const safeStamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");
  const filePath = path.join(
    outDir,
    `browser-agent-${safeStamp}.png`
  );

  await page.screenshot({
    path: filePath,
    fullPage: true
  });

  console.log(`Screenshot salva em: ${filePath}`);

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
