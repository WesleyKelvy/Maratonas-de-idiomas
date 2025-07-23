import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AbstractUserRepository } from 'src/repositories/abstract/user.repository';
import { USER_REPOSITORY_TOKEN } from 'src/user/user.service';
import { sanitazeUser, SanitedUser } from 'utils/sanitazeUser';
import { User } from '../user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly AbstractUserRepository: AbstractUserRepository,
  ) {}

  login(user: User): UserToken {
    // transform user into jwt

    const payload: UserPayload = {
      email: user.email,
      name: user.name,
      sub: user.id,
      role: user.role,
    };

    const jwtToken = this.jwtService.sign(payload);
    return {
      accessToken: jwtToken,
    };
  }

  async refreshToken(id: string) {
    const user: User = await this.AbstractUserRepository.findOne(id);

    const payload: UserPayload = {
      email: user.email,
      name: user.name,
      sub: user.id,
      role: user.role,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      refreshToken: jwtToken,
    };
  }

  async validateUser(email: string, password: string): Promise<SanitedUser> {
    const user: User = await this.AbstractUserRepository.findByEmail(email);

    if (user) {
      //Check if password hash matches its own hash in BD
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (isPasswordValid) {
        return sanitazeUser(user);
      }
    }
    throw new UnauthorizedException(
      'E-mail or password provided is incorrect.',
    );
  }
}
