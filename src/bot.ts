import { Telegraf } from 'telegraf';
import setu from './commands/setu';
import { clear, clear_abort, clear_confirm, start } from './commands/builtin';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HTTPS_PROXY_URL } from './config/constants';

export class Bot {
  private readonly bot: Telegraf;
  constructor(botToken: string) {
    this.bot = HTTPS_PROXY_URL
      ? new Telegraf(botToken, {
          telegram: {
            agent: new HttpsProxyAgent(HTTPS_PROXY_URL)
          }
        })
      : new Telegraf(botToken);
  }
  async launch(): Promise<void> {
    this.bot.start(start);
    this.bot.command('clear', clear);
    this.bot.action('clear_confirm', clear_confirm);
    this.bot.action('clear_abort', clear_abort);
    this.bot.command('setu', setu);
    this.bot.launch();
  }
}
