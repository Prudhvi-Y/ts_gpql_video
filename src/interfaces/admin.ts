import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class admin {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  password: string;

  @Field()
  role: string;
}
