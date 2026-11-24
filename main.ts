import { mkdirSync, writeFileSync } from "node:fs";

const LINE =
  "Nobody read my three tickets, so I named the billing bug Kevin. Kevin shipped, billed 9,000 customers $84 for one sock, and my next task is the help article.";

const outDir = process.env.OUTPUT_DIR ?? "/output";
const text = LINE;

// Gate: sealed scorer requires UTF-8 text of 1 to 200 characters,
// not only white space, single line.
if (text.length < 1 || text.length > 200) {
  throw new Error(`entry length ${text.length} outside 1-200`);
}
if (text.trim().length === 0) {
  throw new Error("entry is only white space");
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry must be a single line");
}
// Judge-brief guard: the joke must stay on one specific angle — the
// ignored warning (tickets) and the punch landing on the final words
// ("help article"). A line that lost either half would lose its turn.
if (!text.includes("tickets") || !text.includes("Kevin")) {
  throw new Error("entry must keep the ignored-warning setup (tickets + Kevin)");
}
if (!text.endsWith("help article.")) {
  throw new Error("entry must end on its punch (help article)");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, text, "utf8");

// Round-trip check: what was written must read back byte-identical.
import { readFileSync } from "node:fs";
const back = readFileSync(`${outDir}/entry.txt`, "utf8");
if (back !== text) {
  throw new Error("round-trip mismatch: entry.txt differs from the line");
}
console.log(`entry ok: ${text.length} chars, 1 line`);
