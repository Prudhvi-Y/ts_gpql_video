import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { CommentResponse } from "../responses/comments";
import { FieldError } from "../responses/users";
import { MyContext } from "../types";
import { getUser } from "../helpers/jwtUtil";
import {
  addComment,
  deleteComments,
  getCommentComments,
  getVideoComments,
  updateComments,
} from "../helpers/commentsqueries";
import { comments } from "../interfaces/comments";

export const COMMENT_CHANNEL = "COMMENT_CHANNEL";

@InputType()
class commentInput {
  @Field()
  content: string;

  @Field()
  vid: number;

  @Field()
  replyto: number;
}

@Resolver()
export class CommentResolver {
  @Mutation(() => CommentResponse)
  async userAddComment(
    @Arg("commentInput") commentinput: commentInput,
    @Ctx() { req, prisma }: MyContext,
    @PubSub() pubsub: PubSubEngine
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
        commentinput.replyto,
        user.email,
        prisma,
        pubsub
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
  async userDeleteComment(
    @Arg("commentId") commentid: number,
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
      const errs = await deleteComments(user, commentid, prisma);
      if (errs) {
        resp.errors = [errs];
      }
    } else {
      err.field = "user";
      err.message = "invalid user";

      resp.errors = [err];
    }

    return resp;
  }

  @Mutation(() => CommentResponse)
  async userDeleteAllComments(
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
      await prisma.comments.deleteMany({
        where: {
          authorName: user.name,
        },
      });
    } else {
      err.field = "user";
      err.message = "invalid user";

      resp.errors = [err];
    }

    return resp;
  }

  async userUpdateComment(
    @Arg("commentId") commentid: number,
    @Arg("content") content: string,
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
      const comment = await prisma.comments.findFirst({
        where: {
          id: commentid,
        },
      });

      if (comment?.authorName == user.name) {
        const cmnts = await updateComments(user, commentid, content, prisma);
        if (cmnts) {
          resp.comments = cmnts;
        } else {
          err.field = "comment";
          err.message = "not able to update comment"

          resp.errors = [err];
        }
      } else {
        err.field = "comment";
        err.message = "this comment doesn't belong to the current user";

        resp.errors = [err];
      }
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
      const comment = await getVideoComments(vid, user.email, prisma);

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
  async commentComments(
    @Arg("commentId") cid: number,
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
      const comment = await getCommentComments(cid, user.email, prisma);

      resp.comments = comment.comments;
      resp.errors = comment.errors;
    } else {
      err.field = "user";
      err.message = "invalid user";

      resp.errors = [err];
    }

    return resp;
  }

  @Subscription(() => CommentResponse, {
    topics: COMMENT_CHANNEL,
  })
  async getVideoLiveComments(
    @Root() payload: comments,
    @Arg("videoId") vid: number
  ): Promise<CommentResponse | null> {
    let resp: CommentResponse = {
      comments: null,
      token: null,
      errors: null,
    };
    if (payload.videoId == vid) {
      resp.comments = [payload];
      return resp;
    }

    return resp;
  }

  @Subscription(() => CommentResponse, {
    topics: COMMENT_CHANNEL,
  })
  async getCommentLiveComments(
    @Root() payload: comments,
    @Arg("commentID") cid: number
  ): Promise<CommentResponse | null> {
    let resp: CommentResponse = {
      comments: null,
      token: null,
      errors: null,
    };

    if (payload.preCommentId == cid) {
      resp.comments = [payload];
      return resp;
    }

    return resp;
  }
}
