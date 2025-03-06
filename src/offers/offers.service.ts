import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesRepository.findOneBy({
      id: +createOfferDto.itemId,
    });
    if (wish) {
      const offer = this.offersRepository.create({
        ...createOfferDto,
        ...{ user: user, wish: wish },
      });
      const res = await this.offersRepository.save(offer);
      if (res) {
        const raised = +wish.raised + +createOfferDto.amount;
        await this.wishesRepository.update({ id: wish.id }, { raised });
      }
      return res;
    }
    return null;
  }

  findAll() {
    return this.offersRepository.find({
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.offersRepository.findOneBy({ id });
  }
}
