import { config } from './config/index.js';
import { connectDB } from './database/index.js';
import { createApp } from './app.js';

const app = createApp();

const start = async () => {
  try {
    await connectDB(config.mongodbUri);
    await app.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`Server is running at http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
