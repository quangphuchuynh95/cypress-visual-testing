import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBranchInput {
  @Field(() => String)
  name: string;
}
