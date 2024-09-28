import dotenv from "dotenv";
import { server } from "./src/service/message.service.js";
import { dbConnect } from "./src/db/index.js";
import { subscribeChannel } from "./src/redis/redisSubscriber.js";
import { initKafkaProducer } from "./src/kafka/kafkaProducer.js";
import { initKafkaConsumer } from "./src/kafka/kafkaConsumer.js";

dotenv.config();

const port = process.env.PORT || 8000;

// dbConnect()
//   .then(() => {
//     server.on("Error", (error) => {
//         console.log("Server is not connected ", error);
//         throw error;
//       });
//       subscribeChannel()

//     server.listen(port, () => {
//       console.log(`Server is listening at ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.log(`Mongodb connection failed ${error}`);
//     process.exit(1);
//   });

const startServer = async () => {
  try {
    await dbConnect();
    await subscribeChannel();
    await initKafkaProducer();
    await initKafkaConsumer();
    server.listen(port, () => {
      console.log(`Server is listening at ${port}`);
    });
  } catch (error) {
    console.error("Getting error while starting server, ", error);
    process.exit(1);
  }
};

startServer();
