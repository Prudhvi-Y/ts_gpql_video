import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import http from "http";
import * as dotenv from "dotenv";
import { MyContext } from "./types";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/userLogin";

dotenv.config({ path: __dirname + "../.env" });

const main = async () => {
  const prisma = new PrismaClient();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ prisma, req, res }),
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_connectionParams, _websocket) => {
        console.log("connected to websocket");
        // if (connectionParams.hasOwnProperty('Authorization')){
        //     // console.log(connectionParams as string);
        //     const parsed: subsAuth = connectionParams as subsAuth;
        //     // console.log(parsed.Authorization);
        //     const token = parsed.Authorization.replace('Bearer ','');
        //     const userId = getTokenPayload(token);
        //     if (!userId) {
        //         return false;
        //     } else {
        //         return true;
        //     }
        // } else {
        //     return false;
        // }
      },
      onDisconnect: () => console.log("disconnected from websocket"),
    },
  });

  apolloServer.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`
    );
  });
};

main().catch((err) => {
  console.error(err);
});
