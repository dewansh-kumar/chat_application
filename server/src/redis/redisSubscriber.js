import { io, users } from "../service/message.service.js";
import { redisSub } from "./redisConfig.js";

const subscribeChannel = async() => {
  redisSub.subscribe(
    "send_message",
    "typing_message",
    "stop_typing_message",
    "send_request",
    "accept_request",
    "reject_request",
    "unSend_request",
    "unfriend_request",
    "delete_message",
    "disconnect",
    (error, count) => {
      if (error) {
        console.error("Failed to subscribe ", error.message);
      } else {
        console.log(
          `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        );
      }
    }
  );
};

redisSub.on("message", (channel, message) => {
  // console.log( `Received ${message} from ${channel}`);

  const infoObj = JSON.parse(message);

  var receiver;

  if ("receiver" in infoObj == true) {
    receiver = infoObj.receiver;
    if (receiver in users === true) {
      delete infoObj.receiver;
    } else {
      return;
    }
  }

  if (channel === "send_message") {
    io.to(users[receiver]).emit("private_message", infoObj);
  } else if (channel === "typing_message") {
    io.to(users[receiver]).emit("typing", infoObj);
  } else if (channel === "stop_typing_message") {
    io.to(users[receiver]).emit("stop_typing", infoObj);
  } else if (channel === "send_request") {
    io.to(users[receiver]).emit("send_request", infoObj);
  } else if (channel === "accept_request") {
    io.to(users[receiver]).emit("accept_request", infoObj);
  } else if (channel === "reject_request") {
    io.to(users[receiver]).emit("reject_request", infoObj);
  } else if (channel === "unSend_request") {
    io.to(users[receiver]).emit("unSend_request", infoObj);
  } else if (channel === "unfriend_request") {
    io.to(users[receiver]).emit("unfriend_request", infoObj);
  } else if (channel === "delete_message") {
    io.to(users[receiver]).emit("delete_message", infoObj);
  } else if (channel === "disconnect") {
    io.emit("user_offline", infoObj);
  }
});

export { subscribeChannel };
