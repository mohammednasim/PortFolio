// Temporary verification script: checks the dev server and writes results to http-check.txt
const fs = require("fs");
const urls = ["/", "/assets/nasim.jpg", "/assets/Mohammed-Nasim-Resume.pdf"];
(async () => {
  const lines = [];
  for (const u of urls) {
    try {
      const res = await fetch("http://localhost:5173" + u);
      const buf = Buffer.from(await res.arrayBuffer());
      lines.push(`${u} -> HTTP ${res.status} len=${buf.length} type=${res.headers.get("content-type") || "-"}`);
    } catch (e) {
      lines.push(`${u} -> ERROR ${e.message}`);
    }
  }
  lines.push(`CHECKED_AT: ${new Date().toISOString()}`);
  fs.writeFileSync("http-check.txt", lines.join("\n"));
})();