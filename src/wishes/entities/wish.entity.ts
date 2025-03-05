import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @CreateDateColumn()
  createdAt: Date;

  // updatedAt
  @UpdateDateColumn()
  updatedAt: Date;

  // name
  @Column({
    nullable: true,
  })
  @Length(1, 250)
  name: string;

  // link
  @Column({
    nullable: true,
  })
  link: string;

  // image
  @Column({
    nullable: true,
  })
  @IsUrl()
  image: string;

  // price
  @Column({
    type: 'numeric',
    nullable: true,
  })
  price: number;

  // raised
  @Column({
    type: 'numeric',
    nullable: true,
  })
  raised: number;

  // owner
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  // description
  @Column({
    nullable: true,
  })
  @Length(1, 1024)
  description: string;

  // copied
  @Column({
    type: 'integer',
    nullable: true,
  })
  copied: number;

  // offers
  @OneToMany(() => Offer, (offer) => offer.wish)
  offers: Offer[];

  // wishlist
  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;
}
