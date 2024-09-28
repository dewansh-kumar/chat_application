import { app } from "../../app.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "../model/message.model.js";
import { sendRequest } from "../controller/friend.controller.js";
import {
  acceptRequestPublisher,
  deleteMessagePublisher,
  disconnectUserPublisher,
  rejectRequestPublisher,
  sendMessagePublisher,
  sendRequestPublisher,
  stopTypingMessagePublisher,
  typingMessagePublisher,
  unFriendRequestPublisher,
  unSendRequestPublisher,
} from "../redis/redisPublisher.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

// Store connected users with their socket IDs
const users = {};


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user registration
  socket.on("register", (username) => {
    users[username] = socket.id;
    io.emit("user_online", Object.keys(users));
    console.log("User registered:", username);
  });

  // Handle private messages
  socket.on(
    "private_message",
    async ({
      sender,
      receiver,
      messageId,
      message,
      timestamp,
      senderId,
      receiverId,
    }) => {
      // const receiverSocketId = users[receiver];

      // if (receiverSocketId) {
      //   console.log("Send the message")
      //   io.to(receiverSocketId).emit("private_message", {
      //     receiverId,
      //     senderId,
      //     message,
      //     messageId,
      //     timestamp,
      //   });
      // } else {
      //   console.log(`Receiver ${receiver} not online`);
      // }

      // const newMessage = new Message({
      //   sender: senderId,
      //   receiver: receiverId,
      //   messageId,
      //   message,
      //   timestamp,
      // });
      // await newMessage.save();

      const messageObj = {
        receiver,
        messageId,
        message,
        timestamp,
        receiverId,
        senderId,
      };

      // console.log("Sending message aa rha fj")

      await sendMessagePublisher(messageObj);
    }
  );

  // Handle typing status
  socket.on("typing", async ({ sender, receiver }) => {
    // const recipientSocketId = users[recipient];
    // if (recipientSocketId) {
    //   io.to(recipientSocketId).emit("typing", { sender });
    // }

    await typingMessagePublisher({ sender, receiver });
  });

  socket.on("stop_typing", async ({ sender, receiver }) => {
    // const recipientSocketId = users[recipient];
    // if (recipientSocketId) {
    //   io.to(recipientSocketId).emit("stop_typing", { sender });
    // }
    await stopTypingMessagePublisher({ sender, receiver });
  });

  // Handle user going offline
  socket.on("user_offline", async(username) => {
    if (users[username]) {
      delete users[username];
      // io.emit("user_offline", username);
      await disconnectUserPublisher({username})
      console.log("User offline:", username);
    }
  });

  socket.on("send_request", async ({ requestedBy, requestedTo }) => {
    // io.to(users[requestedTo]).emit("send_request", { request });
    // const receiverSocketId = users[requestedTo];

    const infoObj = {
      sender: requestedBy,
      receiver: requestedTo,
    };
    await sendRequestPublisher(infoObj);
    // console.log("send request ", receiverSocketId)
  });

  socket.on("accept_request", async ({ requestedBy, requestedTo }) => {
    // io.to(users[requestedTo]).emit("accept_request", { requestedBy });
    const infoObj = {
      sender: requestedBy,
      receiver: requestedTo,
    };
    await acceptRequestPublisher(infoObj);
  });

  socket.on("reject_request", async ({ requestedBy, requestedTo }) => {
    // io.to(users[requestedBy]).emit("reject_request", { requestedTo });
    const infoObj = {
      sender: requestedBy,
      receiver: requestedTo,
    };

    await rejectRequestPublisher(infoObj);
  });

  socket.on("unSend_request", async ({ requestedTo, requestedBy }) => {
    // io.to(users[requestedTo]).emit("unsend_request", { requestedBy });
    // console.log("unsend request ", requestedBy, requestedTo)
    const infoObj = {
      sender: requestedBy,
      receiver: requestedTo,
    };
    await unSendRequestPublisher(infoObj);
  });

  socket.on("unfriend_request", async ({ requestedBy, requestedTo }) => {
    // io.to(users[to]).emit("unfriend_request", { from });

    const infoObj = {
      sender: requestedBy,
      receiver: requestedTo,
    };

    await unFriendRequestPublisher(infoObj);
  });

  socket.on("delete_message", async ({ from, to, messageId }) => {
    io.to(users[to]).emit("delete_message", { from, messageId });
    const infoObj = {
      sender: from,
      receiver: to,
      messageId,
    };

    await deleteMessagePublisher(infoObj);
  });

  // Handle user disconnection
  socket.on("disconnect", async() => {
    for (const [username, id] of Object.entries(users)) {
      if (id === socket.id) {
        delete users[username];
        // io.emit("user_offline", username);
        await disconnectUserPublisher({username})
        console.log("User disconnected:", username);
        break;
      }
    }
  });
});

export { server, io, users };
