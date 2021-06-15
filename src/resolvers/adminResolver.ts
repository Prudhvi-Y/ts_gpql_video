import {
  AdminResponse,
  FieldError,
  ValidUserResponse,
} from "../responses/users";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../types";
import jwt, { Secret } from "jsonwebtoken";
import * as brcypt from "bcrypt";
import { UsernamePasswordInput } from "./userResolver";
import { admin } from "../interfaces/admin";
import { VideoResponse } from "../responses/videos";
import { getUser } from "../helpers/jwtUtil";
import { addVideos, removeVideos } from "../helpers/videoqueries";
import { addValidUser, removeValidUser } from "../helpers/userqueries";

@Resolver()
export class AdminResolver {
  @Mutation(() => AdminResponse)
  async adminRegistration(
    @Arg("userInputs") userInputs: UsernamePasswordInput,
    @Ctx() { prisma }: MyContext
  ): Promise<AdminResponse | null> {
    const fielderr: FieldError = {
      field: "",
      message: "",
    };

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
          admin: true,
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

    const admin = getUser(req);

    if (admin) {
      const videos = await addVideos(content, admin.id, prisma);

      if (videos) {
        return videos;
      } else {
        fielderr.field = "videos";
        fielderr.message = "not able to add videos";

        resp.errors = [fielderr];

        return resp;
      }
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

    const admin = getUser(req);

    if (admin) {
      const videos = await removeVideos(vid, admin.id, prisma);

      if (videos) {
        return videos;
      } else {
        fielderr.field = "videos";
        fielderr.message = "not able to add videos";

        resp.errors = [fielderr];

        return resp;
      }
    } else {
      fielderr.field = "admin";
      fielderr.message = "token invalid login again";

      resp.errors = [fielderr];

      return resp;
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

    const admin = getUser(req);

    if (admin) {
      const validuser = await addValidUser(email, prisma);

      if (validuser) {
        resp.users = [validuser];
        return resp;
      } else {
        
        return resp;
      }
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

    const admin = getUser(req);

    if (admin) {
      const validuser = await removeValidUser(email, prisma);

      if (validuser) {
        resp.users = [validuser];
        return resp;
      } else {
        return resp;
      }
    } else {
      fielderr.field = "admin";
      fielderr.message = "token invalid login again";

      resp.errors = [fielderr];

      return resp;
    }
  }
}
