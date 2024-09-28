// import dotenv from 'dotenv'
// dotenv.config()
// import { Kafka } from 'kafkajs'
// import { Message } from '../model/message.model.js'
// import { ObjectId } from 'mongodb'

// const KAFKA_TOPIC = process.env.KAFKA_TOPIC
// const KAFKA_BATCH_SIZE = process.env.KAFKA_BATCH_SIZE
// const KAFKA_FLUSH_INTERVAL = process.env.KAFKA_FLUSH_INTERVAL

// const kafka = new Kafka({
//   clientId: 'my-app',
//   brokers: [process.env.KAFKA_BROKER1],
//   ssl: true,
//   sasl: {
//     mechanism: 'scram-sha-256',
//     username: process.env.KAFKA_USERNAME,
//     password: process.env.KAFKA_PASSWORD,
//   },
// })

// let consumer;
// let messageBuffer = [];
// let flushTimeout;

// const initKafkaConsumer = async () => {
//   try {
//     consumer = kafka.consumer({ groupId: 'message-group' });
//     console.log('Kafka Consumer Connecting..');
//     await consumer.connect();
//     console.log('Kafka Consumer Connected');
//     await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false })
//     console.log('Subscribed to message topic')

//     flushTimeout = setTimeout(flushMessages, KAFKA_FLUSH_INTERVAL)

//     await consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         const { senderId, receiverId, msgId, mgs, timestamp } = JSON.parse(message.value.toString());

//         // console.log('sender: ', senderId)
//         // console.log('receiver: ', receiverId)
//         // console.log('msg: ', mgs)
//         // console.log(new Date(timestamp).toLocaleString())
//         // console.log('Kafka message string: ', message)
//         messageBuffer.push({
//           sender: new ObjectId(senderId),
//           receiver: new ObjectId(receiverId),
//           messageId: msgId,
//           message: mgs,
//           timestamp: new Date(timestamp),
//         });

//         if (messageBuffer.length >= KAFKA_BATCH_SIZE) {
//           clearTimeout(flushTimeout);
//           await flushMessages();
//         }
//       }
//     })
//   } catch (error) {
//     console.log('Error in Kafka Consumer Connection: ', error);
//     throw error
//   }
// };

// const flushMessages = async () => {
//   if (messageBuffer.length === 0) return

//   try {
//     await Message.insertMany(messageBuffer)
//     console.log(`Batch of ${messageBuffer.length} messages saved to MongoDB`)
//   } catch (error) {
//     console.log("Error saving Kafka Batch to MongoDB: ", error)
//   } finally {
//     messageBuffer = [];
//     clearTimeout(flushTimeout);
//     flushTimeout = setTimeout(flushMessages, KAFKA_FLUSH_INTERVAL);
//   }
// }

// export { initKafkaConsumer }

import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import { Message } from "../model/message.model.js";
import { ObjectId } from "mongodb";

const KAFKA_TOPIC = process.env.KAFKA_TOPIC;
const KAFKA_BATCH_SIZE = parseInt(process.env.KAFKA_BATCH_SIZE, 10); // Convert to number
const KAFKA_FLUSH_INTERVAL = parseInt(process.env.KAFKA_FLUSH_INTERVAL, 10); // Convert to number

// console.log(KAFKA_BATCH_SIZE, typeof(KAFKA_FLUSH_INTERVAL))
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

let consumer;
let messageBuffer = [];

// Initialize the Kafka consumer
const initKafkaConsumer = async () => {
  try {
    consumer = kafka.consumer({ groupId: "message-group" });
    console.log("Kafka Consumer Connecting...");
    await consumer.connect();
    console.log("Kafka Consumer Connected");
    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });
    console.log("Subscribed to message topic");

    // Set a regular interval to flush messages every KAFKA_FLUSH_INTERVAL
    // setInterval(flushMessages, KAFKA_FLUSH_INTERVAL);

    // Process each message
    let timer;

    function startTimer() {
      timer = setTimeout(async () => {
        await flushMessages();
        startTimer(); // Restart timer for the next interval
      }, KAFKA_FLUSH_INTERVAL);
    }

    startTimer();

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { senderId, receiverId, msgId, mgs, timestamp } = JSON.parse(
          message.value.toString()
        );

        messageBuffer.push({
          sender: new ObjectId(senderId),
          receiver: new ObjectId(receiverId),
          messageId: msgId,
          message: mgs,
          timestamp: new Date(timestamp),
        });

        // If buffer size reaches the batch size, flush immediately
        if (messageBuffer.length >= KAFKA_BATCH_SIZE) {
          clearTimeout(timer);
          await flushMessages();
          startTimer();
        }
      },
    });
  } catch (error) {
    console.log("Error in Kafka Consumer Connection:", error);
    throw error;
  }
};

// Function to flush buffered messages to MongoDB
const flushMessages = async () => {
  if (messageBuffer.length === 0) return;

  try {
    await Message.insertMany(messageBuffer);
    console.log(`Batch of ${messageBuffer.length} messages saved to MongoDB`);
  } catch (error) {
    console.log("Error saving Kafka Batch to MongoDB:", error);
  } finally {
    // Clear the buffer after the flush
    messageBuffer = [];
  }
};

export { initKafkaConsumer };
