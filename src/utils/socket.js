const { Server } = require("socket.io");
let io;

module.exports = {
  init: httpServer => {
    io = new Server(httpServer, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // 在Socket.IO初始化代碼中，監聽連接事件
    io.on('connection', (socket) => {
      // console.log(`New client connected: ${socket.id}`);

      // 監聽客戶端加入房間的事件
      socket.on('join-room', (room) => {
          // console.log(`Client ${socket.id} joined room ${room}`);
          socket.join(room); // 加入房間
      });
    });

    // console.log('Socket.io has been initialized!');
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  }
};