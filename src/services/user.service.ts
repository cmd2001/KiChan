import { getManager } from 'typeorm';
import { User } from '../entities/user.entity';

export class UserService {
  private readonly userRepository = getManager().getRepository(User);
  async findOrCreateUser(rawUser: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
  }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { telegramUserId: rawUser.id } });
    if (user) {
      return user;
    }
    const newUser = this.userRepository.create({
      telegramUserId: rawUser.id,
      isBot: rawUser.is_bot,
      firstName: rawUser.first_name,
      lastName: rawUser.last_name,
      username: rawUser.username,
      languageCode: rawUser.language_code
    });
    return this.userRepository.save(newUser);
  }
}
