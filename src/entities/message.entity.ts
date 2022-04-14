import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Hentai } from './hentai.entity';
import { Setu } from './setu.entity';
import { User } from './user.entity';

export enum MessageType {
  COMMAND = 'command',
  ACTION = 'action',
  TEXT = 'text'
}

export enum OperationType {
  BUILT_IN = 'built_in',
  SETU = 'setu',
  HENTAI = 'hentai'
}

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.chats, { onDelete: 'CASCADE' })
  user: User;

  @Index()
  @Column()
  userId: number;

  @Column()
  messageId: number;

  @Column({ type: 'simple-enum', enum: MessageType })
  messageType: MessageType;

  @Column()
  text: string;

  @Column()
  date: Date;

  @Column({ type: 'simple-enum', enum: OperationType })
  operationType: OperationType;

  @OneToOne(() => Setu, (setu) => setu.message, { nullable: true })
  setu: Setu;

  @OneToOne(() => Hentai, (hentai) => hentai.message, { nullable: true })
  hentai: Hentai;
}
