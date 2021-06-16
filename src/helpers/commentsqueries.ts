import { Prisma, PrismaClient } from "@prisma/client";
import { PubSubEngine } from "apollo-server-express";
import { comments } from "../interfaces/comments";
import { COMMENT_CHANNEL } from "../resolvers/commentsResolver";
import { CommentResponse } from "../responses/comments";
import { FieldError } from "../responses/users";

export async function addComment(
  content: string,
  userid: number,
  vid: number,
  rid: number,
  email: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  pubsub: PubSubEngine
): Promise<CommentResponse> {
  let resp: CommentResponse = {
    comments: null,
    token: null,
    errors: null,
  };
  let err: FieldError = {
    field: "",
    message: "",
  };
  let comment: comments;

  const validuser = await prisma.validusers.findFirst({
    where: {
      email: email,
    },
  });

  if (validuser) {
    comment = await prisma.comments.create({
      data: {
        content: content,
        author: {
          connect: {
            id: userid,
          },
        },

        video: {
          connect: {
            id: vid,
          },
        },
      },
    });

    if (rid >= 0) {
      const precomment = await prisma.comments.findUnique({
        where: {
          id: rid,
        },
      });

      if (!precomment) {
        err.field = "reply comment";
        err.message = "comment you are replying to is not present";

        resp.errors = [err];
        return resp;
      } else {
        comment = await prisma.comments.update({
          where: {
            id: comment.id,
          },
          data: {
            preComments: {
              connect: {
                id: rid,
              },
            },
          },
        });
      }
    }

    if (comment) {
      resp.comments = [comment];

      pubsub.publish(COMMENT_CHANNEL, comment);

      return resp;
    } else {
      err.field = "comment";
      err.message = "comment cannot be added";

      resp.errors = [err];

      return resp;
    }
  } else {
    err.field = "user";
    err.message = "user is not authorized to see videos";

    resp.errors = [err];
    return resp;
  }
}

export async function getVideoComments(
  vid: number,
  email: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<CommentResponse> {
  let resp: CommentResponse = {
    comments: null,
    token: null,
    errors: null,
  };
  let err: FieldError = {
    field: "",
    message: "",
  };

  const validuser = await prisma.validusers.findFirst({
    where: {
      email: email,
    },
  });

  if (validuser) {
    const video = await prisma.videos.findUnique({
      where: {
        id: vid,
      },

      include: {
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (video) {
      resp.comments = video.comments;

      return resp;
    } else {
      err.field = "video";
      err.message = "video not found";

      resp.errors = [err];

      return resp;
    }
  } else {
    err.field = "user";
    err.message = "user is not authoraized";

    resp.errors = [err];

    return resp;
  }
}

export async function getCommentComments(
  precmntId: number,
  email: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<CommentResponse> {
  let resp: CommentResponse = {
    comments: null,
    token: null,
    errors: null,
  };
  let err: FieldError = {
    field: "",
    message: "",
  };

  const validuser = await prisma.validusers.findFirst({
    where: {
      email: email,
    },
  });

  if (validuser) {
    const comments = await prisma.comments.findUnique({
      where: {
        id: precmntId,
      },

      include: {
        succComments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (comments) {
      resp.comments = comments.succComments;

      return resp;
    } else {
      err.field = "comment";
      err.message = "comment not found";

      resp.errors = [err];

      return resp;
    }
  } else {
    err.field = "user";
    err.message = "user is not authoraized";

    resp.errors = [err];

    return resp;
  }
}
