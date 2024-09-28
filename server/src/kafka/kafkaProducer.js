import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const KAFKA_TOPIC = process.env.KAFKA_TOPIC;

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER1],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

let producer;

const initKafkaProducer = async () => {
  try {
    producer = kafka.producer();
    console.log("Kafka Producer Connecting..");
    await producer.connect();
    console.log("Kafka Producer Connected");
    // flushTimeout = setTimeout(flushMessages, KAFKA_FLUSH_INTERVAL)
  } catch (error) {
    console.log("Error in Kafka Producer Connection: ", error);
    throw error;
  }
};


const logMessageToKafka = async (
  senderId,
  receiverId,
  messageId,
  message,
  timestamp
) => {
  // console.log("Step 2: sending message from producer");

  const msg = [{
   
    value: JSON.stringify({
      senderId,
      receiverId,
      msgId: messageId,
      mgs: message,
      timestamp: timestamp || Date.now(),
    }),
  }];


  await producer.send({
    topic: KAFKA_TOPIC,
    messages: msg,
  });
};

export { initKafkaProducer, logMessageToKafka };
