import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Video {
  @Field(() => ID)
  id: number;

  @Field()
  commentsadd: Boolean;

  @Field()
  commentsview: Boolean;

  @Field()
  commentsedit: Boolean;

  @Field()
  commentsdelete: Boolean;

  @Field()
  videosadd: Boolean;

  @Field()
  videosview: Boolean;

  @Field()
  videosedit: Boolean;

  @Field()
  videosdelete: Boolean;

  @Field()
  usersadd: Boolean;

  @Field()
  usersview: Boolean;

  @Field()
  usersedit: Boolean;

  @Field()
  usersdelete: Boolean;

  @Field()
  isadmin: Boolean;

  @Field()
  adminsadd: Boolean;

  @Field()
  adminsview: Boolean;

  @Field()
  adminsedit: Boolean;

  @Field()
  adminsdelete: Boolean;

  @Field()
  rolename: string;
}
