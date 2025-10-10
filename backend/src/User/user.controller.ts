import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  AbstractUserService,
  USER_SERVICE_TOKEN,
} from 'src/User/abstract-services/abstract-user.service';
import { GetUsersByIdsDto, UserBasicInfoDto } from 'src/User/dto/get-users.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { MESSAGES } from './constants/user-controller-messages.message';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE_TOKEN)
    private readonly userService: AbstractUserService,
  ) {}

  @IsPublic()
  @HttpCode(201)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);

    return {
      data: data,
      message: MESSAGES.USER_CREATED,
    };
  }
  @IsPublic()
  @HttpCode(200)
  @Post('confirm-account')
  async confirmAccount(@Body() code: string) {
    await this.userService.confirmAccount(code);

    return {
      message: MESSAGES.ACCOUNT_CONFIRMED_SUCCESSFULLY,
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
    @CurrentUser('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.userService.update(id, updateUserDto);

    return {
      data: data,
      message: MESSAGES.USER_UPDATED,
    };
  }

  @Delete()
  async remove(@CurrentUser('id') id: string) {
    const data = await this.userService.remove(id);

    return {
      data: data,
      message: MESSAGES.USER_DELETED,
    };
  }

  @IsPublic()
  @Post('send-email-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    const url = await this.userService.sendResetPasswordByEmail(email);
    return { url, message: 'Password reset email sent.' };
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

  @Post('get-users-by-ids')
  @HttpCode(200)
  async getUsersByIds(
    @Body() getUsersByIdsDto: GetUsersByIdsDto,
  ): Promise<UserBasicInfoDto[]> {
    return await this.userService.getUsersByIds(getUsersByIdsDto.userIds);
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
