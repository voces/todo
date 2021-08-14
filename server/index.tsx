import { mediaTypeLookup, renderToString } from "./deps.ts";
import { h } from "../webapp/deps.ts";
import { cache } from "./bundle.ts";
import { App } from "../webapp/App.tsx";

const css = await fetch(new URL("../webapp/style.css", import.meta.url)).then(
  (r) => r.text()
);

const handler = (request: Request) => {
  const pathname = new URL(request.url).pathname;

  if (pathname === "/style.css")
    return new Response(css, { headers: { "Content-Type": "text/css" } });

  if (cache.has(pathname)) {
    return new Response(cache.get(pathname), {
      headers: { "Content-Type": mediaTypeLookup(pathname) ?? "text/plain" },
    });
  }

  return new Response(
    `<!DOCTYPE html>
${renderToString(
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="style.css"></link>
    </head>
    <body>
      <div id="container">
        <App />
      </div>
      <script src="/hydrate.js"></script>
    </body>
  </html>,
  undefined,
  { pretty: true }
)}`,
    { headers: { "Content-Type": "text/html" } }
  );
};

type FetchEvent = {
  request: Request;
  respondWith: (response: Response) => void;
};

const isFetchEvent = (event: Event | FetchEvent): event is FetchEvent => true;

addEventListener("fetch", async (event) => {
  const start = Date.now();
  if (!isFetchEvent(event)) return;
  const response = await handler(event.request);
  console.log(
    event.request.method,
    event.request.url,
    response.status,
    Date.now() - start + "ms"
  );
  event.respondWith(response);
});
