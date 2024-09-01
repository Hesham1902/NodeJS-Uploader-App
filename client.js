const net = require("net");
const fs = require("node:fs/promises");
const path = require("path");

const PORT = 4080;
const HOST = "::1";

const socket = net.createConnection({ port: PORT, host: HOST }, async () => {
  console.log("Connected to server");

  const filePath = process.argv[2];
  const fileName = path.basename(filePath);

  const fileHandle = await fs.open(filePath, "r");
  const fileReadStream = fileHandle.createReadStream();

  socket.write(`fileName: ${fileName}--`);

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
