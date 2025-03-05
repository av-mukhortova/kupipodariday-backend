import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
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

  findMany(query: string) {
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

  findMyWishes(user: User) {
    return this.wishesRepository.find({
      where: {
        owner: {
          id: user.id,
        },
      },
      relations: ['owner', 'offers'],
    });
  }
  findWishesByUsername(username: string) {
    return this.wishesRepository.find({
      where: {
        owner: {
          username: username,
        },
      },
      relations: ['owner', 'offers'],
    });
  }
}
