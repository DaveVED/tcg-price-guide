/*import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/app.local.ts"],
  clean: true,
  format: ["cjs"],
  ...options,
}));
*/

import { defineConfig } from "tsup";
import packageJson from "./package.json";

export default defineConfig((options) => ({
  entry: {
    lambda: "src/lambda.ts",
  },
  clean: true,
  format: ["cjs"],
  bundle: true,
  minify: true,
  sourcemap: false,
  target: "node18",
  platform: "node",
  outDir: "dist",
  external: ["aws-sdk"], // Exclude aws-sdk
  noExternal: Object.keys(packageJson.dependencies).filter(
    (dep) => dep !== "aws-sdk", // Exclude any other dependencies if needed
  ),
  esbuildOptions: (options) => {
    options.banner = {
      js: '"use strict";',
    };
  },
  ...options,
}));
