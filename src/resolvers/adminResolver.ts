import {
  AdminResponse,
  FieldError,
  ValidUserResponse,
} from "../responses/users";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";
import jwt, { Secret } from "jsonwebtoken";
import * as brcypt from "bcrypt";
import { UsernamePasswordInput } from "./userResolver";
import { admin } from "../interfaces/admin";
import { VideoResponse } from "../responses/videos";
import { getAdmin } from "../helpers/jwtUtil";
import { addVideos, getallVideos, getVideo, removeVideos, updateVideos } from "../helpers/videoqueries";
import { addValidUser, removeValidUser, viewValidUser } from "../helpers/userqueries";
import { deleteComments, updateComments } from "../helpers/commentsqueries";
import { User } from "../interfaces/users";
import { CommentResponse } from "../responses/comments";

@Resolver()
export class AdminResolver {
  @Mutation(() => AdminResponse)
  async adminRegistration(
    @Arg("userInputs") userInputs: UsernamePasswordInput,
    @Arg("role") role: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<AdminResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };

    const admin = getAdmin(req);

    if (admin && admin.role == process.env.SUPERADMIN_ROLE as string) {

      if (userInputs.username == "") {
        fielderr.field = "username";
        fielderr.message = "username not given";
      }

      if (userInputs.email == "") {
        fielderr.field = "email";
        fielderr.message = "email not given";
      }

      if (userInputs.password == "") {
        fielderr.field = "password";
        fielderr.message = "password not given";
      }

      if (fielderr.field == "") {
        console.log(userInputs);
        const user = await prisma.admin.create({
          data: {
            name: userInputs.username,
            email: userInputs.email,
            password: await brcypt.hash(userInputs.password, 10),
            role: role,
          },
        });

        if (user) {
          const token = jwt.sign(user, process.env.APP_SECRET as Secret, {
            expiresIn: "1h",
          });
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
          };
        }
      }

      return {
        users: null,
        token: null,
        errors: [fielderr],
      };
    }
    fielderr.field = "super admin";
    fielderr.message = "only super admin can add new admins";

    return {
      users: null,
      token: null,
      errors: [fielderr],
    };
  }

  @Mutation(() => AdminResponse)
  async adminLogin(
    @Arg("userInputs") userInputs: UsernamePasswordInput,
    @Ctx() { prisma }: MyContext
  ): Promise<AdminResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };

    let user: admin | null = null;

    if (userInputs.username != "") {
      user = await prisma.admin.findFirst({
        where: {
          name: userInputs.username,
        },
      });
    } else {
      fielderr.field = "username";
      fielderr.message = "username not given";
    }

    if (user == null && userInputs.email != "") {
      user = await prisma.admin.findFirst({
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
        const token = jwt.sign(user, process.env.APP_SECRET as Secret, {
          expiresIn: "1h",
        });

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

  @Mutation(() => VideoResponse)
  async adminAddVideos(
    @Arg("content") content: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<VideoResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };
    let resp: VideoResponse = {
      videos: null,
      token: null,
      errors: null,
    };

    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.videosadd) {
        const videos = await addVideos(content, admin.id, prisma);

        if (videos) {
          return videos;
        } else {
          fielderr.field = "videos";
          fielderr.message = "not able to add videos";

          resp.errors = [fielderr];

          return resp;
        }
      }

      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to add videos";

      resp.errors = [fielderr];

      return resp;
    } else {
      fielderr.field = "admin";
      fielderr.message = "token invalid login again";

      resp.errors = [fielderr];

      return resp;
    }
  }

  @Mutation(() => VideoResponse)
  async adminRemoveVideos(
    @Arg("vid") vid: number,
    @Ctx() { req, prisma }: MyContext
  ): Promise<VideoResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };
    let resp: VideoResponse = {
      videos: null,
      token: null,
      errors: null,
    };

    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.videosdelete) {
        const videos = await removeVideos(vid, admin.id, prisma);

        if (videos) {
          return videos;
        } else {
          fielderr.field = "videos";
          fielderr.message = "not able to add videos";

          resp.errors = [fielderr];

          return resp;
        }
      } 
      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to delete videos";

      resp.errors = [fielderr];

      return resp;
    } else {
        fielderr.field = "admin";
        fielderr.message = "token invalid login again";

        resp.errors = [fielderr];

        return resp;
    }
  }

  @Mutation(() => VideoResponse)
  async adminUpdateVideos(
    @Arg("vid") vid: number,
    @Arg("content") content: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<VideoResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };
    let resp: VideoResponse = {
      videos: null,
      token: null,
      errors: null,
    };

    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.videosedit) {
        const videos = await updateVideos(vid, admin.id, content, prisma);

        if (videos) {
          return videos;
        } else {
          fielderr.field = "videos";
          fielderr.message = "not able to add videos";

          resp.errors = [fielderr];

          return resp;
        }
      } 
      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to update videos";

      resp.errors = [fielderr];

      return resp;
    } else {
        fielderr.field = "admin";
        fielderr.message = "token invalid login again";

        resp.errors = [fielderr];

        return resp;
    }
  }

  @Mutation(() => VideoResponse)
  async adminViewVideos(
    @Arg("vid") vid: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<VideoResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };
    let resp: VideoResponse = {
      videos: null,
      token: null,
      errors: null,
    };

    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.videosview) {

        if (vid == "") {
          resp = await getallVideos(admin.email, prisma);
        } else {
          resp = await getVideo(admin.email, prisma, vid);
        }

        return resp
      } 
      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to update videos";

      resp.errors = [fielderr];

      return resp;
    } else {
        fielderr.field = "admin";
        fielderr.message = "token invalid login again";

        resp.errors = [fielderr];

        return resp;
    }
  }

  @Mutation(() => CommentResponse)
  async adminUpdateComments(
    @Arg("name") name: string,
    @Arg("commentid") commentid: string,
    @Arg("content") content: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<CommentResponse | null> {
    let resp: CommentResponse = {
      comments: null,
      token: null,
      errors: null,
    };

    let err: FieldError = {
      field: "",
      message: "",
    };
    
    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.commentsedit) {
        const user = await prisma.user.findUnique({
          where: {
            name: name,
          },
        });
        const cmnts = await updateComments(user as User, parseInt(commentid), content, prisma);
        if (cmnts) {
          resp.comments = cmnts;
        } else {
          err.field = "comment";
          err.message = "not able to update comment";

          resp.errors = [err];
        }
      }
      err.field = "admin role";
      err.message = "admin doesn't have permissions to delete valid users";

      resp.errors = [err]
      return resp;
    } else {
      err.field = "admin";
      err.message = "token invalid login again";

      resp.errors = [err]
      return resp;
    }
  }

  @Mutation(() => FieldError)
  async adminRemoveComments(
    @Arg("name") name: string,
    @Arg("commentid") commentid: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<FieldError | null> {
    let fielderr: FieldError = {
      field: "",
      message: "",
    };
    
    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.commentsdelete) {
        if (commentid == ""){
          await prisma.comments.deleteMany({
            where: {
              authorName: name
            }
          });

          return fielderr;
        }

        const user = await prisma.user.findFirst({
          where: {
            name: name,
          },
        });

        const errs = await deleteComments(user as User, parseInt(commentid), prisma);
        if (errs) {
          fielderr = errs;
        }

        return fielderr;
      }
      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to delete valid users";

      return fielderr;
    } else {
      fielderr.field = "admin";
      fielderr.message = "token invalid login again";

      return fielderr;
    }
  }

  @Mutation(() => ValidUserResponse)
  async adminAddValidUser(
    @Arg("email") email: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<ValidUserResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };
    let resp: ValidUserResponse = {
      users: null,
      errors: null,
    };

    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.usersadd) {
        const validuser = await addValidUser(email, prisma);

        if (validuser) {
          resp.users = [validuser];
          return resp;
        } else {
          
          return resp;
        }
      }

      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to add valid users";

      resp.errors = [fielderr];

      return resp;

    } else {
      fielderr.field = "admin";
      fielderr.message = "token invalid login again";

      resp.errors = [fielderr];

      return resp;
    }
  }

  @Mutation(() => ValidUserResponse)
  async adminRemoveValidUser(
    @Arg("email") email: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<ValidUserResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };
    let resp: ValidUserResponse = {
      users: null,
      errors: null,
    };

    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.usersdelete) {
        const validuser = await removeValidUser(email, prisma);

        if (validuser) {
          resp.users = [validuser];
          return resp;
        } else {
          return resp;
        }
      }
      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to delete valid users";

      resp.errors = [fielderr];

      return resp;
    } else {
      fielderr.field = "admin";
      fielderr.message = "token invalid login again";

      resp.errors = [fielderr];

      return resp;
    }
  }

  @Query(() => ValidUserResponse)
  async adminViewValidUser(
    @Arg("email") email: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<ValidUserResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };
    let resp: ValidUserResponse = {
      users: null,
      errors: null,
    };

    const admin = getAdmin(req);

    if (admin) {
      const rolename = admin.role;

      const role = await prisma.roles.findUnique({
        where: {
          rolename: rolename,
        },
      });

      if (role?.usersview) {
        const validuser = await viewValidUser(email, prisma);

        if (validuser) {
          resp.users = validuser;
          return resp;
        } else {
          return resp;
        }
      }
      fielderr.field = "admin role";
      fielderr.message = "admin doesn't have permissions to view valid users";

      resp.errors = [fielderr];

      return resp;
    } else {
      fielderr.field = "admin";
      fielderr.message = "token invalid login again";

      resp.errors = [fielderr];

      return resp;
    }
  }
}
