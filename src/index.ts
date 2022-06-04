import * as fs from "fs";
import type { BuildIcons } from "@carbon/pictograms";
import buildInfo from "@carbon/pictograms/metadata.json";
import { performance } from "perf_hooks";
import { promisify } from "util";
import { ComponentParser } from "sveld";
import writeTsDefinitions from "sveld/lib/writer/writer-ts-definitions";
import type { ParsedExports } from "sveld/lib/parse-exports";
import { name, devDependencies } from "../package.json";
import { template } from "./template";

const writeFile = promisify(fs.writeFile);
const rmdir = promisify(fs.rm);
const mkdir = promisify(fs.mkdir);

(async () => {
  const start = performance.now();

  if (fs.existsSync("lib")) await rmdir("lib", { recursive: true });
  await mkdir("lib");

  const parser = new ComponentParser();
  const components = new Map();
  const exports: ParsedExports = {};

  let imports = "";

  const pictograms: string[] = [];

  (buildInfo as BuildIcons).icons.forEach(async ({ output }) => {
    const { moduleName } = output[0];

    imports += `export { default as ${moduleName} } from "./${moduleName}.svelte";\n`;
    pictograms.push(moduleName);

    const source = template(output[0]);
    const ts_file_path = `./${moduleName}.svelte.d.ts`;

    components.set(moduleName, {
      moduleName,
      filePath: ts_file_path,
      ...parser.parseSvelteComponent(source, {
        moduleName,
        filePath: ts_file_path,
      }),
    });

    exports[moduleName] = {
      source: `./${moduleName}.svelte`,
      default: false,
    };

    await writeFile(`lib/${moduleName}.svelte`, source);
  });

  const metadata = `${pictograms.length} pictograms from @carbon/pictograms@${devDependencies["@carbon/pictograms"]}`;

  writeTsDefinitions(components, {
    preamble: `// Type definitions for ${name}\n// ${metadata}\n\n`,
    exports,
    inputDir: "lib",
    outDir: "lib",
  });

  await writeFile("lib/index.js", imports);
  await writeFile(
    "PICTOGRAM_INDEX.md",
    `
# Pictogram Index

> ${metadata}

## Usage

\`\`\`svelte
<script>
  import Pictogram from "carbon-pictograms-svelte/lib/Pictogram.svelte";
</script>

<Pictogram />
\`\`\`

## List of Pictograms by \`ModuleName\`

${pictograms.map((moduleName) => `- ${moduleName}`).join("\n")}
    `.trim() + "\n"
  );

  const bench = (performance.now() - start) / 1000;
  console.log(`Built ${pictograms.length} pictograms in ${bench.toFixed(2)}s.`);
})();
