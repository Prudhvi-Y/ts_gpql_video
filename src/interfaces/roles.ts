import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Role {
  @Field(() => ID)
  id: number;

  @Field()
  commentsadd: boolean;

  @Field()
  commentsview: boolean;

  @Field()
  commentsedit: boolean;

  @Field()
  commentsdelete: boolean;

  @Field()
  rolesadd: boolean;

  @Field()
  rolesview: boolean;

  @Field()
  rolesedit: boolean;

  @Field()
  rolesdelete: boolean;

  @Field()
  videosadd: boolean;

  @Field()
  videosview: boolean;

  @Field()
  videosedit: boolean;

  @Field()
  videosdelete: boolean;

  @Field()
  usersadd: boolean;

  @Field()
  usersview: boolean;

  @Field()
  usersedit: boolean;

  @Field()
  usersdelete: boolean;

  @Field()
  isadmin: boolean;

  @Field()
  adminsadd: boolean;

  @Field()
  adminsview: boolean;

  @Field()
  adminsedit: boolean;

  @Field()
  adminsdelete: boolean;

  @Field()
  rolename: string;
}
