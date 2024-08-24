const net = require("net");
const fs = require("node:fs/promises");

const PORT = 4080;
const HOST = "::1";

const socket = net.createConnection({ port: PORT, host: HOST }, async () => {
  console.log("Connected to server");

  const fileHandle = await fs.open("./text.txt", "r");
  const fileStream = fileHandle.createReadStream();

  fileStream.on("data", (data) => {
    socket.write(data);
  });

  fileStream.on("end", () => {
    console.log("The File was successfully uploaded.");
    socket.end();
    fileHandle.close();
  });
});

socket.on("data", (data) => {});
