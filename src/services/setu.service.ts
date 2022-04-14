import { getManager } from 'typeorm';
import { Status } from '../common/status.enum';
import { Message, OperationType } from '../entities/message.entity';
import { Setu } from '../entities/setu.entity';

export class SetuService {
  private readonly setuRepository = getManager().getRepository(Setu);
  private readonly chatRepository = getManager().getRepository(Message);
  async saveSetu(params: {
    messageId: number;
    status: Status;
    error?: string;
    pid?: number;
    p?: number;
    uid?: number;
    title?: string;
    author?: string;
    r18?: boolean;
    width?: number;
    height?: number;
    tags?: string[];
    ext?: string;
    updateDate?: Date;
    urls?: Record<string, any>;
  }): Promise<Setu> {
    const setu = this.setuRepository.create(params);
    return this.setuRepository.save(setu);
  }
  async findSetuByUserId(userId: number): Promise<Setu[]> {
    return (
      await this.chatRepository.find({
        where: {
          userId,
          operationType: OperationType.SETU
        }
      })
    ).reduce((acc, chat) => {
      if (chat.setu && chat.setu.status === Status.SUCCESS) {
        acc.push(chat.setu);
      }
      return acc;
    }, []);
  }
}

let setuService: SetuService;
export default function getSetuService(): SetuService {
  if (!setuService) {
    setuService = new SetuService();
  }
  return setuService;
}
