import { globby } from "globby";
import fs from "fs";

(async () => {
  const paths = await globby([
    "**/*",
    "!node_modules/**",
    "!**/fonts/**",
    "!**/public/**",
    "!**/*.{jpg,jpeg,png,gif,webp,svg,ico,mp4}",
  ]);

  const pathsContent = paths.map((path) => `'${path}'`).join(",\n  ");

  fs.writeFileSync("paths.txt", `[\n  ${pathsContent}\n]`, "utf-8");
})();
