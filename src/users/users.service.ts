import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findOne(field: string, value: string | number) {
    return this.usersRepository.findOneBy({ [field]: value });
  }

  updateOne(
    field: string,
    value: string | number,
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersRepository.update({ [field]: value }, updateUserDto);
  }

  findAll(query: string) {
    console.log('query' + query);
    return this.usersRepository.find({
      where: [
        {
          username: query,
        },
        {
          email: query,
        },
      ],
    });
  }
}
