import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Message } from './message.entity';
import { Status } from '../common/status.enum';

@Entity()
export class Setu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Message, (message) => message.setu, { onDelete: 'CASCADE' })
  message: Message;

  @Index()
  @Column()
  messageId: number;

  @Column({ type: 'simple-enum', enum: Status })
  status: Status;

  @Column({ nullable: true })
  error: string;

  @Column({ nullable: true })
  pid: number;

  @Column({ nullable: true })
  p: number;

  @Column({ nullable: true })
  uid: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  r18: boolean;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ type: 'simple-json', default: '[]' })
  // fuck sqlite3
  tags: string[];

  @Column({ nullable: true })
  ext: string;

  @Column({ nullable: true })
  updateDate: Date;

  @Column({ type: 'simple-json', default: '{}' })
  // fuck sqlite3 again
  urls: Record<string, any>;
}
