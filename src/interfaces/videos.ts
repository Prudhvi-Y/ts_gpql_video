import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Video {
  @Field(() => ID)
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  content: string;

  authorId: number;

  viewerId: number;
}
