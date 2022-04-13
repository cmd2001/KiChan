import axios from 'axios';
import { Context } from 'telegraf';
import { UserService } from '../services/user.service';

export default async function setu(ctx: Context) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  console.log(ctx.update.message.text.split(' '));
  const userService = new UserService();
  const user = await userService.findOrCreateUser(ctx.from as any);
  const response = await axios.get('https://api.lolicon.app/setu/v2').then((res) => res.data);
  if (response.error) {
    ctx.reply(response.error);
  }
  const ret = response.data[0];
  ctx.reply(`Pid: ${ret.pid}\nTitle: ${ret.title}\nAuthor: ${ret.author}\nTags: ${ret.tags.join(',')}\nUrl: ${ret.urls.original}`);
}
