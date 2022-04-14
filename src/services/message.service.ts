import { getManager } from 'typeorm';
import { Message, MessageType, OperationType } from '../entities/message.entity';
import { Context } from 'telegraf';
import getUserService from './user.service';

export class MessageService {
  private readonly messageRepository = getManager().getRepository(Message);
  async saveMessage(params: {
    userId: number;
    date: number;
    messageId: number;
    messageType: MessageType;
    operationType: OperationType;
    text: string;
  }): Promise<Message> {
    const chat = this.messageRepository.create(params);
    return this.messageRepository.save(chat);
  }
  async saveCommandByContext(ctx: Context, operationType: OperationType): Promise<Message> {
    const userService = getUserService();
    const user = await userService.findOrCreateUserByContext(ctx);
    return messageService.saveMessage({
      userId: user.id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      date: ctx.update.message.date,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      messageId: ctx.update.message.message_id,
      messageType: MessageType.COMMAND,
      operationType: operationType,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      text: ctx.update.message.text
    });
  }
  async saveActionByContext(ctx: Context, operationType: OperationType): Promise<Message> {
    const userService = getUserService();
    const user = await userService.findOrCreateUserByContext(ctx);
    return messageService.saveMessage({
      userId: user.id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      date: ctx.update.callback_query.message.date,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      messageId: ctx.update.callback_query.message.message_id,
      messageType: MessageType.ACTION,
      operationType: operationType,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      text: ctx.update.callback_query.data
    });
  }
}

let messageService: MessageService;
export default function getMessageService(): MessageService {
  if (!messageService) {
    messageService = new MessageService();
  }
  return messageService;
}
