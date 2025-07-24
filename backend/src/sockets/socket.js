import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
  });
};

export const sendToClients = (type, data) => {
  //   console.log("Sending to clients:", type, data);
  if (io) {
    io.emit(type, data);
  }
};
