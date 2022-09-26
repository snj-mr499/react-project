import "reflect-metadata";
import 'dotenv-safe/config';
import { COOKIE_NAME, __prod__ } from "./constants";
//import { Post } from "./entities/Post";
import express from 'express';
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { HelloResolver } from "./resolvers/hello";
import { ApolloServer } from "apollo-server-express";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from 'express-session';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";



const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname, './migrations/*')],
        entities: [Post, User, Updoot],
    });
    await conn.runMigrations();

    //await Post.delete({});

    const app = express();

    let RedisStore = require("connect-redis")(session);
    //let RedisStore = connectRedis(session);
    //const redisClient = redis.createClient();
    // let redisClient = createClient({ legacyMode: true })
    //redisClient.connect().catch(console.error)
    const redis = new Redis(process.env.REDIS_URL);

    app.set('proxy', 1);
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        })
    );
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60* 24* 365 * 10,
                httpOnly: true,
                sameSite: 'lax',
                secure: __prod__,
                domain: __prod__ ? '.codeponder.com' : undefined,
            },
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        })
    );
    

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req, res, redis,
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader(),
        }),

        plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ 
        app, 
        cors: false,
    });

    app.listen(parseInt(process.env.PORT), () => {
        console.log('server started on local host 4000');
    });

    // const post = (await orm).em.create(Post, {title: "my first post"});
    // (await orm).em.persistAndFlush(post);
    
};


main().catch((err) => {
    console.error(err);
});