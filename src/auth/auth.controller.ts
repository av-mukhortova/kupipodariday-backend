import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalGuard } from '../guards/local.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('1 here');
    const user = await this.authService.create(createUserDto);
    console.log('2 here');
    return this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('/signin')
  signin(@Req() req) {
    return this.authService.auth(req.user);
  }
}
