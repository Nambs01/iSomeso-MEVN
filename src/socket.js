const { Server } = require("socket.io");

const io = new Server({
  cors: "http://localhost:5173/",
});

let onlineUsers = Array();

io.on("connect", (socket) => {
  console.log("New connection", socket.id);

  // listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log(onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  // add Message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.to);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("User deconnected");
  });
});

io.listen(5000);
