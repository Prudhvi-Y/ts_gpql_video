import { Prisma, PrismaClient } from "@prisma/client";
import { CommentResponse } from "../responses/comments";
import { FieldError } from "../responses/users";

export async function addComment(
  content: string,
  userid: number,
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
    const comment = await prisma.comments.create({
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

    if (comment) {
      resp.comments = [comment];

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

export async function getComments(
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
        comments: true,
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
