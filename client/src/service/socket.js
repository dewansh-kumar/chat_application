// import { io } from "socket.io-client";

// const socketURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
// // Initialize the Socket.io client
// const socket = io(socketURL);

// // Register a user with the server
// const registerUser = (userName) => {
//   if (userName) {
//     socket.emit("register", userName);
//   }
// };

// // Send a private message to another user
// const sendPrivateMessage = (
//   sender,
//   receiver,
//   messageId,
//   message,
//   timestamp,
//   senderId,
//   receiverId
// ) => {
//   socket.emit("private_message", {
//     sender,
//     receiver,
//     messageId,
//     message,
//     timestamp,
//     senderId,
//     receiverId,
//   });
// };

// // Listen for incoming private messages
// const onPrivateMessage = (callback) => {
//   socket.on("private_message", callback);
// };

// // Stop listening for private messages
// const offPrivateMessage = () => {
//   socket.off("private_message");
// };

// // Notify the server that the user is typing
// const startTyping = (sender, receiver) => {
//   socket.emit("typing", { sender, receiver });
// };

// // Notify the server that the user stopped typing
// const stopTyping = (sender, receiver) => {
//   socket.emit("stop_typing", { sender, receiver });
// };

// // Listen for typing events
// const onTyping = (callback) => {
//   socket.on("typing", callback);
// };

// // Listen for stop typing events
// const onStopTyping = (callback) => {
//   socket.on("stop_typing", callback);
// };

// // Listen for users coming online
// const onUserOnline = (callback) => {
//   socket.on("user_online", callback);
// };

// // Listen for users going offline
// const onUserOffline = (callback) => {
//   socket.on("user_offline", callback);
// };

// // Notify the server that the user is going offline
// const userOffline = (userName) => {
//   socket.emit("user_offline", userName);
// };

// const callUser = (from, to, signal) => {
//   socket.emit("call-user", { from, to, signal });
// };

// const acceptCall = (signal, to) => {
//   socket.emit("accept-call", { signal, to });
// };

// const rejectCall = (to) => {
//   socket.emit("reject-call", { to });
// };

// const endCall = (from, to) => {
//   socket.emit("end-call", { from, to });
// };

// const acceptRequest = (requestedBy, friend) => {
//   socket.emit("accept-request", {
//     requestedBy,
//     friend,
//   });
// };

// const rejectRequest = (requestedBy, requestedTo) => {
//   socket.emit("reject-request", {
//     requestedBy,
//     requestedTo,
//   });
// };

// const sendRequest = (requestedTo, requestedBy) => {
//   socket.emit("send-request", {
//     requestedTo,
//     requestedBy,
//   });
// };

// const onAcceptRequest = (callback) => {
//   socket.on("accept-request", callback);
// };

// const onRejectRequest = (callback) => {
//   socket.on("reject-request", callback);
// };

// const onSendRequest = (callback) => {
//   socket.on("send-request", callback);
// };

// const unSendRequest = (requestedTo, requestedBy) => {
//   socket.emit("unsend-request", { requestedTo, requestedBy });
// };

// const onUnSendRequest = (callback) => {
//   socket.on("unsend-request", callback);
// };

// const unFriendRequest = (from, to) => {
//   socket.emit("unfriend-request", { from, to });
// };

// const onUnFriendRequest = (callback) => {
//   socket.on("unfriend-request", callback);
// };

// const deleteMessage = (from, to, messageId) => {
//   socket.emit("delete-message", { from, to, messageId });
// };

// const onDeleteMessage = (callback) => {
//   socket.on("delete-message", callback);
// };

// export {
//   socket,
//   registerUser,
//   stopTyping,
//   startTyping,
//   onTyping,
//   onStopTyping,
//   onUserOnline,
//   onUserOffline,
//   userOffline,
//   callUser,
//   acceptCall,
//   rejectCall,
//   endCall,
//   acceptRequest,
//   rejectRequest,
//   sendRequest,
//   onAcceptRequest,
//   unSendRequest,
//   onUnSendRequest,
//   onSendRequest,
//   onRejectRequest,
//   unFriendRequest,
//   onUnFriendRequest,
//   sendPrivateMessage,
//   onPrivateMessage,
//   deleteMessage,
//   onDeleteMessage,
//   offPrivateMessage,
// };


import { io } from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
console.log(socketURL);
// Initialize the Socket.io client
const socket = io(socketURL);

const registerUser = (userName) => {
  // socket = initializeSocket(userName);
  if (userName) {
    socket.emit("register", userName);
  }
};

// Send a private message to another user
const sendPrivateMessage = (
  sender,
  receiver,
  messageId,
  message,
  timestamp,
  senderId,
  receiverId
) => {
  socket.emit("private_message", {
    sender,
    receiver,
    messageId,
    message,
    timestamp,
    senderId,
    receiverId,
  });
};

// Listen for incoming private messages
const onPrivateMessage = (callback) => {
  console.log("now listengin on private message")
  socket.on("private_message", callback);
};

// Stop listening for private messages
const offPrivateMessage = () => {
  socket.off("private_message");
};

// Notify the server that the user is typing
const startTyping = (sender, receiver) => {
  socket.emit("typing", { sender, receiver });
};

// Notify the server that the user stopped typing
const stopTyping = (sender, receiver) => {
  socket.emit("stop_typing", { sender, receiver });
};

// Listen for typing events
const onTyping = (callback) => {
  socket.on("typing", callback);
};

// Listen for stop typing events
const onStopTyping = (callback) => {
  socket.on("stop_typing", callback);
};

// Listen for users coming online
const onUserOnline = (callback) => {
  socket.on("user_online", callback);
};

// Listen for users going offline
const onUserOffline = (callback) => {
  socket.on("user_offline", callback);
};

// Notify the server that the user is going offline
const userOffline = (userName) => {
  socket.emit("user_offline", userName);
};

const acceptRequest = (requestedBy, requestedTo) => {
  socket.emit("accept_request", {
    requestedBy,
    requestedTo,
  });
};

const rejectRequest = (requestedBy, requestedTo) => {
  socket.emit("reject_request", {
    requestedBy,
    requestedTo,
  });
};

const sendRequest = (requestedBy, requestedTo) => {
  socket.emit("send_request", {
    requestedTo,
    requestedBy,
  });
};

const onAcceptRequest = (callback) => {
  socket.on("accept_request", callback);
};

const onRejectRequest = (callback) => {
  socket.on("reject_request", callback);
};

const onSendRequest = (callback) => {
  socket.on("send_request", callback);
};

const unSendRequest = (requestedBy, requestedTo) => {
  socket.emit("unSend_request", { requestedTo, requestedBy });
};

const onUnSendRequest = (callback) => {
  socket.on("unSend_request", callback);
};

const unFriendRequest = (requestedBy, requestedTo) => {
  socket.emit("unfriend_request", { requestedBy, requestedTo });
};

const onUnFriendRequest = (callback) => {
  socket.on("unfriend_request", callback);
};

const deleteMessage = (from, to, messageId) => {
  socket.emit("delete_message", { from, to, messageId });
};

const onDeleteMessage = (callback) => {
  socket.on("delete_message", callback);
};

export {
  socket,
  registerUser,
  stopTyping,
  startTyping,
  onTyping,
  onStopTyping,
  onUserOnline,
  onUserOffline,
  userOffline,
  acceptRequest,
  rejectRequest,
  sendRequest,
  onAcceptRequest,
  unSendRequest,
  onUnSendRequest,
  onSendRequest,
  onRejectRequest,
  unFriendRequest,
  onUnFriendRequest,
  sendPrivateMessage,
  onPrivateMessage,
  deleteMessage,
  onDeleteMessage,
  offPrivateMessage,
  // getSocket
};
