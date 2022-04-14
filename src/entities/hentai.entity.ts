import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Status } from '../common/status.enum';
import { Message } from './message.entity';

export enum HentaiType {
  NHENTAI = 'nhentai',
  EXHENTAI = 'exhentai'
}
@Entity()
export class Hentai extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Message, (message) => message.hentai)
  message: Message;

  @Index()
  @Column()
  messageId: number;

  @Column({ type: 'simple-enum', enum: Status })
  status: Status;

  @Column({ type: 'simple-enum', enum: HentaiType })
  type: HentaiType;

  @Column()
  url: string;
}
