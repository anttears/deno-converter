# MTGJSON Converter
This turns json files from MTGJSON and converts them to a proprietary format. Can't see anyone else wanting to use it.

## Deno
This is using Deno, so there's no npm involved here, which is nice.

## Invoking
create an input folder in the root directory and place your file inside

deno run --unstable --allow-net --allow-read=./input,./output --allow-write=./output converter.ts <filename>

e.g. `deno run --unstable --allow-net --allow-read=./input,./output --allow-write=./output converter.ts ReturnToRavnica`

This will result in the converted file being saved to an output folder in the root.

