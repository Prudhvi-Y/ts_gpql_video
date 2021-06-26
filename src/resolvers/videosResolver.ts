import { VideoResponse } from "../responses/videos";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { getUser } from "../helpers/jwtUtil";
import { FieldError } from "../responses/users";
import { MyContext } from "../types";
import { getallVideos, getVideo } from "../helpers/videoqueries";

@InputType()
class viewVideoInput {
  @Field()
  videoId: string;
}

@Resolver()
export class VideoResolver {
  @Mutation(() => VideoResponse)
  async videoWatch(
    @Arg("viewVideoInput") videoInputs: viewVideoInput,
    @Ctx() { req, prisma }: MyContext
  ): Promise<VideoResponse | null> {
    const user = getUser(req);
    let resp: VideoResponse = {
      videos: null,
      token: null,
      errors: null,
    };
    let err: FieldError = {
      field: "",
      message: "",
    };

    if (user) {
      if (videoInputs.videoId == "") {
        resp = await getallVideos(user.email, prisma);
      } else {
        resp = await getVideo(user.email, prisma, videoInputs.videoId);
      }

      return resp;
    }

    err.field = "user";
    err.message = "Invalid token";

    resp.errors = [err];

    return resp;
  }
}
