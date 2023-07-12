import { CreateScreenshotInput } from './create-screenshot.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateScreenshotInput extends PartialType(CreateScreenshotInput) {
  @Field(() => Int)
  id: number;
}
