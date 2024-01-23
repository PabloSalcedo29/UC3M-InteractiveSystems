const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/', express.static(path.join(__dirname, 'www')));

let visSocket;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("VIS_CONNECTED", () => {
    visSocket = socket;
  });

  socket.on("enviarVideo1", (video) => {
    if (visSocket) visSocket.emit("enviarVideo1", video);
  });

  socket.on("enviarVideo2", (video) => {
    if (visSocket) visSocket.emit("enviarVideo2", video);
  });

  socket.on("enviarVideo3", (video) => {
    if (visSocket) visSocket.emit("enviarVideo3", video);
  });

  socket.on("enviarVideo4", (video) => {
    if (visSocket) visSocket.emit("enviarVideo4", video);
  });
  
  socket.on("play_video", () => {
      if (visSocket) visSocket.emit("play_video");
    });

  socket.on("pausa_video", () => {
      if (visSocket) visSocket.emit("pausa_video");
    });

  socket.on("adelantar_video", () => {
      if (visSocket) visSocket.emit("adelantar_video");
    });

  socket.on("retroceder_video", () => {
      if (visSocket) visSocket.emit("retroceder_video");
    });

    socket.on("adelantar_video_mov", () => {
      if (visSocket) visSocket.emit("adelantar_video_mov");
    });

  socket.on("retroceder_video_mov", () => {
      if (visSocket) visSocket.emit("retroceder_video_mov");
    });
  
  socket.on("subir_volumen", () => {
      if (visSocket) visSocket.emit("subir_volumen");
    });

  socket.on("bajar_volumen", () => {
      if (visSocket) visSocket.emit("bajar_volumen");
    });
  
  socket.on("aviso", () => {
    if (visSocket) visSocket.emit("aviso");
  });

  
  });

server.listen(3000, () => {
  console.log("Server listening...");
});

