import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScreenshotVersion } from './screenshot-version.entity';
import { BranchScreenshot } from '../../branch-screenshot/entities/branch-screenshot.entity';

@Entity()
@ObjectType()
export class Screenshot {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String)
  name?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  fileKey?: string;

  @CreateDateColumn()
  @Field(() => GraphQLTimestamp)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLTimestamp)
  updatedAt: Date;

  @OneToMany(() => ScreenshotVersion, (version) => version.screenshot)
  versions?: ScreenshotVersion[];

  @OneToMany(
    () => BranchScreenshot,
    (branchScreenshot) => branchScreenshot.screenshot,
  )
  branchScreenshots?: BranchScreenshot[];
}
