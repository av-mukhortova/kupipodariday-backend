import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  findOne(@Req() req) {
    return this.usersService.findOne('id', +req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOne('username', username, true, true);
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne('id', +req.user.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  findMyWishes(@Req() req) {
    return this.usersService.findMyWishes(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('/:username/wishes')
  findWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishesByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  findMany(@Body() searchParams: { query: string }) {
    return this.usersService.findMany(searchParams.query);
  }
}
