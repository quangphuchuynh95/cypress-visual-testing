import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchScreenshot } from '../../branch-screenshot/entities/branch-screenshot.entity';

@ObjectType()
@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @CreateDateColumn()
  @Field(() => GraphQLTimestamp)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLTimestamp)
  updatedAt: Date;

  @OneToMany(
    () => BranchScreenshot,
    (branchScreenshot) => branchScreenshot.branch,
  )
  branchScreenshots: BranchScreenshot[];
}
