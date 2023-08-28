import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// DB
const client = new Client({
  user: "user",
  password: "pass",
  database: "m4c-db",
  hostname: "m4c-database",
  port: 5432,
});
await client.connect();
const result = await client.queryObject("SELECT * FROM customer");
await client.end();

// Web Server
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    
    const method = requestEvent.request.method;
    const url = requestEvent.request.url;
    console.log("method is :", method);
    console.log("url is :", url);

    const body = JSON.stringify(result.rows);
    const res = new Response(body, {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    requestEvent.respondWith(res);
  }
}