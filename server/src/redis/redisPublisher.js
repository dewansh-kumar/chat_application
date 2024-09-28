import { redisPub } from "./redisConfig.js";

export const sendMessagePublisher = async (messageObj) => {
  const channel = `send_message`;
  await redisPub.publish(channel, JSON.stringify(messageObj));
};

export const typingMessagePublisher = async (typingObj) => {
  const channel = "typing_message";
  await redisPub.publish(channel, JSON.stringify(typingObj));
};

export const stopTypingMessagePublisher = async (infoObj) => {
  const channel = "stop_typing_message";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};

export const sendRequestPublisher = async (infoObj) => {
  const channel = "send_request";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};

export const acceptRequestPublisher = async (infoObj) => {
  const channel = "accept_request";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};

export const rejectRequestPublisher = async (infoObj) => {
  const channel = "reject_request";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};

export const unSendRequestPublisher = async (infoObj) => {
  const channel = "unSend_request";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};

export const unFriendRequestPublisher = async (infoObj) => {
  const channel = "unfriend_request";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};

export const deleteMessagePublisher = async (infoObj) => {
  const channel = "delete_message";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};

export const disconnectUserPublisher = async (infoObj) => {
  const channel = "disconnect";
  await redisPub.publish(channel, JSON.stringify(infoObj));
};
