import { Prisma, PrismaClient } from "@prisma/client";
import { VideoResponse } from "../responses/videos";
import { Video } from "../interfaces/videos";
import { FieldError } from "src/responses/users";

export async function getallVideos(
  email: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<VideoResponse> {
  let resp: VideoResponse = {
    videos: null,
    token: null,
    errors: null,
  };

  const validuser = await prisma.validusers.findFirst({
    where: {
      email: email,
    },
  });

  if (validuser) {
    const uservideos = await prisma.videos.findMany();

    if (uservideos) {
      resp.videos = uservideos;
    }

    return resp;
  } else {
    let err: FieldError = {
      field: "user validity",
      message: "user is not authorized to see videos",
    };

    resp.errors = [err];

    return resp;
  }
}

export async function getVideo(
  email: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  videoId: string
): Promise<VideoResponse> {
  let resp: VideoResponse = {
    videos: null,
    token: null,
    errors: null,
  };

  const validuser = await prisma.validusers.findFirst({
    where: {
      email: email,
    },
  });

  if (validuser) {
    const vid = parseInt(videoId);
    const uservideo = await prisma.videos.findUnique({
      where: {
        id: vid,
      },
    });

    if (uservideo) {
      resp.videos = [uservideo as Video];
    }

    return resp;
  } else {
    let err: FieldError = {
      field: "user validity",
      message: "user is not authorized to see videos",
    };

    resp.errors = [err];

    return resp;
  }
}

export async function addVideos(
  content: string,
  adminid: number,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<VideoResponse> {
  let resp: VideoResponse = {
    videos: null,
    token: null,
    errors: null,
  };

  const videos = await prisma.admin.update({
      where: {
          id: adminid
      },
      data: {
          videos: {
              create: {
                  content: content
              },
          },
      },

      select: {
          videos: {
              take: -1,
          },
      },
  });

  if(videos){
      resp.videos = videos.videos

      return resp;
  } else {
      let err:FieldError = {
          field: "add video",
          message: "not able to add new video"
      };

      resp.errors = [err];

      return resp;
  }
}
