import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBranchScreenshotInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
