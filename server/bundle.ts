import { denoPlugin, esbuild } from "./deps.ts";

const cache = new Map<string, string>();
const preloads = new Map<string, string[]>();

let esbuildInitalized: boolean | Promise<void> = false;
const ensureEsbuildInialized = async () => {
  if (esbuildInitalized === false) {
    esbuildInitalized = esbuild.initialize({
      wasmURL: "https://unpkg.com/esbuild-wasm@0.11.19/esbuild.wasm",
      worker: false,
    });
    await esbuildInitalized;
    esbuildInitalized = true;
  } else if (esbuildInitalized instanceof Promise) {
    await esbuildInitalized;
  }
};

await ensureEsbuildInialized();

const bundle = await esbuild.build({
  bundle: true,
  entryPoints: [new URL("../webapp/hydrate.tsx", import.meta.url).href],
  format: "esm",
  metafile: true,
  minify: false,
  outdir: `/`,
  platform: "browser",
  plugins: [denoPlugin()],
  splitting: true,
  target: ["chrome89", "firefox88", "safari13"],
  treeShaking: true,
  write: false,
  jsxFactory: "h",
  jsxFragment: "Fragment",
});

const metafileOutputs = bundle.metafile!.outputs;

for (const path in metafileOutputs) {
  const meta = metafileOutputs[path];
  const imports = meta.imports
    .filter(({ kind }) => kind === "import-statement")
    .map(({ path }) => `/${path}`);
  preloads.set(`/${path}`, imports);
}

for (const file of bundle.outputFiles) {
  cache.set(file.path, new TextDecoder("utf-8").decode(file.contents));
}

export { cache };
