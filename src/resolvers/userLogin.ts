import { FieldError, UserResponse } from "../responses/users";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../types";
import jwt, { Secret } from "jsonwebtoken";
import * as brcypt from "bcrypt";
import { User } from "../interfaces/users";


@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;

    @Field()
    email: string;
}


@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async userRegistration(
        @Arg('userInputs') userInputs: UsernamePasswordInput,
        @Ctx() {prisma}: MyContext
    ): Promise<UserResponse | null> {

        const fielderr:FieldError = {
            field: "",
            message: "",
        };

        if (userInputs.username == ""){
            fielderr.field = "username";
            fielderr.message = "username not given";
        }

        if (userInputs.email == ""){
            fielderr.field = "email";
            fielderr.message = "email not given";
        }

        if (userInputs.password == ""){
            fielderr.field = "password";
            fielderr.message = "password not given";
        }

        if (fielderr.field == "") {
            console.log(userInputs);
            const user = await prisma.user.create({
                data: {
                    name: userInputs.username,
                    email: userInputs.email,
                    password: await brcypt.hash(userInputs.password, 10),
                },
            });

            if (user) {
                const token = jwt.sign(user, process.env.APP_SECRET as Secret, {expiresIn: '1h'});
                return {
                    users: [user],
                    token: token,
                    errors: [fielderr],
                };
            } else {
                fielderr.field = "database";
                fielderr.message = "user not added to database";
                return {
                    users: null,
                    token: null,
                    errors: [fielderr],
                }
            }

        }

        return {
            users: null,
            token: null,
            errors: [fielderr],
        }
        
    }

    @Mutation(() => UserResponse)
    async userLogin(
        @Arg('userInputs') userInputs: UsernamePasswordInput,
        @Ctx() {prisma}: MyContext
    ): Promise<UserResponse | null> {

        const fielderr:FieldError = {
            field: "",
            message: "",
        };

        let user:User | null = null;

        if (userInputs.username != "") {
            user = await prisma.user.findFirst({
                where: {
                    name: userInputs.username,
                },
            });
        } else {
            fielderr.field = "username";
            fielderr.message = "username not given";
        }

        if (user == null && userInputs.email != "") {
            user = await prisma.user.findFirst({
                where: {
                    email: userInputs.email,
                },
            });
        } else {
            fielderr.field = "email";
            fielderr.message = "email not given";
        }

        if (user != null && userInputs.password != "") {
            const valid = await brcypt.compare(userInputs.password, user.password);
            if (!valid) {
                fielderr.field = "password";
                fielderr.message = "password incorrect";
            } else {
                const token = jwt.sign(user, process.env.APP_SECRET as Secret, {expiresIn: '1h'});

                return {
                    users: [user],
                    token: token,
                    errors: [fielderr],
                };
            }
        } else if (userInputs.password == null) {
            fielderr.field = "password";
            fielderr.message = "password not given";
        } else {
            fielderr.field = "database";
            fielderr.message = "user not found in the database";
        }


        return {
            users: null,
            token: null,
            errors: [fielderr],
        };
    }
}