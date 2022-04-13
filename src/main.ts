import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
dotenv.config();
import { Bot } from './bot';
import { BOT_TOKEN } from './config/constants';
import database from './config/database';

createConnection(database).then(async () => {
  const bot = new Bot(BOT_TOKEN);
  bot.launch();
});
