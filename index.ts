import * as pty from "node-pty";
import * as http from "node:http";
import { WebSocketServer } from "ws";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established!");

  const shell = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  shell.onData((data) => {
    console.log("Data from shell: ", data);
    ws.send(data);
  });

  ws.on("message", (message) => {
    const msg = message.toString();
    console.log("Message from client: ", msg);
    shell.write(msg);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed!");
    shell.kill();
  });

  ws.on("error", (error) => {
    console.log("WebSocket error", error);
  });
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
