import { CreateUserDto } from 'src/User/dto/create-user.dto';
import { UserBasicInfoDto } from 'src/User/dto/get-users.dto';
import { UpdateUserDto } from 'src/User/dto/update-user.dto';
import { SanitedUser } from 'utils/sanitazeUser';

export abstract class AbstractUserService {
  abstract create(createUserDto: CreateUserDto): Promise<string>;
  abstract confirmAccount(email: string, code: string): Promise<string>;
  abstract findByEmail(email: string): Promise<SanitedUser>;
  abstract findById(id: string): Promise<SanitedUser>;
  abstract update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitedUser>;
  abstract remove(id: string): Promise<void>;
  abstract sendResetPasswordByEmail(email: string): Promise<void>;
  abstract resetPassword(token: string, newPassword: string): Promise<void>;
  abstract getUsersByIds(userIds: string[]): Promise<UserBasicInfoDto[]>;
  abstract resendVerifingCode(email: string): Promise<void>;
}

export const USER_SERVICE_TOKEN = 'USER_SERVICE_TOKEN';
