import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateScreenshotInput {
  @Field(() => String)
  name: string;
}
