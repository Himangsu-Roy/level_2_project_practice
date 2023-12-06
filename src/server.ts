import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Connect failure', error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection! Shutting down...');

  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('Uncaught Exception! Shutting down...');

  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});
