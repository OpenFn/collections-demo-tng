import { readdir } from "node:fs/promises";
import config from "./workflow/config.json" assert { type: "json" };

const WEB_ROOT = "web/chakoteya.net/NextGen/";
const EOL = "_EOL_";

const ignore = ["episodes"];

const eps = await readdir(WEB_ROOT);

// TODO can we log something about size in mb and word count for each upload?
let count = 0;

// Load every episode on disk
for (const ep of eps.sort()) {
  if (ep.endsWith(".html")) {
    const [num] = ep.split(".");
    if (!ignore.includes(num)) {
      console.log("Parsing episode ", num);
      const result = await parseEpisode(+num);

      console.log("Uploading to OpenFn...");
      fetch(config._webhook, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(result),
      });
      count++;
      console.log("Done!");
      console.log();
    }
  }
}

console.log(`Triggered ${count} work orders on OpenFn`);

async function parseEpisode(ep: number) {
  const path = `${WEB_ROOT}${ep}.html`;
  console.log("Reading episode at ", path);
  const file = Bun.file(path);
  let html = await file.text();

  // There's a convenient <br> element at the end of each character's "line"
  // So use this to detect the end of lines with a special character

  html = html.replace(/\<br\>/g, EOL);

  // We'll save the lines of the episode here
  const lines: string[] = [];

  let title = "";

  // The HTMLRewriter will chunk up text
  // So we need to parse multiple chunks until we get to the end
  // Then we can go on and process the full chunk
  let chunk = "";

  // This function will take a chunk of script text
  // and break it up into dialog lines
  // With one line per, uh, line
  const processText = (text: string) => {
    const newLines = text.replace(/(\n|\r)/g, " ").split(EOL);
    lines.push(...newLines);
  };

  // Now parse the episode's HTML and pull out the data we need
  const rewriter = new HTMLRewriter()
    .on("title", {
      text(el) {
        if (el.text) {
          const [tng, ...rest] = el.text.split("-");
          title = rest.join(" ");
        }
      },
    })
    .on("table td p", {
      text(el) {
        chunk += el.text;

        if (el.lastInTextNode) {
          processText(chunk);
          chunk = "";
        }
      },
    });

  rewriter.transform(new Response(html));

  console.log(`Extracted ${lines.length} lines from ep ${ep} - ${title}`);

  return { title, text: lines.join("\n"), episode: ep };
}
