import axios from 'axios';
import { Context } from 'telegraf';
import getMessageService from '../services/message.service';
import { OperationType } from '../common/operationType.enum';
import getSetuService from '../services/setu.service';
import { Status } from '../common/status.enum';

export default async function setu(ctx: Context) {
  const chatService = getMessageService();
  const message = await chatService.saveCommandByContext(ctx, OperationType.SETU);
  const setuService = getSetuService();
  const params: Record<string, any> = {};
  const avaliableKeys = ['uid', 'pid', 'keyword'];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ctx.update.message.text.split(' ').forEach((word: string) => {
    if (word.includes('=')) {
      const [key, value] = word.split('=');
      if (avaliableKeys.includes(key)) {
        params[key] = value.split(',').map((v: string) => v.trim());
      }
    }
  });
  const response = await axios.post('https://api.lolicon.app/setu/v2', params).then((res) => res.data);
  if (response.error) {
    await setuService.saveSetu({
      messageId: message.id,
      status: Status.ERROR,
      error: response.error
    });
    ctx.reply(`抱歉，处理请求时遇到错误: ${response.error}`);
  }
  const data = response.data[0];
  await setuService.saveSetu(
    Object.assign(
      {
        messageId: message.id,
        status: Status.SUCCESS
      },
      data
    )
  );
  ctx.reply(`Pid: ${data.pid}\nTitle: ${data.title}\nAuthor: ${data.author}\nTags: ${data.tags.join(',')}\nUrl: ${data.urls.original}`);
}
