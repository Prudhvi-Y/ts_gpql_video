import { Field, ObjectType } from "type-graphql";
import { comments } from "../interfaces/comments";
import { FieldError } from "./users";



@ObjectType()
export class CommentResponse {
  @Field(() => [comments], { nullable: true })
  comments?: comments[] | null;

  @Field(() => String, { nullable: true })
  token: string | null;

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[] | null;
}
