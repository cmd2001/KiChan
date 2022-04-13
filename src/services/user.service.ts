import { Context } from 'telegraf';
import { getManager } from 'typeorm';
import { User } from '../entities/user.entity';

export class UserService {
  private readonly userRepository = getManager().getRepository(User);
  async findOrCreateUser(params: {
    telegramUserId: number;
    isBot: boolean;
    firstName: string;
    lastName: string;
    username: string;
    languageCode: string;
  }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { telegramUserId: params.telegramUserId } });
    if (user) {
      user.firstName = params.firstName;
      user.lastName = params.lastName;
      user.username = params.username;
      user.languageCode = params.languageCode;
      user.isBot = params.isBot;
      return await this.userRepository.save(user);
    }
    return this.userRepository.save(this.userRepository.create(params));
  }
  async findOrCreateUserByContext(ctx: Context): Promise<User> {
    return this.findOrCreateUser({
      telegramUserId: ctx.from.id,
      isBot: ctx.from.is_bot,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      username: ctx.from.username,
      languageCode: ctx.from.language_code
    });
  }
  async cleanUserRelatedData(userId: number): Promise<void> {
    await this.userRepository.delete({ id: userId });
  }
}

let userService: UserService;
export default function getUserService(): UserService {
  if (!userService) {
    userService = new UserService();
  }
  return userService;
}
