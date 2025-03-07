import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    console.log(createWishlistDto);
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      ...{ owner: user },
    });
    const res = await this.wishlistsRepository.save(wishlist);
    if (res) {
      createWishlistDto.itemsId.forEach((id) => {
        this.wishesRepository.update({ id }, { wishlist: res });
      });
    }
    return res;
  }

  findAll() {
    return this.wishlistsRepository.find();
  }

  findOne(id: number) {
    return this.wishlistsRepository.findOne({
      where: {
        id: id,
      },
      relations: ['owner', 'items'],
    });
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
