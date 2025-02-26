import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from 'src/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await this.hashingService.getHash(createUserDto.password);
    const user = await this.usersRepository.create({
      username: createUserDto.username,
      password: hash,
      email: createUserDto.email,
      about: createUserDto.about,
      avatar: createUserDto.avatar,
    });
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  removeOne(id: number) {
    return this.usersRepository.delete({ id });
  }
}
