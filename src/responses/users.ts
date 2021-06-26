import { User } from "../interfaces/users";
import { Field, ObjectType } from "type-graphql";
import { admin } from "../interfaces/admin";
import { validUser } from "../interfaces/validUser";

@ObjectType()
export class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
export class UserResponse {
    @Field(() => [User], {nullable: true})
    users?: User[] | null;

    @Field(() => String, {nullable: true})
    token: string | null;

    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    
}

@ObjectType()
export class AdminResponse {
    @Field(() => [admin], {nullable: true})
    users?: admin[] | null;

    @Field(() => String, {nullable: true})
    token: string | null;

    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    
}

@ObjectType()
export class ValidUserResponse {
    @Field(() => [validUser], {nullable: true})
    users?: validUser[] | null;

    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    
}