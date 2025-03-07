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
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
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

  // image
  @Column({
    nullable: true,
  })
  @IsUrl()
  image: string;

  // user
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  // items
  @OneToMany(() => Wish, (wish) => wish.wishlist)
  items: Wish[];
}
