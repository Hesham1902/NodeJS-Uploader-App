const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer();
let fileHandle, fileWriteStream;

server.on("connection", (socket) => {
  console.log("A new connection has been established");

  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause();

      const indexOfDivider = data.indexOf("--");
      const fileName = data.subarray(10, indexOfDivider).toString("utf-8");

      fileHandle = await fs.open(`./storage/${fileName}`, "w");
      fileWriteStream = fileHandle.createWriteStream();

      // Write to our destination file
      fileWriteStream.write(data.subarray(indexOfDivider + 2));

      fileWriteStream.on("error", (err) => {
        console.log(err);
      });
      socket.resume();

      fileWriteStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on("end", () => {
    console.log("Connection ended !");
    fileHandle.close();
    fileHandle = undefined;
    fileWriteStream = undefined;
  });
});

server.listen(4080, "::1", () => {
  console.log("Server running at", server.address());
});
