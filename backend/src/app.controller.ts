import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  getHello(): string {
    return this.appService.getHello();
  }
}
