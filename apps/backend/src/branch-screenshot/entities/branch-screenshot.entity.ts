import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Screenshot } from '../../screenshot/entities/screenshot.entity';
import { Branch } from '../../branch/entities/branch.entity';
import { DiffResult } from '../../image-diff-service/image-diff-service.service';

@ObjectType()
@Entity()
@Unique(['branch', 'screenshot'])
export class BranchScreenshot implements DiffResult {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  fileKey: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  diffFileKey?: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  diffPixels?: number;

  @Column({ default: '' })
  @Field(() => String)
  diffMessage: string;

  @CreateDateColumn()
  @Field(() => GraphQLTimestamp)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLTimestamp)
  updatedAt: Date;

  @ManyToOne(() => Branch, (branch) => branch.branchScreenshots)
  branch?: Branch;

  @ManyToOne(() => Screenshot, (screenshot) => screenshot.branchScreenshots)
  screenshot?: Screenshot;
}
