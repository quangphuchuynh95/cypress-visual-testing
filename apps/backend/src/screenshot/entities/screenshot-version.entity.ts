import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Screenshot } from './screenshot.entity';

@ObjectType()
@Entity()
export class ScreenshotVersion {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  message: string;

  @Column()
  @Field(() => String)
  fileKey: string;

  @CreateDateColumn()
  @Field(() => GraphQLTimestamp)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLTimestamp)
  updatedAt: Date;

  @ManyToOne(() => Screenshot, (screenshot) => screenshot.versions)
  screenshot?: Screenshot;
}
