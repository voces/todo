import { h, hydrate } from "./deps.ts";
import { App } from "./App.tsx";

hydrate(<App />, document.getElementById("container")!);
