import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AbstractUserRepository,
  USER_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/user.repository';
import { SanitedUser } from 'utils/sanitazeUser';
import { User } from '../User/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly AbstractUserRepository: AbstractUserRepository,
  ) {}

  login(user: UserFromJwt): { accessToken: string } {
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      sub: user.id,
      role: user.role,
      accountVerified: user.accountVerified,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken };
  }

  // async refreshToken(id: string) {
  //   const user: User = await this.AbstractUserRepository.findOne(id);

  //   const payload: UserPayload = {
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //     sub: user.id,
  //     role: user.role,
  //   };

  //   const jwtToken = this.jwtService.sign(payload);

  //   return jwtToken;
  // }

  async validateUser(email: string, password: string): Promise<SanitedUser> {
    const user: User = await this.AbstractUserRepository.findByEmail(email);

    if (user.accountDeactivated === true) {
      throw new ForbiddenException('Account deactivated');
    }

    if (user) {
      //Check if password hash matches its own hash in BD
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (isPasswordValid) {
        return user;
      }
    }
    throw new UnauthorizedException(
      'E-mail or password provided is incorrect.',
    );
  }
}
