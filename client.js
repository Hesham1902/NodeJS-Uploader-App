const net = require("net");
const fs = require("node:fs/promises");

const PORT = 4080;
const HOST = "::1";

const socket = net.createConnection({ port: PORT, host: HOST }, async () => {
  console.log("Connected to server");

  const fileHandle = await fs.open("./text-gigantic.txt", "r");
  const fileReadStream = fileHandle.createReadStream();

  fileReadStream.on("data", (data) => {
    if (!socket.write(data)) {
      fileReadStream.pause();
    }
  });

  socket.on("drain", () => {
    fileReadStream.resume();
  });

  fileReadStream.on("end", () => {
    console.log("The File was successfully uploaded.");
    socket.end();
    fileHandle.close();
  });
});
