import { roles } from "@prisma/client";
import { ObjectType, Field } from "type-graphql";
import { Role } from "../interfaces/roles";
import { FieldError } from "./users";

@ObjectType()
export class RoleResponse {
    @Field(() => [Role], {nullable: true})
    roles?: roles[] | null;

    @Field(() => String, {nullable: true})
    token: string | null;

    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
}