import { Field, ID, Int, ObjectType } from "type-graphql";

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

  @Field()
  authorName: string;

  @Field()
  videoId: number;

  @Field(() => Int, { nullable: true })
  preCommentId: number | null;
}
