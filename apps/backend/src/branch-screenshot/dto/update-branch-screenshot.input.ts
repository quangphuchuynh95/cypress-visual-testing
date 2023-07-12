import { CreateBranchScreenshotInput } from './create-branch-screenshot.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBranchScreenshotInput extends PartialType(
  CreateBranchScreenshotInput,
) {
  @Field(() => Int)
  id: number;
}
