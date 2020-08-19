import { exists, ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { writeJsonSync } from "https://deno.land/std/fs/mod.ts";
import parser from "./parser.ts";
const [filename] = Deno.args;

const path = `./input/${filename}.json`;

const hasFile = await exists(path);
if (!hasFile) {
  console.log(`${path} is not found`);
  Deno.exit(1);
}
const decoder = new TextDecoder("utf-8");
const response = decoder.decode(Deno.readFileSync(path));
const data = JSON.parse(response);
const mtgCardSet = parser(data);

ensureDirSync('./output');
writeJsonSync(
    `./output/${filename}.json`,
    mtgCardSet,
    { spaces: 2},
);

Deno.exit();
