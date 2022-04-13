import { Telegraf } from 'telegraf';
import { UserService } from './services/user.service';
import setu from './modules/setu';

export class Bot {
  private readonly bot: Telegraf;
  private readonly userService = new UserService();
  constructor(botToken: string) {
    this.bot = new Telegraf(botToken);
  }
  async launch(): Promise<void> {
    this.bot.start((ctx) => ctx.reply('Welcome'));
    this.bot.command('setu', setu);
    this.bot.launch();
  }
}
