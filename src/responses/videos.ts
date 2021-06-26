import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./users";
import { Video } from "../interfaces/videos";

@ObjectType()
export class VideoResponse {
  @Field(() => [Video], { nullable: true })
  videos?: Video[] | null;

  @Field(() => String, { nullable: true })
  token: string | null;

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[] | null;
}
