import { CreateUserDto } from 'src/User/dto/create-user.dto';
import { UpdateUserDto } from 'src/User/dto/update-user.dto';
import { SanitedUser } from 'utils/sanitazeUser';

export abstract class AbstractUserService {
  abstract create(createUserDto: CreateUserDto): Promise<SanitedUser>;
  abstract findByEmail(email: string): Promise<SanitedUser>;
  abstract findById(id: string): Promise<SanitedUser>;
  abstract update(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitedUser>;
  abstract remove(id: string): Promise<void>;
  abstract sendResetPasswordEmail(email: string): Promise<void>;
  abstract resetPassword(token: string, newPassword: string): Promise<void>;
}

export const USER_SERVICE_TOKEN = 'USER_SERVICE_TOKEN';
