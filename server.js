const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer();

let fileHandle, fileStream;

server.on("connection", (socket) => {
  console.log("A new connection has been established");

  socket.on("data", async (data) => {
    fileHandle = await fs.open("./storage/test.txt", "w");
    fileStream = fileHandle.createWriteStream();

    // Writing to our destination file
    fileStream.write(data);
  });

  socket.on("end", () => {
    console.log("Connection ended !");
    fileHandle.close();
  });
});

server.listen(4080, "::1", () => {
  console.log("Server running at", server.address());
});
