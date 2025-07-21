import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { MESSAGES } from './constants/user-controller-messages.message';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @HttpCode(201)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);

    return {
      data: data,
      message: MESSAGES.USER_CREATED,
    };
  }

  @Get('me')
  async getProfile(@CurrentUser('email') email: string) {
    const data = await this.userService.findByEmail(email);

    return {
      data: data,
      message: MESSAGES.USER_RETRIEVED,
    };
  }

  @Patch()
  async update(
    @CurrentUser() user: UserFromJwt,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.userService.update(user.email, updateUserDto);

    return {
      data: data,
      message: MESSAGES.USER_UPDATED,
    };
  }

  @Delete()
  async remove(@CurrentUser() user: UserFromJwt) {
    const data = await this.userService.remove(user.id);

    return {
      data: data,
      message: MESSAGES.USER_DELETED,
    };
  }

  @IsPublic()
  @Post('send-email-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    await this.userService.sendResetPasswordEmail(email);
    return { message: 'Password reset email sent.' };
  }

  @IsPublic()
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.userService.resetPassword(token, newPassword);
    return { message: MESSAGES.PASSWORD_CHANGED };
  }
}

// @Patch('cancel-subscription')
// async cancelSubscription(@CurrentUser() user: RequestUser) {
//   const data = await this.userService.cancelSubscription(user.id);

//   return {
//     data: data,
//     message: MESSAGES.SUBSCRIPTION_CANCELED,
//   };
// }

// @UseGuards(SubscriptionGuard)
// @Patch('refund-subscription')
// async refundSubscription(@CurrentUser() user: RequestUser) {
//   const data = await this.userService.refundSubscription(user.id);

//   return {
//     data: data,
//     message: MESSAGES.SUBSCRIPTION_REFOUND,
//   };
// }

// @Patch('make-subscription')
// async makeSubscription(@CurrentUser() user: RequestUser) {
//   const data = await this.userService.makeSubscription(user.id);

//   return {
//     data: data,
//     message: MESSAGES.SUBSCRIPTION_PURCHASED,
//   };
// }
