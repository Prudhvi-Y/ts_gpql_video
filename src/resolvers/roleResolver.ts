import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { getAdmin } from "../helpers/jwtUtil";
import { RoleResponse } from "../responses/roles";
import { FieldError } from "../responses/users";
import { MyContext } from "../types";

@InputType()
export class RoleInputs {
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

@Resolver()
export class RoleResolver {
    @Mutation(() => RoleResponse)
    async roleAdd(
        @Arg("roleInputs") roleinput: RoleInputs,
        @Ctx() {req, prisma}: MyContext
    ): Promise<RoleResponse | null> {
        const fielderr: FieldError = {
            field: "",
            message: "",
        };
        const admin = await getAdmin(req, prisma);

        if (admin) {
            const rolename = admin.role;

            const roleAdmin = await prisma.roles.findUnique({
                where: {
                    rolename: rolename,
                },
            });

            if (roleAdmin?.rolesadd) {
                const role = await prisma.roles.create({
                    data: {
                        adminsadd: roleinput.adminsadd,
                        adminsview: roleinput.adminsview,
                        adminsedit: roleinput.adminsedit,
                        adminsdelete: roleinput.adminsdelete,
                        videosadd: roleinput.videosadd,
                        videosdelete: roleinput.videosdelete,
                        videosedit: roleinput.videosedit,
                        videosview: roleinput.videosview,
                        commentsadd: roleinput.commentsadd,
                        commentsdelete: roleinput.commentsdelete,
                        commentsedit: roleinput.commentsedit,
                        commentsview: roleinput.commentsview,
                        usersadd: roleinput.usersadd,
                        usersdelete: roleinput.usersdelete,
                        usersedit: roleinput.usersedit,
                        usersview: roleinput.usersview,
                        rolesadd: roleinput.rolesadd,
                        rolesdelete: roleinput.rolesdelete,
                        rolesedit: roleinput.rolesedit,
                        rolesview: roleinput.rolesview,
                        isadmin: roleinput.isadmin,
                        rolename: roleinput.rolename,
                    },
                });

                if (role) {
                    return {
                        roles: [role],
                        token: null,
                        errors: [fielderr],
                    };
                } else {
                    fielderr.field = "database";
                    fielderr.message = "not able to create record in database";

                    return {
                        roles: null,
                        token: null,
                        errors: [fielderr],
                    };
                }
            }
        }

        fielderr.field = "admin";
        fielderr.message = "only an admin with right permissions can create a role";
        
        return {
            roles: null,
            token: null,
            errors: [fielderr],
        };
    }

    @Mutation(() => RoleResponse)
    async roleUpdate(
        @Arg("roleInputs") roleinput: RoleInputs,
        @Ctx() {req, prisma}: MyContext
    ): Promise<RoleResponse | null> {
        const fielderr: FieldError = {
            field: "",
            message: "",
        };
        const admin = await getAdmin(req, prisma);

        if (admin) {
            const rolename = admin.role;

            const roleAdmin = await prisma.roles.findUnique({
                where: {
                    rolename: rolename,
                },
            });

            if (roleAdmin?.rolesedit) {
                const role = await prisma.roles.update({
                    where: {
                        rolename: roleinput.rolename,
                    },
                    data: {
                        adminsadd: roleinput.adminsadd,
                        adminsview: roleinput.adminsview,
                        adminsedit: roleinput.adminsedit,
                        adminsdelete: roleinput.adminsdelete,
                        videosadd: roleinput.videosadd,
                        videosdelete: roleinput.videosdelete,
                        videosedit: roleinput.videosedit,
                        videosview: roleinput.videosview,
                        commentsadd: roleinput.commentsadd,
                        commentsdelete: roleinput.commentsdelete,
                        commentsedit: roleinput.commentsedit,
                        commentsview: roleinput.commentsview,
                        usersadd: roleinput.usersadd,
                        usersdelete: roleinput.usersdelete,
                        usersedit: roleinput.usersedit,
                        usersview: roleinput.usersview,
                        rolesadd: roleinput.rolesadd,
                        rolesdelete: roleinput.rolesdelete,
                        rolesedit: roleinput.rolesedit,
                        rolesview: roleinput.rolesview,
                        isadmin: roleinput.isadmin,
                        rolename: roleinput.rolename,
                    },
                });

                if (role) {
                    return {
                        roles: [role],
                        token: null,
                        errors: [fielderr],
                    };
                } else {
                    fielderr.field = "database";
                    fielderr.message = "not able to edit record in database";

                    return {
                        roles: null,
                        token: null,
                        errors: [fielderr],
                    };
                }
            }
        }

        fielderr.field = "admin";
        fielderr.message = "only an admin with right permissions can edit a role";
        
        return {
            roles: null,
            token: null,
            errors: [fielderr],
        };
    }

    @Mutation(() => RoleResponse)
    async roleDelete(
        @Arg("roleInputs") roleinput: RoleInputs,
        @Ctx() {req, prisma}: MyContext
    ): Promise<RoleResponse | null> {
        const fielderr: FieldError = {
            field: "",
            message: "",
        };
        const admin = await getAdmin(req, prisma);

        if (admin) {
            const rolename = admin.role;

            const roleAdmin = await prisma.roles.findUnique({
                where: {
                    rolename: rolename,
                },
            });

            if (roleAdmin?.rolesdelete) {
                const role = await prisma.roles.delete({
                    where: {
                        rolename: roleinput.rolename,
                    },
                });

                if (role) {
                    return {
                        roles: [role],
                        token: null,
                        errors: [fielderr],
                    };
                } else {
                    fielderr.field = "database";
                    fielderr.message = "not able to delete record in database";

                    return {
                        roles: null,
                        token: null,
                        errors: [fielderr],
                    };
                }
            }
        }

        fielderr.field = "admin";
        fielderr.message = "only an admin with right permissions can delete a role";
        
        return {
            roles: null,
            token: null,
            errors: [fielderr],
        };
    }

    @Query(() => RoleResponse)
    async roleView(
        @Arg("roleInputs") roleinput: RoleInputs,
        @Ctx() {req, prisma}: MyContext
    ): Promise<RoleResponse | null> {
        const fielderr: FieldError = {
            field: "",
            message: "",
        };
        const admin = await getAdmin(req, prisma);

        if (admin) {
            const rolename = admin.role;

            const roleAdmin = await prisma.roles.findUnique({
                where: {
                    rolename: rolename,
                },
            });

            if (roleAdmin?.rolesview) {

                if (roleinput.rolename != ""){
                    const role = await prisma.roles.findUnique({
                        where: {
                            rolename: roleinput.rolename,
                        },
                    });

                    if (role) {
                        return {
                            roles: [role],
                            token: null,
                            errors: [fielderr],
                        };
                    }
                }
                const role = await prisma.roles.findMany();

                if (role) {
                    return {
                        roles: role,
                        token: null,
                        errors: [fielderr],
                    };
                } else {
                    fielderr.field = "database";
                    fielderr.message = "not able to delete record in database";

                    return {
                        roles: null,
                        token: null,
                        errors: [fielderr],
                    };
                }
            }
        }

        fielderr.field = "admin";
        fielderr.message = "only an admin with right permissions can delete a role";
        
        return {
            roles: null,
            token: null,
            errors: [fielderr],
        };
    }
}