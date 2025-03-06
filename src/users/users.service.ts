import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { HashingService } from 'src/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(
    field: string,
    value: string | number,
    excludePassword = true,
    excludeEmail = false,
  ) {
    const user = await this.usersRepository.findOneBy({ [field]: value });

    if (excludePassword) delete user.password;
    if (excludeEmail) delete user.email;
    return user;
  }

  async updateOne(
    field: string,
    value: string | number,
    updateUserDto: UpdateUserDto,
  ) {
    const hash = await this.hashingService.getHash(updateUserDto.password);
    const res = {
      username: updateUserDto.username,
      password: hash,
      email: updateUserDto.email,
      about: updateUserDto.about,
      avatar: updateUserDto.avatar,
    };
    await this.usersRepository.update({ [field]: value }, res);
    return this.findOne(field, value, true);
  }

  async findMany(query: string) {
    const users = await this.usersRepository.find({
      where: [
        {
          username: query,
        },
        {
          email: query,
        },
      ],
    });
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  findMyWishes(user: User) {
    return this.wishesRepository.find({
      where: {
        owner: {
          id: user.id,
        },
      },
      relations: [
        'owner',
        'offers',
        'offers.user',
        /* 'offers.user.wishes',
        'offers.user.offers', */
        'offers.user.wishlists',
        'offers.user.wishlists.owner',
        'offers.user.wishlists.items',
      ],
    });
  }
  findWishesByUsername(username: string) {
    return this.wishesRepository.find({
      where: {
        owner: {
          username: username,
        },
      },
      relations: [
        'offers',
        'offers.user',
        /* 'offers.user.wishes',
        'offers.user.offers', */
        'offers.user.wishlists',
        'offers.user.wishlists.owner',
        'offers.user.wishlists.items',
      ],
    });
  }
}
