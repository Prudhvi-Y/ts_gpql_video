import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class comments {
  @Field(() => ID)
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  content: string;

  authorId: number;
}
