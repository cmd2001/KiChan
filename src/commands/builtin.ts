import { Context } from 'telegraf';
import { OperationType } from '../common/operationType.enum';
import { BOT_NAME } from '../config/constants';
import getMessageService from '../services/message.service';
import getUserService from '../services/user.service';

export async function start(ctx: Context): Promise<void> {
  ctx.deleteMessage();
  ctx.reply(`欢迎访问${BOT_NAME}: 一个奇怪的Telegram Bot`);
}

export async function clear(ctx: Context) {
  await getMessageService().saveCommandByContext(ctx, OperationType.BUILT_IN);
  const user = await getUserService().findOrCreateUserByContext(ctx);
  ctx.deleteMessage();
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `确认要 ${BOT_NAME} 忘却 ${user.firstName} ${user.lastName} 大人吗？\n<b>所有与您相关联的数据将会被清除。</b>`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '确认',
              callback_data: 'clear_confirm'
            },
            {
              text: '取消',
              callback_data: 'clear_abort'
            }
          ]
        ]
      }
    }
  );
}

export async function clear_confirm(ctx: Context) {
  await getMessageService().saveActionByContext(ctx, OperationType.BUILT_IN);
  const userService = getUserService();
  await userService.cleanUserRelatedData((await userService.findOrCreateUserByContext(ctx)).id);
  ctx.deleteMessage();
  ctx.reply('さよなら');
}

export async function clear_abort(ctx: Context) {
  await getMessageService().saveActionByContext(ctx, OperationType.BUILT_IN);
  const user = await getUserService().findOrCreateUserByContext(ctx);
  ctx.deleteMessage();
  ctx.reply(`谢 ${user.firstName} ${user.lastName} 大人不杀之恩`);
}
