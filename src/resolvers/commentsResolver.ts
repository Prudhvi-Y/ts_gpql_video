import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { CommentResponse } from "../responses/comments";
import { FieldError } from "../responses/users";
import { MyContext } from "../types";
import { getUser } from "../helpers/jwtUtil";
import { addComment, getComments } from "../helpers/commentsqueries";

@InputType()
class commentInput {
  @Field()
  content: string;

  @Field()
  vid: number;
}

@Resolver()
export class CommentResolver {
  @Mutation(() => CommentResponse)
  async userAddComment(
    @Arg("commentInput") commentinput: commentInput,
    @Ctx() { req, prisma }: MyContext
  ): Promise<CommentResponse | null> {
    const user = getUser(req);
    let resp: CommentResponse = {
      comments: null,
      token: null,
      errors: null,
    };

    let err: FieldError = {
      field: "",
      message: "",
    };

    if (user) {
      const comment = await addComment(
        commentinput.content,
        user.id,
        commentinput.vid,
        user.email,
        prisma
      );

      resp.comments = comment.comments;
      resp.errors = comment.errors;
    } else {
      err.field = "user";
      err.message = "invalid user";

      resp.errors = [err];
    }

    return resp;
  }

  @Mutation(() => CommentResponse)
  async videoComments(
    @Arg("videoid") vid: number,
    @Ctx() { req, prisma }: MyContext
  ): Promise<CommentResponse | null> {
    const user = getUser(req);
    let resp: CommentResponse = {
      comments: null,
      token: null,
      errors: null,
    };

    let err: FieldError = {
      field: "",
      message: "",
    };

    if (user) {
      const comment = await getComments(
        vid,
        user.email,
        prisma
      );

      resp.comments = comment.comments;
      resp.errors = comment.errors;
    } else {
      err.field = "user";
      err.message = "invalid user";

      resp.errors = [err];
    }

    return resp;
  }
}
