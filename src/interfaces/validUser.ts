import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class validUser {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;
}
